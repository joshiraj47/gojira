const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const UserModel = require("./models/User");
const ProjectModel = require("./models/Project");
require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'test1213Secret65754Key';
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'https://gojira-frontend.vercel.app',
    methods: ["POST", "GET", "PUT","DELETE","OPTIONS"]
}));
app.use('/images', express.static('../src/avatars'))

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
                        return res
                            .cookie("token", token, { withCredentials: true, sameSite: "none", secure: true, httpOnly: true })
                            .json("success");
                    });
                });

            } else throw new Error();
        })
        .catch((err) => res.status(401).send(err.errorResponse));
});

app.post("/registerUser", async (req, res) => {
    const {name, username, email, password} = req.body;
    return UserModel.create({
        name,
        username,
        email,
        password: bcrypt.hashSync(password, bcryptSalt),
        dateCreated: new Date().getTime(),
        lastLogin: null
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

app.get("/defaultAvatars", (req, res) => {
    const directoryPath = '../src/avatars';
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

function checkCookieTokenAndReturnUserData(request) {
    const {token} = request.cookies;
    return new Promise((resolve, reject) => {
        if (token) {
            jwt.verify(token, jwtSecret, {},(err, decryptedUserModel) => {
                if (err) reject(err);
                resolve(decryptedUserModel);
            });
        } else {
            reject('No token found');
        }
    });
}


app.listen(PORT, ()=>{
    console.log(`Running on port ${PORT}`);
});
