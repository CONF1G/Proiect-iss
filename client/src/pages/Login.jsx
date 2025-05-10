import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // // Validation function for email and password
  // const validateForm = () => {
  //   const errors = {};
  //   if (!email) {
  //     errors.email = "Email is required";
  //   } else if (!/\S+@\S+\.\S+/.test(email)) {
  //     errors.email = "Please enter a valid email address";
  //   }
  //   if (!password) {
  //     errors.password = "Password is required";
  //   }
  //   return errors;
  // };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:3300/api/auth/login", {
        email,
        password,
      });
  
      // Assuming the response contains user role and token
      const { role, token } = response.data;
  
      // Save role and token to localStorage
      localStorage.setItem("userRole", role);
      localStorage.setItem("authToken", token);
      localStorage.setItem("keepLoggedIn",JSON.stringify(true));
  
      // Redirect to the main page
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ general: "Invalid email or password" });
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {errors.general && <div className="error-message">{errors.general}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;