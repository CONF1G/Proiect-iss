import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from 'react-toastify';
import AgentNotifications from '../components/AgentNotifications';
import { io } from "socket.io-client";

const PlaceOrder = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 1,
  });
  const [editingOrder, setEditingOrder] = useState();
  const [error, setError] = useState("");
  const [stockWarning, setStockWarning] = useState("");

  const API_BASE_URL = "http://localhost:3300/api";
  const ORDERS_URL = `${API_BASE_URL}/orders`;
  const PRODUCTS_URL = `${API_BASE_URL}/products`;

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError("");

    // Check for stock warning
    if (name === "productId" && value) {
      const selected = products.find(p => p.id === parseInt(value));
      if (selected?.stock <= 5) {
        setStockWarning(`⚠️ Stock is low: ${selected.stock} left`);
      } else {
        setStockWarning("");
      }
    }

    if (name === "quantity" && formData.productId) {
      const selected = products.find(p => p.id === parseInt(formData.productId));
     
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selected = products.find(p => p.id === parseInt(formData.productId));

    if (!selected || parseInt(formData.quantity) > selected.stock) {
      setError(`Not enough stock available (${selected?.stock ?? 0})`);
      return;
    }

    try {
      
      const orderData = {
        productId: parseInt(formData.productId),
        quantity: parseInt(formData.quantity),
      };

      if (editingOrder) {
        await axios.put(`${ORDERS_URL}/${editingOrder.id}`, orderData);
        setEditingOrder(null);
      } else {
        await axios.post(ORDERS_URL, orderData);
      }

      setFormData({ productId: "", quantity: 1 });
      setStockWarning("");
      fetchData();
    } catch (err) {
      console.error("Error saving order:", err);
      setError(err.response?.data?.message || "Failed to save order.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${ORDERS_URL}/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting order:", err);
      setError("Failed to delete order.");
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      productId: order.product_id.toString(),
      quantity: order.quantity,
    });

    const selected = products.find(p => p.id === order.product_id);
    if (selected?.stock <= 5) {
      setStockWarning(`⚠️ Stock is low: ${selected.stock} left`);
    } else {
      setStockWarning("");
    }
  };
  const socket = io("http://localhost:3300", { // Use Express server's port (3300)
    path: "/socket.io",
    transports: ["websocket", "polling"], // Fallback to polling if WS fails
  });
  const formatPrice = (price) => `$${parseFloat(price).toFixed(2)}`;

  return (
    <div className="place-order-container">
      <h2>Order Management</h2>
      <AgentNotifications />
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <h3>{editingOrder ? "Edit Order" : "Place New Order"}</h3>
        {error && <div className="error-message">{error}</div>}
        {stockWarning && <div className="stock-warning">{stockWarning}</div>}

        <select
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select a Product --</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - {formatPrice(product.price)} ({product.stock} in stock)
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
          max={
            formData.productId
              ? products.find(p => p.id === parseInt(formData.productId))?.stock || 1
              : 1
          }
          required
        />

        <button type="submit">
          {editingOrder ? "Update Order" : "Place Order"}
        </button>
        {editingOrder && (
          <button
            type="button"
            onClick={() => {
              setEditingOrder(null);
              setFormData({ productId: "", quantity: 1 });
              setStockWarning("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

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
                <td>
                  {products.find(p => p.id === order.product_id)?.name || 'Product not found'}
                </td>
                <td>{order.quantity}</td>
                <td>
                  {formatPrice(
                    products.find(p => p.id === order.product_id)?.price || 0
                  )}
                </td>
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
