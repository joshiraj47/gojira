const mongoose = require('mongoose');
const {Schema} = mongoose;

const ProjectUserSchema = new Schema({
    projectId: String,
    userId: String,
});

const ProjectUserModel = mongoose.model('ProjectUser', ProjectUserSchema);

module.exports = ProjectUserModel;

