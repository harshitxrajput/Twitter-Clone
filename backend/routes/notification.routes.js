import express from 'express';

import { deleteAllNotificationController, getAllNotificationController } from '../controllers/notification.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/all', isLoggedIn, getAllNotificationController);
router.delete('/delete', isLoggedIn, deleteAllNotificationController);

export default router;