// src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d' // Token expiration time
    });
};

// User registration
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user exists
        const existingUsers = await new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM test.users WHERE email = ? OR username = ?',
                [email, username],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO test.users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });

    } catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
};

// User login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Login attempt:", { email, password });

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Find user
        const users = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM test.users WHERE email = ?", [email], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const user = users[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Generate token
        const token = generateToken(user.id);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error during login",
        });
    }
};


// Get user details
export const getUserDetails = async (req, res) => {
    try {
        // Extract user ID from authenticated request

        const q = "SELECT * FROM test.users"
        db.query(q, (err, data) => {
            if (err) return res.json(err)
            return res.json(data)
        });

        if (q.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

    } catch (err) {
        console.error('Get user error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error fetching user details'
        });
    }
};