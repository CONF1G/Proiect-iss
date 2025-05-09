import express from 'express';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../controllers/productsController.js';

const router = express.Router();

// Define product routes
router.get('/products', getAllProducts); // Get all products
router.post('/products', addProduct); // Add a new product
router.put('/products/:id', updateProduct); // Update a product by ID
router.delete('/products/:id', deleteProduct); // Delete a product by ID

export default router;