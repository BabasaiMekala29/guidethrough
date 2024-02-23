const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const postSchema = new Schema({
    title: String,
    description: String,
    category: String,
    subsection: String,
    upvote: Number,
    downvote: Number,
    likes: Number,
    author: {type:Schema.Types.ObjectId, ref:'User'}
},{
    timestamps: true
});

const PostModel = model('Post',postSchema);

module.exports = PostModel;