const { Router } = require("express");
const authController = require('./../controllers/authController');
const commentController = require('./../controllers/commentController');

const router = Router({ mergeParams: true });

router.use(authController.protect);

router.route('/')
    .get(commentController.getComments)
    .post(commentController.createComment);

router.route('/:commentId')
    .delete(commentController.deleteComment);

module.exports = router;