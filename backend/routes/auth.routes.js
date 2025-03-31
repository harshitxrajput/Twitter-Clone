import express from 'express'
import { loginController, logoutController } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/signup', loginController);
router.get('/login', loginController);
router.get('/logout', logoutController);

export default router;