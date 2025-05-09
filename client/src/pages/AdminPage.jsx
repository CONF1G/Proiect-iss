import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminStore = () => {
  console.log("AdminStore component loaded");

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:3300/api/products";

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setProducts(response.data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // Handle form submission for adding or updating a product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.description) {
      setError("All fields are required.");
      return;
    }

    try {
      if (editingProduct) {
        // Update product
        await axios.put(`${API_BASE_URL}/${editingProduct.id}`, formData);
        setEditingProduct(null);
      } else {
        // Add new product
        await axios.post(API_BASE_URL, formData);
      }
      setFormData({ name: "", price: "", description: "" });
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Failed to save product. Please try again.");
    }
  };

  // Handle delete product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Handle edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
    });
  };

  return (
    <div className="admin-store-container">
      <h2>Admin Store Management</h2>

      {/* Form for adding/updating products */}
      <form onSubmit={handleSubmit}>
        <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>
        {error && <div className="error-message">{error}</div>}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Product Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingProduct ? "Update" : "Add"}</button>
      </form>

      {/* Product list */}
      <h3>Product List</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.description}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStore;