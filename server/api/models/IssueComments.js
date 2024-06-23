const mongoose = require('mongoose');
const {Schema} = mongoose;

const IssueCommentSchema = new Schema({
    issueId: String,
    commentId: String,
});

const IssueCommentModel = mongoose.model('IssueComment', IssueCommentSchema);

module.exports = IssueCommentModel;

