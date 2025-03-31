import express from 'express'
import { followUnfollowUser, getSuggesstedUser, getUserProfile, updateUserProfile } from '../controllers/user.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/profile/:username', isLoggedIn, getUserProfile);
router.get('/suggested', isLoggedIn, getSuggesstedUser);
router.post('/follow/:id', isLoggedIn, followUnfollowUser);
router.post('/update', isLoggedIn, updateUserProfile);

export default router;