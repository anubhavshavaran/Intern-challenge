const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Post = require('../models/postModel');

exports.getPost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.postId).select('-__v');

    res.status(200).json({
        status: 'success',
        data: {
            post
        }
    });
});

exports.getUserPost = async (req, res, next) => {
    const post = await Post.find({
        user: {$eq: req.params.postId}
    }).select('-__v');
    
    res.status(200).json({
        status: 'success',
        data: {
            post
        }
    });
}

exports.createPost = catchAsync(async (req, res, next) => {
    const { content, image } = req.body;
    const {id} = req.user;

    const newPost = await Post.create({
        content,
        image,
        user: id
    });

    res.status(200).json({
        status: 'success',
        data: {
            newPost
        }
    });
});