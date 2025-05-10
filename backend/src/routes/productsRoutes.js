import express from 'express';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../controllers/productsController.js';

const router = express.Router();

// Define product routes
router.get('/', getAllProducts); // Get all products
router.post('/', addProduct); // Add a new product
router.put('/:id', updateProduct); // Update a product by ID
router.delete('/:id', deleteProduct); // Delete a product by ID

export default router;