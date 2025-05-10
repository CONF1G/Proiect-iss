import express from "express";
import { createOrder, getOrders, getOrderById, deleteOrder } from "../controllers/ordersController.js";

const router = express.Router();

router.post("/", createOrder); // Place an order
router.get("/", getOrders); // Get all orders
router.get("/:id", getOrderById); // Get a single order by ID
router.delete("/:id", deleteOrder); // Delete an order by ID
console.log("GET /api/orders - Get all orders route hit");

export default router;
