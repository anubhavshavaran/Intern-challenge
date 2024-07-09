const { default: mongoose } = require("mongoose");
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

likeSchema.statics.incrementLike = async function (postId) {
    // const post = await Post.findByIdAndUpdate(postId, {
    //     $inc: { likes: 1 }
    // }, {
    //     new: true,
    //     runValidators: true
    // });

    const post = await Post.findById(postId);

    console.log(post);
}

likeSchema.post('save', function () {
    this.constructor.incrementLike(this.post);
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;