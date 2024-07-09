const Like = require("../models/likeModel");
const catchAsync = require("../utils/catchAsync");

exports.likePost = catchAsync(async (req, res, next) => {
    const postId = req.params.postId;
    const { _id: userId } = req.user;
    
    const like = await Like.create({
        post: postId,
        user: userId
    });
    
    res.status(200).json({
        status: 'success',
        data: {
            like
        }
    });
});

exports.unlikePost = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    await Like.findOneAndDelete({
        user: userId
    });

    res.status(204).json({
        status: 'success'
    });
});

exports.getLikes = catchAsync(async (req, res, next) => {
    const { postId } = req.params;

    const likes = await Like.find({
        post: postId
    });

    res.status(200).json({
        status: 'success',
        length: likes.length,
        data: {
            likes
        }
    });
});