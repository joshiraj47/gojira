const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const UserModel = require("./models/User");
const ProjectModel = require("./models/Project");
const ProjectUserModel = require("./models/ProjectUser");
const {isEmpty, isNil} = require("lodash/fp");
const IssueModel = require("./models/Issue");
const IssueCommentModel = require("./models/IssueComments");
const CommentModel = require("./models/Comments");
require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'test1213Secret65754Key';
const PORT = process.env.PORT || 4000;
const ENVIRONMENT = process.env.NODE_ENV;

app.use(express.json());
app.use(cookieParser());
if (ENVIRONMENT === 'PRODUCTION') {
    app.use(cors({
        credentials: true,
        origin: 'https://gojira-ui.vercel.app',
        methods: ["POST", "GET", "PUT","DELETE","OPTIONS"]
    }));
} else {
    app.use(cors({
        credentials: true,
        origin: 'http://192.168.0.102:3000',
        methods: ["POST", "GET", "PUT","DELETE","OPTIONS"]
    }));
}

app.use('/images', express.static('../avatars'))

mongoose.connect(process.env.MONGO_URL);

app.get("/", (req, res) => {
    res.json('cool');
});

app.post("/login", async (req, res) => {
    const {email, password} = req.body;
    return UserModel.findOne({email})
        .then((userDoc) => {
            const isPassCorrect =  bcrypt.compareSync(password, userDoc.password);
            if (isPassCorrect) {
                console.log(userDoc.email);
                UserModel.updateOne({email: userDoc.email}, {$set: {lastLogin: new Date().getTime()}}).then((updatedDoc) => {
                    jwt.sign({email: userDoc.email, id: userDoc._id}, jwtSecret, {}, (err, token) => {
                        if (err) throw err;
                        if (ENVIRONMENT === 'PRODUCTION') {
                            return res
                                .cookie("token", token, { withCredentials: true, sameSite: "none", secure: true, httpOnly: true })
                                .json("success");
                        } else {
                            return res
                                .cookie("token", token, { withCredentials: true, sameSite: "lax", secure: false, httpOnly: true })
                                .json("success");
                        }
                    });
                });

            } else throw new Error();
        })
        .catch((err) => res.status(401).send(err.errorResponse));
});

app.post("/registerUser", async (req, res) => {
    const {name, username, email, password} = req.body;
    const colors = ["#A9294F", "#ED6663", "#389393", "#D82148", "#8C5425", "#6F38C5"];
    return UserModel.create({
        name,
        username,
        email,
        password: bcrypt.hashSync(password, bcryptSalt),
        dateCreated: new Date().getTime(),
        lastLogin: null,
        defaultAvatarBgColor: colors[Math.floor(Math.random() * colors.length)]
    }).then((userDoc) => {
        return res.json(userDoc);
    })
        .catch((err) => {
            res.status(409).send(err.errorResponse.errmsg);
        });

});

app.get("/userProfile", (req, res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, decryptedUserModel) => {
            if (err) throw err;
            const {name, email, username, lastLogin, dateCreated, id, defaultAvatarBgColor} = await UserModel.findById(decryptedUserModel.id);
            res.json({name, email, username, lastLogin, dateCreated, id, defaultAvatarBgColor});
        });
    } else {
        res.json(null);
    }
});

app.post("/searchUsers", (req, res) => {
    const {token} = req.cookies;
    const {searchTerm, selectedProject: {members} = {}} = req.body;
    if (token && !isEmpty(searchTerm)) {
        UserModel.find({'name': {'$regex': searchTerm , '$options': 'i'}}, {name: 1, defaultAvatarBgColor: 1}).then(users => {
            const memberIds = members?.map(member => member.id);
            if (memberIds) users = users?.filter(user => !memberIds?.includes(user.id));
            return res.json({users});
        });
    } else {
        res.json({});
    }
});

app.post("/searchProject", (req, res) => {
    const {token} = req.cookies;
    const {searchTerm} = req.body;
    if (token && !isEmpty(searchTerm)) {
        ProjectModel.find({'name': {'$regex': searchTerm , '$options': 'i'}}, {name: 1, id: "$_id", _id: 0}).then(projects => {
            return res.json({projects});
        });
    } else {
        res.json({});
    }
});

