const mongoose = require('mongoose');
const Post = require("./postModel");

const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: [true, 'A post is required.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A user is required.']
    },
    content: {
        type: String,
        required: [true, 'A comment needs some text.']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

commentSchema.statics.decrementComment = async function (postId) {
    await Post.findByIdAndUpdate(postId, {
        $dec: { comments: 1 },
    }, {
        new: false,
        runValidators: true
    });
}

commentSchema.statics.incrementComment = async function (postId) {
    await Post.findByIdAndUpdate(postId, {
        $inc: { comments: 1 }
    }, {
        new: false,
        runValidators: true
    });
}

commentSchema.post('save', function () {
    this.constructor.incrementComment(this.post);
});

commentSchema.pre('findOneAndDelete', function (next) {
    this.constructor.decrementComment(this.post);

    next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;