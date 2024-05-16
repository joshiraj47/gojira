const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name: String,
    username: String,
    email: {type: String, unique: true},
    password: String,
    dateCreated: String,
    lastLogin: String,
    avatar: String,
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;