app.get("/defaultAvatars", (req, res) => {
    const directoryPath = '../avatars';
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        // Send the list of files as a JSON response
        let i = 0;
        files = files.map(file => {
            return {
                name: file,
                id: i++,
            }
        })
        res.json({ files });
    });
})

app.get("/userAvatar", checkCookieTokenAndReturnUserData, (req, res) => {
    return UserModel.findById(req.userData.id)
        .then((data) => {
            return res.json({avatar: data.avatar});
        });
});

app.put("/userAvatar/update", checkCookieTokenAndReturnUserData, (req, res) => {
    const {avatarName} = req.body;
    return UserModel.findById(req.userData.id)
        .then((data) => {
            UserModel.updateOne({email: data.email}, {$set: {avatar: avatarName}}).then((updatedDoc) => {
                return res.json("success");
            });
        });
});

app.post("/create-project", checkCookieTokenAndReturnUserData, async (req, res) => {
    const {name, category, description} = req.body;
    return UserModel.findById(req.userData.id)
        .then(({name: fullName}) => {
            return ProjectModel.create({
                name,
                category,
                description,
                creator: fullName
            }).then((projectDoc) => {
                const {name, category} = projectDoc;
                return res.json({name, category});
            })
                .catch((err) => {
                    res.status(409).send(err.errorResponse.errmsg);
                });
        });
});

app.put("/update-project/:projectId", checkCookieTokenAndReturnUserData, async (req, res) => {
    const id= req.projectId;
    const {name, category, description} = req.body;
    return ProjectModel.updateOne({id: id}, {$set: {name, category, description}})
        .then((projectDoc) => {
            return res.json('update success');
        })
        .catch((err) => {
            res.status(409).send(err.errorResponse.errmsg);
        });
});

app.get("/projects", checkCookieTokenAndReturnUserData, async (req, res) => {
    let { page, pageSize } = req.query;
    let projects = [];
    let resultProjects = [];
    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 10;

    projects = await ProjectModel.aggregate([
        {
            $project: {name:1, category: 1, creator: 1, id:1 }
        },
        {
            $facet: {
                metadata: [{ $count: 'totalCount' }],
                data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
            },
        },
    ]);

    const projectIds = projects[0]?.data?.map((project) => project._id.valueOf());
    const query = { projectId: { $in: projectIds } };
    //find(query, {projectId: 1, userId: 1, _id: 0});
    return ProjectUserModel.aggregate([
        {
            $match: {
                projectId: { $in: projectIds }
            }
        },
        {
            $group: {
                _id: "$projectId",
                users: {
                    $push: "$userId"
                }
            }
        },
        {
            $project: {
                _id: 0,  // Exclude the default _id field
                projectId: "$_id",
                users: 1
            }
        }
    ])
        .then((projectsUsers) => {
            const val = projects[0]?.data?.reduce((prev, currentValue) => {
                return prev.then(() => {
                    return new Promise(async (resolve) => {
                        const projectWithMemberDetails = {
                            id: currentValue._id.valueOf(),
                            name: currentValue.name,
                            category: currentValue.category,
                            creator: currentValue.creator,
                        };

                        let memberIdsArray = [];
                        projectsUsers.forEach((item) => {
                            if (item.projectId === currentValue._id.valueOf()) {
                                memberIdsArray.push(...item.users);
                            }
                        });
                        const membersPromises = memberIdsArray?.map((memberId) => UserModel.findById(memberId, {name:1, defaultAvatarBgColor: 1}));

                        await Promise.all(membersPromises)
                            .then((resultArray) => {
                                projectWithMemberDetails.members = resultArray?.map((user)=> ({
                                    name: user.name,
                                    avatarBgColor: user.defaultAvatarBgColor,
                                    id: user.id
                                }));
                                resultProjects.push(projectWithMemberDetails);
                                resolve(resultProjects);
                            });
                    });
                });
            }, Promise.resolve({}));

            val.then(() => {
                return res.json({projects: {
                        metadata: { totalCount: projects[0]?.metadata[0]?.totalCount, totalPages: Math.ceil(projects[0]?.metadata[0]?.totalCount/pageSize || 0), page, pageSize },
                        data: resultProjects,
                    }});
            })
        });
});

