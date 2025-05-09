import express from "express";
import { placeOrder, getOrders } from "../controllers/ordersController.js";

const router = express.Router();

// Define order routes
router.post("/orders", placeOrder); // Place an order
router.get("/orders", getOrders); // Get all orders

export default router;