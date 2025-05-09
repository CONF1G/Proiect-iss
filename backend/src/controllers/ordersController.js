import db from "../config/db.js";

// Place an order
export const placeOrder = (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ success: false, message: "Invalid order details" });
  }

  const query = "INSERT INTO orders (product_id, quantity) VALUES (?, ?)";
  db.query(query, [productId, quantity], (err, results) => {
      if (err) {
          console.error("Error placing order:", err);
          return res.status(500).json({ success: false, message: "Failed to place order" });
      }
      res.status(201).json({ success: true, message: "Order placed successfully" });
  });
};

// Get all orders
export const getOrders = (req, res) => {
  const query = `
    SELECT o.id, p.name AS product_name, o.quantity, p.price, (o.quantity * p.price) AS total_price
    FROM orders o
    JOIN products p ON o.product_id = p.id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
    res.status(200).json({ success: true, orders: results });
  });
};