app.get("/projects-with-name-and-id", checkCookieTokenAndReturnUserData, (req, res) => {
    return ProjectModel.find({}, {name:1 })
        .then((projects) => {
            res.json({projects});
        });
});

app.post("/project-by-id", checkCookieTokenAndReturnUserData, (req, res) => {
    let result = {};
    const {projectId} = req.body;
    if (isNil(projectId)) throw new Error('project id cannot be null');
    return ProjectModel.findById(projectId, {name:1, description: 1, category: 1 })
        .then((project) => {
            result = project;
            const query = { projectId };
            return ProjectUserModel.find(query, {userId: 1, _id:0});
        })
        .then((userIdsObjectArray) => {
            const userIdsArray = userIdsObjectArray.map(obj => obj.userId);
            const membersPromises = userIdsArray?.map((memberId) => UserModel.findById(memberId, {name:1, defaultAvatarBgColor: 1}));
            const projectWithMemberDetails = {
                id: result.id,
                description: result.description,
                name: result.name,
                category: result.category,
            };
            Promise.all(membersPromises).then((resultArray) => {
                projectWithMemberDetails.members = resultArray?.map((user)=> ({
                    name: user.name,
                    avatarBgColor: user.defaultAvatarBgColor,
                    id: user.id
                }));
                return res.json({project: projectWithMemberDetails});
            });
        });
});

app.post("/add-member-to-project", checkCookieTokenAndReturnUserData, async (req, res) => {
    const {userId, projectId} = req.body;
    let projectUserIds = null;
    let project = null;
    let user = null;
    if (isEmpty(userId) || isEmpty(projectId)) throw new Error();
    return ProjectUserModel.create({
        projectId,
        userId: userId,
    })
        .then(() => {
            const query = { projectId: projectId };
            return ProjectUserModel.find(query, {userId: 1, _id:0});
        })
        .then((userIdObjectsArray) => {
            projectUserIds = userIdObjectsArray?.map(obj => obj.userId);
            return ProjectModel.findById(projectId, {name:1, category: 1, creator: 1 });
        })
        .then((prjct) => {
            project = prjct;
            const query = { _id: { $in: projectUserIds } };
            return UserModel.find(query, {name:1, defaultAvatarBgColor: 1 });
        })
        .then((users) => {
            const updatedMembers = users?.map((user)=> ({
                name: user.name,
                avatarBgColor: user.defaultAvatarBgColor,
                id: user.id
            }));
            return res.json({updatedProject: {
                id: project.id,
                name: project.name,
                category: project.category,
                creator: project.creator,
                members: updatedMembers,
            }});
        });
});

app.put("/delete-project/:projectId", checkCookieTokenAndReturnUserData, async (req, res) => {
    const projectId= req?.params?.projectId;
    if (isNil(projectId)) throw new Error('project id cannot be null');
    return ProjectUserModel.deleteMany({projectId: projectId})
        .then(() => {
            return ProjectModel.deleteOne({_id: projectId});
        })
        .then(() => {
            return res.json({projectId});
        })
        .catch((err) => {
            res.status(409).send(err?.errorResponse?.errmsg);
        });
});

