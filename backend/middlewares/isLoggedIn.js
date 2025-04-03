import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';

export const isLoggedIn = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({ message: "Unauthorized user" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({ message: "Unauthorized user: Invalid Token" });
        }
        
        const user = await userModel.findById(decoded.userId).select('-password');
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        
        req.user = user;
        next();
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
}