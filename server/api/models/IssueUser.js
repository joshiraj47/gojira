const mongoose = require('mongoose');
const {Schema} = mongoose;

const IssueUserSchema = new Schema({
    issueId: String,
    userId: String,
});

const IssueUserModel = mongoose.model('IssueUser', IssueUserSchema);

module.exports = IssueUserModel;