app.put('/update-issue/:issueId', checkCookieTokenAndReturnUserData, async (req, res) => {
    const issueId= req.params?.issueId;
    const {payload} = req.body;
    const {estimate = null, description = null, priority = null, status = null, type = null, assigneeId = null} = payload;
    if (isNil(issueId)) throw new Error('issue id cannot be null');
    Promise.resolve()
        .then(() => {
            switch (true) {
                case !isNil(estimate):
                    return IssueModel.findOneAndUpdate({_id: issueId}, {$set: {estimate, updatedAt: new Date().getTime()}}, { returnOriginal: false });
                case !isNil(description):
                    return IssueModel.findOneAndUpdate({_id: issueId}, {$set: {description, updatedAt: new Date().getTime()}}, { returnOriginal: false });
                case !isNil(priority):
                    return IssueModel.findOneAndUpdate({_id: issueId}, {$set: {priority, updatedAt: new Date().getTime()}}, { returnOriginal: false });
                case !isNil(status):
                    return IssueModel.findOneAndUpdate({_id: issueId}, {$set: {status, updatedAt: new Date().getTime()}}, { returnOriginal: false });
                case !isNil(type):
                    return IssueModel.findOneAndUpdate({_id: issueId}, {$set: {type, updatedAt: new Date().getTime()}}, { returnOriginal: false });
                case !isNil(assigneeId):
                    return IssueModel.findOneAndUpdate({_id: issueId}, {$set: {assigneeId, updatedAt: new Date().getTime()}}, { returnOriginal: false })
                        .then((updatedDoc) => {
                            return ProjectUserModel.updateOne(
                                {
                                    projectId: updatedDoc.projectId,
                                    userId: assigneeId
                                },
                                {
                                    $setOnInsert: {projectId: updatedDoc.projectId, userId: assigneeId}
                                },
                                {upsert: true}
                            )
                                .then(() => {
                                    return updatedDoc;
                                });
                        });
                default:
                    break;
            }
        })
        .then(async (issueDoc) => {
            const issueWithMemberDetails = {
                createdAt: issueDoc.createdAt,
                priority: issueDoc.priority,
                status: issueDoc.status,
                title: issueDoc.title,
                type: issueDoc.type,
                estimate: issueDoc.estimate,
                timeSpent: issueDoc.timeSpent,
                updatedAt: issueDoc.updatedAt,
                description: issueDoc.description,
                id: issueDoc.id
            };
            return UserModel.findById(issueDoc.assigneeId, {name:1, defaultAvatarBgColor: 1})
                .then((assignee) => {
                    issueWithMemberDetails.assignee = assignee;
                })
                .then(() => {
                    return UserModel.findById(issueDoc.reporterId, {name:1, defaultAvatarBgColor: 1});
                })
                .then((reporter) => {
                    issueWithMemberDetails.reporter = reporter;
                    return issueWithMemberDetails;
                });

        })
        .then((issueDoc) => {
            return res.json({updatedIssue: issueDoc});
        })
        .catch((err) => {
            res.status(409).send(err.errorResponse.errmsg);
        });
});

app.post("/issues-by-project-id/:projectId", checkCookieTokenAndReturnUserData, async (req, res) => {
    const projectId= req?.params?.projectId;
    let resultIssues = [];
    if (isNil(projectId)) throw new Error('projectId cannot be null!!');
    return IssueModel.find({projectId}, {createdAt: 1, priority: 1, status: 1, title: 1, type: 1, updatedAt: 1, assigneeId: 1, estimate: 1, timeSpent: 1, description: 1, reporterId: 1})
        .then((issues) => {
            const val = issues?.reduce((prev, currentValue) => {
                return prev.then(() => {
                    return new Promise(async (resolve) => {
                        const issueWithMemberDetails = {
                            createdAt: currentValue.createdAt,
                            priority: currentValue.priority,
                            status: currentValue.status,
                            title: currentValue.title,
                            type: currentValue.type,
                            estimate: currentValue.estimate,
                            timeSpent: currentValue.timeSpent,
                            updatedAt: currentValue.updatedAt,
                            description: currentValue.description,
                            id: currentValue.id
                        };

                        await UserModel.findById(currentValue.assigneeId, {name:1, defaultAvatarBgColor: 1})
                            .then((assignee) => {
                                issueWithMemberDetails.assignee = assignee;
                            })
                            .then(() => {
                                return UserModel.findById(currentValue.reporterId, {name:1, defaultAvatarBgColor: 1});
                            })
                            .then((reporter) => {
                                issueWithMemberDetails.reporter = reporter;
                                resultIssues.push(issueWithMemberDetails);
                                resolve(resultIssues);
                            });
                    });
                });
            }, Promise.resolve({}));

            val.then(() => {
                return res.json({issues: resultIssues});
            });
        });
});

app.post('/create-issue', checkCookieTokenAndReturnUserData, async (req, res) => {
    const {...payload} = req.body;
    return IssueModel.create({
        ...payload,
        status: 'backlog',
        reporterId: req.userData.id,
        updatedAt: new Date().getTime(),
        createdAt: new Date().getTime()
    })
        .then((issueDoc) => {
            return ProjectUserModel.updateOne(
                {
                    projectId: issueDoc.projectId,
                    userId: issueDoc.assigneeId
                },
                {
                    $setOnInsert: {projectId: issueDoc.projectId, userId: issueDoc.assigneeId}
                },
                {upsert: true}
            )
                .then(() => {
                    return issueDoc;
                });

        })
        .then((createdIssue) => {
            res.json({createdIssue});
        });
});

