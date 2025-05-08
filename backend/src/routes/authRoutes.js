import express from 'express';
import { getUserDetails, login, register } from '../controllers/authController.js';

const router = express.Router();

// Route for user registration
router.post('/register', register); // POST /auth/register

// Route for user login
router.post('/login', login); // POST /auth/login

// Route for fetching user details (protected route)
router.get('/user-details', getUserDetails); // GET /auth/user-details

export default router;