import db from '../config/db.js';

// Get all products
export const getAllProducts = (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching products:', err);
        return res.status(500).json({ success: false, message: 'Failed to fetch products' });
      }
      res.status(200).json({ success: true, products: results });
    });
  };

// Add a new product
export const addProduct = (req, res) => {
    const { name, price, description } = req.body;
    const query = 'INSERT INTO products (name, price, description) VALUES (?, ?, ?)';
    db.query(query, [name, price, description], (err, results) => {
        if (err) {
            console.error('Error adding product:', err);
            return res.status(500).json({ success: false, message: 'Failed to add product' });
        }
        res.status(201).json({ success: true, message: 'Product added successfully' });
    });
};

// Update a product by ID
export const updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const query = 'UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?';
    db.query(query, [name, price, description, id], (err, results) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ success: false, message: 'Failed to update product' });
        }
        res.status(200).json({ success: true, message: 'Product updated successfully' });
    });
};

// Delete a product by ID
export const deleteProduct = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ success: false, message: 'Failed to delete product' });
        }
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    });
};