app.put("/delete-issue/:issueId", checkCookieTokenAndReturnUserData, async (req, res) => {
    const issueId= req?.params?.issueId;
    if (isNil(issueId)) throw new Error('issue id cannot be null');
    return IssueModel.deleteOne({_id: issueId})
        .then(() => {
            return res.json({issueId});
        })
        .catch((err) => {
            res.status(409).send(err?.errorResponse?.errmsg);
        });
});

app.post("/get-comments/:issueId", checkCookieTokenAndReturnUserData, async(req, res) => {
    const issueId= req?.params?.issueId;
    if (!issueId) return res.json();
    let resultComments = [];
    return IssueCommentModel.find({issueId})
        .then((issueComments) => {
            const commentIdsList = issueComments?.map(obj => obj.commentId);
            const query = { _id: { $in: commentIdsList } };
            return CommentModel.find(query);
        })
        .then((comments) => {
            const val = comments?.reduce((prev, currentValue) => {
                return prev.then(() => {
                    return new Promise(async (resolve) => {
                        const commentWithCommenterDetails = {
                            updatedAt: currentValue.updatedAt,
                            description: currentValue.description,
                            id: currentValue._id.valueOf()
                        };

                        await UserModel.findById(currentValue.commenterId, {name:1, defaultAvatarBgColor: 1})
                            .then((commentor) => {
                                commentWithCommenterDetails.commentor = commentor;
                                resultComments.push(commentWithCommenterDetails);
                                resolve(resultComments);
                            });
                    });
                });
            }, Promise.resolve({}));

            val.then(() => {
                return res.json({comments: resultComments});
            });
        });
});

app.post("/add-comment", checkCookieTokenAndReturnUserData, async (req, res) => {
    const {issueId, description} = req.body;
    let createdComment = null;
    if (isNil(issueId)) throw new Error('issue id cannot be null');
    return CommentModel.create({description, commenterId: req.userData.id, updatedAt: new Date().getTime()})
        .then((commentDoc) => {
            return IssueCommentModel.updateOne(
                {
                    issueId,
                    commentId: commentDoc._id
                },
                {
                    $setOnInsert: {issueId, commentId: commentDoc._id}
                },
                {upsert: true}
            )
                .then(() => {
                    return commentDoc;
                });

        })
        .then((createdCommentDoc) => {
            createdComment = {
               id: createdCommentDoc._id.valueOf(),
               description: createdCommentDoc.description,
               updatedAt: createdCommentDoc.updatedAt
            };
            return UserModel.findById(createdCommentDoc.commenterId, {name:1, defaultAvatarBgColor: 1});
        })
        .then((commentor) => {
            createdComment.commentor = commentor;
            res.json({createdComment});
        })
});

app.put("/update-comment/:commentId", checkCookieTokenAndReturnUserData, async (req, res) => {
    const commentId= req?.params?.commentId;
    const {description} = req.body;
    if (isNil(commentId)) throw new Error('comment id cannot be null');
    return CommentModel.findOneAndUpdate({_id: commentId}, {$set: {description, updatedAt: new Date().getTime()}}, { returnOriginal: false })
        .then((updatedComment) => {
            res.json({updatedComment});
        });
});

app.put("/delete-comment/:commentId", checkCookieTokenAndReturnUserData, async (req, res) => {
    const commentId= req?.params?.commentId;
    if (isNil(commentId)) throw new Error('comment id cannot be null');
    return IssueCommentModel.deleteMany({commentId: commentId})
        .then(() => {
            return CommentModel.deleteOne({_id: commentId});
        })
        .then(() => {
            return res.json({commentId});
        })
        .catch((err) => {
            res.status(409).send(err?.errorResponse?.errmsg);
        });
});

function checkCookieTokenAndReturnUserData(request, res, next) {
    const {token} = request.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {},(err, decryptedUserModel) => {
            if (err) {
                return res
                    .cookie("token", '', { expires: new Date(0) })
                    .json(err);
            }
            request.userData = decryptedUserModel;
            next();
        });
    } else {
        return res
            .cookie("token", '', { expires: new Date(0) })
            .json('No token found');
    }
}
}


app.listen(PORT, ()=>{
    console.log(`Running on port ${PORT}`);
});
