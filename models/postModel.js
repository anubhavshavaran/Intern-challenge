const { default: mongoose } = require("mongoose");

const postSchema =  mongoose.Schema({
    content: {
        type: String,  
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
        type: Number
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;