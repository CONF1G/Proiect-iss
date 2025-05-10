import React, { useState, useEffect } from "react";
import axios from "axios";

const PlaceOrder = () => {
  console.log("PlaceOrder component loaded");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 1,
  });
  const [editingOrder, setEditingOrder] = useState(null);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:3300/api";
  const ORDERS_URL = `${API_BASE_URL}/orders`;
  const PRODUCTS_URL = `${API_BASE_URL}/products`;

  // Fetch all products and orders
  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        axios.get(PRODUCTS_URL),
        axios.get(ORDERS_URL)
      ]);
      setProducts(productsRes.data.products || []);
      setOrders(ordersRes.data.orders || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // Handle form submission for adding or updating an order
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productId || formData.quantity < 1) {
      setError("Please select a product and enter a valid quantity.");
      return;
    }

    try {
      const orderData = {
        productId: parseInt(formData.productId),
        quantity: parseInt(formData.quantity),
      };

      if (editingOrder) {
        // Update order
        await axios.put(`${ORDERS_URL}/${editingOrder.id}`, orderData);
        setEditingOrder(null);
      } else {
        // Add new order
        await axios.post(ORDERS_URL, orderData);
      }
      
      setFormData({ productId: "", quantity: 1 });
      fetchData();
    } catch (err) {
      console.error("Error saving order:", err);
      setError(err.response?.data?.message || "Failed to save order. Please try again.");
    }
  };

  // Handle delete order
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${ORDERS_URL}/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting order:", err);
      setError("Failed to delete order. Please try again.");
    }
  };

  // Handle edit order
  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      productId: order.product_id.toString(),
      quantity: order.quantity,
    });
  };

  // Format price for display
  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className="place-order-container">
      <h2>Order Management</h2>

      {/* Form for placing/updating orders */}
      <form onSubmit={handleSubmit}>
        <h3>{editingOrder ? "Edit Order" : "Place New Order"}</h3>
        {error && <div className="error-message">{error}</div>}
        
        <select
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select a Product --</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - {formatPrice(product.price)}
            </option>
          ))}
        </select>
        
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="1"
          required
        />
        
        <button type="submit">
          {editingOrder ? "Update Order" : "Place Order"}
        </button>
        {editingOrder && (
          <button type="button" onClick={() => {
            setEditingOrder(null);
            setFormData({ productId: "", quantity: 1 });
          }}>
            Cancel
          </button>
        )}
      </form>

      {/* Orders list */}
      <h3>Order History</h3>
      {orders.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.product_name}</td>
                <td>{order.quantity}</td>
                <td>{formatPrice(order.price)}</td>
                <td>{formatPrice(order.total_price)}</td>
                <td>
                  <button onClick={() => handleEdit(order)}>Edit</button>
                  <button onClick={() => handleDelete(order.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default PlaceOrder;