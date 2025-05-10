import express from "express";
import { createOrder, getOrders, getOrderById, deleteOrder, updateOrder } from "../controllers/ordersController.js";

const router = express.Router();

router.post("/", createOrder); // Place an order
router.get("/", getOrders); // Get all orders
router.get("/:id", getOrderById); // Get a single order by ID
router.delete("/:id", deleteOrder); // Delete an order by ID
router.post("/:id", updateOrder); // Update an order by ID

export default router;
