const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const UserModel = require("./models/User");
require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'test1213Secret65754Key';

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://192.168.0.102:3000'
}));

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
    res.json('cool');
});

app.post("/login", async (req, res) => {
    const {email, password} = req.body;
    return UserModel.findOne({email})
        .then((userDoc) => {
            const isPassCorrect =  bcrypt.compareSync(password, userDoc.password);
            if (isPassCorrect) {
                jwt.sign({email: userDoc.email, id: userDoc._id}, jwtSecret, {}, (err, token) => {
                    if (err) throw err;
                    return res.cookie("token", token).json("success");
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
        password: bcrypt.hashSync(password, bcryptSalt)
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
            const {name, email, _id} = await UserModel.findById(decryptedUserModel.id);
            res.json({name, email, _id});
        });
    } else {
        res.json(null);
    }
})

app.listen(4000);
