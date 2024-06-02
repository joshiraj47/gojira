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
            const {name, email, username, lastLogin, dateCreated} = await UserModel.findById(decryptedUserModel.id);
            res.json({name, email, username, lastLogin, dateCreated});
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
            const memberIds = members.map(member => member.id);
            users = users?.filter(user => !memberIds.includes(user.id))
            return res.json({users});
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

app.get("/userAvatar", (req, res) => {
    checkCookieTokenAndReturnUserData(req)
        .then((userData) => {
            return UserModel.findById(userData.id);
        })
        .then((data) => {
            return res.json({avatar: data.avatar});
        });
});

app.put("/userAvatar/update", (req, res) => {
    const {avatarName} = req.body;
    checkCookieTokenAndReturnUserData(req)
        .then((userData) => {
            return UserModel.findById(userData.id);
        })
        .then((data) => {
            UserModel.updateOne({email: data.email}, {$set: {avatar: avatarName}}).then((updatedDoc) => {
                return res.json("success");
            });
        });
});

app.post("/create-project", async (req, res) => {
    const {name, category, description} = req.body;
    checkCookieTokenAndReturnUserData(req)
        .then((userData) => UserModel.findById(userData.id))
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

app.put("/update-project/:projectId", async (req, res) => {
    const id= req.projectId;
    const {name, category, description} = req.body;
    checkCookieTokenAndReturnUserData(req)
        .then((userData) => UserModel.findById(userData.id))
        .then(() => {
            return ProjectModel.updateOne({id: id}, {$set: {name, category, description}})
                .then((projectDoc) => {
                    return res.json('update success');
                })
                .catch((err) => {
                    res.status(409).send(err.errorResponse.errmsg);
                });
        });
});

app.get("/projects", (req, res) => {
    let projects = [];
    let resultProjects = [];
    checkCookieTokenAndReturnUserData(req)
        .then((userData) => {
            return ProjectModel.find({}, {name:1, category: 1, creator: 1 });
        })
        .then((allProjects) => {
            projects = allProjects;
            const projectIds = allProjects?.map((project) => project.id);
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
        })
        .then((projectsUsers) => {
            const val = projects?.reduce((prev, currentValue) => {
                return prev.then(() => {
                    return new Promise(async (resolve) => {
                        const projectWithMemberDetails = {
                            id: currentValue.id,
                            name: currentValue.name,
                            category: currentValue.category,
                            creator: currentValue.creator,
                        };

                        let memberIdsArray = [];
                        projectsUsers.forEach((item) => {
                            if (item.projectId === currentValue.id) {
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
                return res.json({projects: resultProjects});
            })
        })
});

app.get("/projects-with-name-and-id", (req, res) => {
    checkCookieTokenAndReturnUserData(req)
        .then((userData) => {
            return ProjectModel.find({}, {name:1 });
        })
        .then((projects) => {
           res.json({projects});
        });
});

app.post("/project-by-id", (req, res) => {
    let result = {};
    const {projectId} = req.body;
    if (isNil(projectId)) throw new Error('project id cannot be null');
    checkCookieTokenAndReturnUserData(req)
        .then((userData) => {
            return ProjectModel.findById(projectId, {name:1, description: 1, category: 1 });
        })
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

app.post("/add-member-to-project", async (req, res) => {
    const {userId, projectId} = req.body;
    let projectUserIds = null;
    let project = null;
    let user = null;
    checkCookieTokenAndReturnUserData(req)
        .then((userData) => {
            if (isEmpty(userId) || isEmpty(projectId)) throw new Error();
            return ProjectUserModel.create({
                projectId,
                userId: userId,
            })
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

app.put("/delete-project/:projectId", async (req, res) => {
    const projectId= req?.params?.projectId;
    if (isNil(projectId)) throw new Error('project id cannot be null');
    checkCookieTokenAndReturnUserData(req)
        .then((userdata) => {
            return ProjectUserModel.deleteMany({projectId: projectId});
        })
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

app.post("/issues-by-project-id/:projectId", async (req, res) => {
    const projectId= req?.params?.projectId;
    if (isNil(projectId)) throw new Error('projectId cannot be null!!');
    checkCookieTokenAndReturnUserData(req)
        .then((usr) => {
            return IssueModel.find({projectId}, {createdAt: 1, priority: 1, status: 1, title: 1, type: 1, updatedAt: 1});
        })
        .then((issues) => {
            res.json({issues});
        });
})

function checkCookieTokenAndReturnUserData(request) {
    const {token} = request.cookies;
    return new Promise((resolve) => {
        if (token) {
            jwt.verify(token, jwtSecret, {},(err, decryptedUserModel) => {
                if (err) throw new Error(err);
                resolve(decryptedUserModel);
            });
        } else {
            throw new Error('No token found');
        }
    });
}


app.listen(PORT, ()=>{
    console.log(`Running on port ${PORT}`);
});
