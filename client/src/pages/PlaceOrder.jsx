import React, { useState, useEffect } from "react";
import axios from "axios";

const PlaceOrder = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderMessage, setOrderMessage] = useState("");
  const API_BASE_URL = "http://localhost:3300/api/orders";

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle placing an order
  const handlePlaceOrder = async () => {
    if (!selectedProduct || quantity < 1) {
      setOrderMessage("Please select a product and enter a valid quantity.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, {
        productId: selectedProduct.id,
        quantity,
      });
      setOrderMessage(response.data.message || "Order placed successfully!");
      setSelectedProduct(null);
      setQuantity(1);
    } catch (err) {
      console.error("Error placing order:", err);
      setOrderMessage("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="place-order-container">
      <h2>Place an Order</h2>
      {orderMessage && <div className="order-message">{orderMessage}</div>}

      <div className="product-selection">
        <h3>Select a Product</h3>
        <select
          value={selectedProduct?.id || ""}
          onChange={(e) =>
            setSelectedProduct(
              products.find((product) => product.id === parseInt(e.target.value))
            )
          }
        >
          <option value="">-- Select a Product --</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - ${product.price}
            </option>
          ))}
        </select>
      </div>

      <div className="quantity-selection">
        <h3>Enter Quantity</h3>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
      </div>

      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default PlaceOrder;