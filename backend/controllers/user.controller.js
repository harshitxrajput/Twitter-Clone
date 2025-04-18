import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

import notificationModel from '../models/notification.model.js';
import userModel from '../models/user.model.js';

export const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try{
        const user = await userModel.findOne({ username }).select('-password');
        if(!user){
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error : "Internal Server Error" });
    }
}

export const getSuggesstedUser = async (req, res) => {
    try{
        const userId = req.user._id;
        const usersFollowedByMe = await userModel.findById(userId).select("following");

        const users = await userModel.aggregate([
            {
                $match: {
                    _id: { $ne:userId }
                }
            },
            { $sample: { size: 10 } }
        ]);

        const filteredUsers = users.filter(user => !usersFollowedByMe.following.includes(user._id));

        const suggestedUsers = filteredUsers.slice(0,4);
        suggestedUsers.forEach(user => user.password=null);

        res.status(200).json(suggestedUsers);
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const followUnfollowUser = async (req, res) => {
    const { id } = req.params;

    try{
        const userToFollow = await userModel.findById(id);
        const currentUser = await userModel.findById(req.user._id);
        
        if(id === req.user._id.toString()){
            return res.status(404).json({ error: "You can't follow or unfollow yourself" });
        }

        if(!userToFollow || !currentUser){
            return res.status(404).json({ error: "User not found" });
        }

        const isFollowing = userToFollow.followers.includes(currentUser._id);
        if(isFollowing){
            await userModel.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await userModel.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

            res.status(200).json({ message: "User unfollowed successfully" });
        }
        else{
            await userModel.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await userModel.findByIdAndUpdate(req.user._id, { $push: { following: id } });

            const newNotifcation = await notificationModel.create({
                type: "follow",
                from: req.user._id,
                to: userToFollow._id
            });
            await newNotifcation.save();

            return res.status(200).json({ message: "User followed successfully" });
        }
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateUserProfile = async (req, res) => {
    const { username, fullname, email, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;
    try{
        let user = await userModel.findById(userId);
        if(!user){
            return res.status(404).json({ error: "User not found" });
        }

        if((!newPassword && currentPassword) || (!currentPassword && newPassword)){
            return res.status(400).json({ error: "Plase provide both current password and new password" });
        }

        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch){
                return res.status(400).json({ error: "Invalid current password" });
            }

            if(newPassword.length<6){
                return res.status(400).json({ error: "Password must be at least 6 characters long" })
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if(profileImg){
            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
            }

            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }
        
        if(coverImg){
            if(user.coverImg){
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0])
            }

            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }

        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();
        user.password = null;
        
        return res.status(200).json(user);
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}