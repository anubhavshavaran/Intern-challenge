const mongoose = require("mongoose");
const Post = require("./postModel");

const likeSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: [true, 'A post is required.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A user is required.']
    }
});

likeSchema.index({ user: 1, post: 1 }, { unique: true });

likeSchema.statics.incrementLike = async function (postId) {
    await Post.findByIdAndUpdate(postId, {
        $inc: { likes: 1 }
    }, {
        new: false,
        runValidators: true
    });
}

likeSchema.statics.decrementLike = async function (postId) {
    await Post.findByIdAndUpdate(postId, {
        $inc: { likes: -1 }
    }, {
        new: false,
        runValidators: true
    });
}

likeSchema.pre('findOneAndDelete', function () {
    this.constructor.decrementLike(this.post);
});

likeSchema.post('save', function () {
    this.constructor.incrementLike(this.post);
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;