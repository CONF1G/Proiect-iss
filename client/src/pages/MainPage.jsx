import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MainPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:3300/api/products";

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setProducts(response.data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Check the user's role
  const userRole = localStorage.getItem("userRole");

  return (
    <div className="main-page-container">
      <h2>Welcome, {userRole === "admin" ? "Admin" : "Agent"}</h2>
      {error && <div className="error-message">{error}</div>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {userRole === "agent" && (
        <button className="place-order-btn" onClick={() => navigate("/place-order")}>
          Place Order
        </button>
      )}
      {userRole === "admin" && (
        <button className="admin-store-btn" onClick={() => navigate("/admin/store")}>
          Manage Store
        </button>
      )}
    </div>
  );
};

export default MainPage;