import express from 'express'
import { loginController, logoutController, profileController, signupController } from '../controllers/auth.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/logout', isLoggedIn, logoutController);
router.get('/profile', isLoggedIn, profileController);

export default router;