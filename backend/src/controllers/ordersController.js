import db from "../config/db.js";

// Helper function to validate order data
const validateOrderData = (productId, quantity) => {
  if (!productId || isNaN(quantity) || quantity < 1) {
    return { valid: false, message: "Product ID and quantity (minimum 1) are required" };
  }
  return { valid: true };
};

// Calculate total price for an order
const calculateOrderTotal = async (productId, quantity) => {
  const [product] = await db.query(
    'SELECT price FROM products WHERE id = ?',
    [productId]
  );
  return product[0].price * quantity;
};

// Get all orders with enhanced product details
export const getOrders = async (req, res) => {
  try {
    const query = 'SELECT * FROM orders';
    const [results] = await db.query(query); // Use async/await with mysql2/promise
    res.status(200).json({ success: true, orders: results });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};
  
// Create a new order with transaction support
export const createOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { productId, quantity } = req.body;

    const validation = validateOrderData(productId, quantity);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // Verify product exists
    const [product] = await connection.query(
      'SELECT price FROM products WHERE id = ?',
      [productId]
    );

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Calculate total price
    const totalPrice = product[0].price * quantity;

    // Insert the order
    const [result] = await connection.query(
      'INSERT INTO orders (product_id, quantity, total_price) VALUES (?, ?, ?)',
      [productId, quantity, totalPrice]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        orderId: result.insertId,
        productId,
        quantity,
        totalPrice
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error("Order creation failed:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code,
        sql: error.sql
      } : undefined
    });
  } finally {
    connection.release();
  }
};


// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [order] = await db.query(`
      SELECT 
        o.id,
        o.product_id,
        p.name AS product_name,
        p.price AS unit_price,
        o.quantity,
        (p.price * o.quantity) AS total_price,
        p.description AS product_description
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.id = ?
    `, [id]);

    if (order.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      data: order[0]
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve order"
    });
  }
};

// Update an existing order
export const updateOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    const { productId, quantity } = req.body;
    
    const validation = validateOrderData(productId, quantity);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // Verify order exists
    const [existingOrder] = await connection.query(
      'SELECT id FROM orders WHERE id = ? FOR UPDATE',
      [id]
    );

    if (existingOrder.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Verify new product exists
    const [product] = await connection.query(
      'SELECT id FROM products WHERE id = ?',
      [productId]
    );

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Update the order
    await connection.query(
      'UPDATE orders SET product_id = ?, quantity = ? WHERE id = ?',
      [productId, quantity, id]
    );

    await connection.commit();

    // Get updated order details
    const [updatedOrder] = await db.query(`
      SELECT 
        o.id,
        o.product_id,
        p.name AS product_name,
        p.price AS unit_price,
        o.quantity,
        (p.price * o.quantity) AS total_price
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.id = ?
    `, [id]);

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder[0]
    });

  } catch (error) {
    await connection.rollback();
    console.error("Order update failed:", error);
    
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code,
        sql: error.sql
      } : undefined
    });
  } finally {
    connection.release();
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;

    // Verify order exists
    const [order] = await connection.query(
      'SELECT id FROM orders WHERE id = ? FOR UPDATE',
      [id]
    );

    if (order.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    await connection.query(
      'DELETE FROM orders WHERE id = ?',
      [id]
    );

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully"
    });

  } catch (error) {
    await connection.rollback();
    console.error("Order deletion failed:", error);
    
    res.status(500).json({
      success: false,
      message: "Failed to delete order"
    });
  } finally {
    connection.release();
  }
};