import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("userRole"); // Retrieve the user's role from localStorage

  if (!userRole) {
    // If no role is found, redirect to the login page
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    // If the user's role is not allowed, redirect to the unauthorized page
    return <Navigate to="/unauthorized" />;
  }

  // If the user's role is allowed, render the children
  return children;
};

export default ProtectedRoute;