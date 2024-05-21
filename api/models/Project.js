const mongoose = require('mongoose');
const {Schema} = mongoose;

const ProjectSchema = new Schema({
    name: String,
    category: String,
    description: String,
    creator: String
});

const ProjectModel = mongoose.model('Project', ProjectSchema);

module.exports = ProjectModel;

