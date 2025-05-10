import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import default CSS for toastify
// import UserHomeScreen from "./pages/MainPage";
import UserHomeScreen from "./pages/UserHomeScreen";
import PlaceOrder from "./pages/PlaceOrder";
import AdminPage from "./pages/AdminPage";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  const isLoggedIn = JSON.parse(localStorage.getItem("keepLoggedIn"));
  return (
    <Router>
      <Header/>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={isLoggedIn?<Navigate to = {"UserHomeScreen"}/>:<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/homeScreen" element={<UserHomeScreen />} />
          <Route path="/placeOrder" element={<PlaceOrder />} />
          <Route path="/adminHomeScreen" element={<AdminPage />} />
          {/* Add more routes as needed */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ToastContainer 
        position="top-center" 
        autoClose={1000} 
        hideProgressBar={true} 
        closeOnClick 
        // pauseOnHover  
        theme="colored" 
      />
    </Router>
  );
};

export default App;