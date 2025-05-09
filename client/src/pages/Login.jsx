import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validation function for email and password
  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Make API request to login
      const response = await axios.post("http://localhost:3300/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        console.log("Login successful!");
        sessionStorage.setItem("authToken", response.data.token);
        navigate("/books");
        fetchUserDetails();
      } else {
        setErrors({ general: response.data.message || "Login failed" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrors({
        general: error.response?.data?.message || "Something went wrong. Please try again later.",
      });
    }
  };

  const fetchUserDetails = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        console.error("User is not logged in");
        return;
      }

      const response = await axios.get("http://localhost:3300/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        console.log("User details:", response.data.user);
      } else {
        console.error(response.data.message || "Failed to fetch user details");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        {errors.general && <span className="error-message">{errors.general}</span>}
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
      <p style={{ textAlign: "center" }}>
        Don't have an account?{" "}
        <Link
          to="/signUp"
          className="toggle-link"
          style={{ color: "#007BFF", textDecoration: "underline" }}
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;