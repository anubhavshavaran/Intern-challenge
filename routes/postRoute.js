const { Router } = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");
const likeRouter = require("./likeRoute");
const commentRouter = require("./commentRoute");

const router = Router();

router.use('/:postId/likes', likeRouter);
router.use('/:postId/comments', commentRouter);

router.route('/')
    // .get(authController.protect, postController.getPost)
    .post(authController.protect, postController.createPost);

router.route('/:postId')
    .get(authController.protect, postController.getPost)

module.exports = router;