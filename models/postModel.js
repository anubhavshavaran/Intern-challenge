const { default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema({
    content: {
        type: String
    },
    postedAt: {
        type: Date,
        default: Date.now()
    },
    image: {
        type: String
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A user is required']
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: {
        type: Number,
        default: 0
    }
});

postSchema.index({user: 1});

// postSchema.virtual('isLikedByUser')

// postSchema.pre(/^find/, async function (next) {
//     const user = this.getQuery().userToBeSearched;

//     console.log(user);
//     const post = this._id;

//     const like = await Like.findOne({post, user});

//     console.log(like);

//     if (like) this.isLikedByUser = true;
//     next();
// });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;