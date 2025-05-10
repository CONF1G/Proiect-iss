import express from 'express';
import { register, login, getUserDetails } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router(); // ✅ This should come BEFORE router.get/post

router.post('/register', register);
router.post('/login', login);
router.get('/profile', getUserDetails);
router.get('/get-userDetails', getUserDetails);
//,protect
export default router;
