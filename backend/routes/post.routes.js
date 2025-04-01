import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
    commentOnPostController,
    createPostController,
    deletePostController,
    getAllPostsController,
    getFollowingPostsController,
    getLikedPostsController,
    getUserPostsController,
    likeUnlikePostController,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", isLoggedIn, getAllPostsController);
router.get("/all/followingposts", isLoggedIn, getFollowingPostsController);
router.get('/user/:username', isLoggedIn, getUserPostsController);
router.post("/create", isLoggedIn, createPostController);
router.post("/like/:id", isLoggedIn, likeUnlikePostController);
router.get("/all/likes/:id", isLoggedIn, getLikedPostsController);
router.post("/comment/:id", isLoggedIn, commentOnPostController);
router.delete("/delete/:id", isLoggedIn, deletePostController);

export default router;
