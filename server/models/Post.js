const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const postSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please enter title'],
    },
    description: {
        type: String,
        required: [true, 'This field cannot be empty'],
    },
    category: String,
    subcategory:String,
    section: String,
    upvote: Number,
    downvote: Number,
    likes: Number,
    author: {type:Schema.Types.ObjectId, ref:'User'}
},{
    timestamps: true
});

const PostModel = model('Post',postSchema);

module.exports = PostModel;