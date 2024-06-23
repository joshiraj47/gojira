const mongoose = require('mongoose');
const {Schema} = mongoose;

const CommentSchema = new Schema({
    description: String,
    updatedAt: String,
    commenterId: String,
});

const CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = CommentModel;

