const catchAsync = require("../utils/catchAsync");
const Comment = require("../models/commentModel");

exports.createComment = catchAsync(async (req, res, next) => {
    const postId = req.params.postId;
    const { _id: userId } = req.user;
    
    const comment = await Comment.create({
        post: postId,
        user: userId,
        content: req.body.content
    });
    
    res.status(200).json({
        status: 'success',
        data: {
            comment
        }
    });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;

    await Comment.findOneAndDelete({
        user: userId
    });

    res.status(204).json({
        status: 'success'
    });
});

exports.getComments = catchAsync(async (req, res, next) => {
    const { postId } = req.params;

    const comments = await Comment.find({
        post: postId
    });

    res.status(200).json({
        status: 'success',
        length: comments.length,
        data: {
            comments
        }
    });
});