import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    fullname: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true,
        minLength: 6,
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            default: []
        }
    ],

    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            default: []
        }
    ],

    profileImg: {
        type: String,
        default: ""
    },

    coverImg: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        default: ""
    },

    link: {
        type: String,
        default: ""
    }
    
}, { timestamps: true });

const userModel = mongoose.model('user', userSchema);

export default userModel;