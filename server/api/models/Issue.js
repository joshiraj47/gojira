const mongoose = require('mongoose');
const {Schema} = mongoose;

const IssueSchema = new Schema({
    projectId: String,
    reporterId: String,
    estimate: Number,
    description: String,
    createdAt: String,
    priority: Number,
    status: String,
    timeSpent: Number,
    title: String,
    type: String,
    updatedAt: String,
    assigneeId: String,
});

const IssueModel = mongoose.model('Issue', IssueSchema);

module.exports = IssueModel;

