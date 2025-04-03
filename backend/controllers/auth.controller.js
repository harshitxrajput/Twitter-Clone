import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
import userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signupController = async (req, res)=>{
    try{
        const { username, fullname, email, password } = req.body;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({ error: "Invalid Email format" });
        }

        const exisitingUser = await userModel.findOne({ username: username });
        if(exisitingUser){
            return res.status(400).json({ error: "Username is already taken" });
        }

        const exisitingEmail = await userModel.findOne({ email: email });
        if(exisitingEmail){
            return res.status(400).json({ error: "Email is already taken" });
        }

        if(password.length<6){
            return res.status(400).json({ error: "Password must be of 6 characters long" });
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userModel.create({
            username: username,
            fullname: fullname,
            email: email,
            password: hashedPassword
        });

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
                bio: newUser.bio,
                link: newUser.link
            });
        }
        else{
            return res.status(400).json({ error: "Invalid user data "});
        }
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const loginController = async (req, res)=>{
    try{
        const { username, password } = req.body;

        const user = await userModel.findOne({
            username: username, 
        })
        const isValidPassword = await bcrypt.compare(password, user?.password || "");

        if(!user || !isValidPassword){
            return res.status(400).json({ error: "Invalid username or password" });
        }

        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
                _id: user._id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                followers: user.followers,
                following: user.following,
                profileImg: user.profileImg,
                coverImg: user.coverImg,
                bio: user.bio,
                link: user.link
        });
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const logoutController = async (req, res)=>{
    try{
        const user = await userModel.findById(req.user._id);
        if(!user){
            return res.status(404).json({ error: "No user logged in" });
        }
        res.cookie('jwt', '', {maxAge: 0});
        res.status(200).json({ error: "Logged Out successfully" });
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }     
}

export const profileController = async (req, res)=>{
    try{
        const user = await userModel.findById(req.user._id).select('-password');
        res.status(200).json(user);
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}