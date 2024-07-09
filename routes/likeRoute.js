const { Router } = require("express");
const authController = require('./../controllers/authController');
const likeController = require('./../controllers/likeController');

const router = Router({ mergeParams: true });

router.route('/')
    .get(authController.protect, likeController.getLikes)
    .post(authController.protect, likeController.likePost)
    .delete(authController.protect, likeController.unlikePost);

module.exports = router;