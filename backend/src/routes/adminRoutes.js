// routes/adminRoutes.js
import express from "express";
import { getAllUsers, deleteUser } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();


router.get("/users", protect, getAllUsers);
router.delete("/users/:id", protect, deleteUser);



export default router;
