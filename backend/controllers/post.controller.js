import notificationModel from '../models/notification.model.js';
import postModel from '../models/post.model.js';
import userModel from '../models/user.model.js';

import { v2 as cloudinary } from 'cloudinary';

export const createPostController = async (req, res) => {
    try{
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        if(!text && !img){
            return res.status(400).json({ error: "Post must have some text or image" })
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).json({ error: "User not found" });
        }

        const newPost = await postModel.create({
            user: userId,
            text: text,
            img: img
        })

        await newPost.save();
        res.status(201).json(newPost);
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deletePostController = async (req, res) => {
    try{
        const post = await postModel.findById(req.params.id);
        if(!post){
            return res.status(404).json({ error: "No post found" });
        }

        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({ error: "You are not authorized to delete this post" });
        }

        if(post.img){
            const imgId = post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await postModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" })
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const commentOnPostController = async (req, res) => {
    try{
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if(!text){
            return res.status(400).json({ error: "Some text required to comment" });
        }

        const post = await postModel.findById(postId);
        if(!post){
            return res.status(404).json({ error: "Post not found" });
        }

        const comment = { user: userId, text: text };

        post.comments.push(comment);
        await post.save();

        res.status(200).json(post);
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const likeUnlikePostController = async (req, res) => {
    try{
        const userId = req.user._id;
        const { id:postId } = req.params;

        const post = await postModel.findById(postId);
        if(!post){
            return res.status(404).json({ error: "Post not found" });
        }

        const userLikedPost = post.likes.includes(userId);
        if(userLikedPost){
            await postModel.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await userModel.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes); 
        }
        else{
            post.likes.push(userId);
            await userModel.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
            await post.save();

            const notification = await notificationModel.create({
                from: userId,
                to: post.user,
                type: "like"
            });
            await notification.save();

            const updatedLikes = post.likes;
            res.status(200).json(updatedLikes);
        }
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getAllPostsController = async (req, res) => {
    try{
        const allPosts = await postModel.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        });

        if(allPosts.length === 0){
            return res.status(200).json([]);
        }

        res.status(200).json(allPosts)
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getLikedPostsController = async (req, res) => {
    const userId = req.params.id;
    try{
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).json({ error: "User not found" });
        }

        const likedPosts = await postModel.find({ _id: { $in: user.likedPosts } })
        .populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        });

        res.status(200).json(likedPosts);
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getFollowingPostsController = async (req, res) => {
    try{
        const userId = req.user._id;

        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).json({ error: "Internal Server Error" });
        }

        const following = user.following;

        const feedPosts = await postModel.find({ user: { $in: following }}).sort({ createdAt: -1 })
        .populate({
            path: "user", 
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        });

        res.status(200).json(feedPosts);
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getUserPostsController = async (req, res) => {
    try{
        const { username } = req.params;

        const user = await userModel.findOne({ username: username });
        if(!user){
            return res.status(404).json({ error: "User not found" });
        }

        const userPosts = await postModel.find({ user: user._id }).sort({ createdAt: -1 })
        .populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        });
        
        res.status(200).json(userPosts);
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}