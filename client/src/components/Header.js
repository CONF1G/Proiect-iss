import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser, faHome, faShoppingCart, faCog } from '@fortawesome/free-solid-svg-icons';
import "../App.css";

const Header = () => {
  const location = useLocation(); // Get the current location
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState(null); // Store userType
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      getData();
    }, 200);
  }, [location]);

  const getData = async () => {
    const data = await JSON.parse(sessionStorage.getItem("userData"));
    console.log("useEffect run");
  
    if (data && data.isLoggedIn) {
      setUserData(data.userData);
      setUserType(userData);
    }
  };
  

  const logout = () => {
    sessionStorage.clear();
    setUserData("");

    setUserType(null); // Clear userType
    navigate("/");
    
  };
  console.log(userData);
 

  console.log(userData === "admin" ? "/abracadabra" : "/admin/dashboard");
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-text">ProductSellYOU</span>
      </div>

      <ul className="navbar-links">
        {/* Home link - shows different destinations based on login state */}
        <li>
          <Link
            to={userData ? (userData.userType === "admin" ? "/admin/dashboard" : "/user/home") : "/"}
            className={
              location.pathname === (userData ?
                (userData.userType === "admin" ? "/admin/dashboard" : "/user/home")
                : "/") ? "active" : ""
            }
          >
            <FontAwesomeIcon icon={faHome} className="nav-icon" />
            <span>Home</span>
          </Link>
        </li>

        {/* Show these only when logged in */}
        {userData && (
          <>
            {/* Regular user specific links */}
            {userData.userType !== "admin" && (
              <li>
                <Link to="/placeOrder" className={location.pathname === "/placeOrder" ? "active" : ""}>
                  <FontAwesomeIcon icon={faShoppingCart} className="nav-icon" />
                  <span>Place Order</span>
                </Link>
              </li>
            )}

            {/* Admin specific links */}
            {userData.userType === "admin" && (
              <>
                <li>
                  <Link to="/admin/store" className={location.pathname === "/admin/store" ? "active" : ""}>
                    <FontAwesomeIcon icon={faCog} className="nav-icon" />
                    <span>Manage Store</span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/users" className={location.pathname === "/admin/users" ? "active" : ""}>
                    <FontAwesomeIcon icon={faUser} className="nav-icon" />
                    <span>Manage Users</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/inventory"
                    className={location.pathname === "/admin/inventory" ? "active" : ""}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} className="nav-icon" />
                    <span>Inventory</span>
                  </Link>
                </li>
              </>
            )}
          </>
        )}


        {/* Show these only when NOT logged in */}
        {!userData && (
          <>
            <li>
              <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>
                <FontAwesomeIcon icon={faUser} className="nav-icon" />
                <span>Login</span>
              </Link>
            </li>
            <li>
              <Link to="/signup" className={location.pathname === "/signup" ? "active" : ""}>
                <FontAwesomeIcon icon={faUser} className="nav-icon" />
                <span>Sign Up</span>
              </Link>
            </li>
          </>
        )}

        {/* Profile section - shows when logged in */}
        {userData && (
          <>
            <li className="navbar-profile">
              <Link
                to={userData.userType === "admin" ? "/admin/profile" : "/user/profile"}
                className={
                  location.pathname === (userData.userType === "admin" ? "/admin/profile" : "/user/profile")
                    ? "active"
                    : ""
                }
              >
                <img
                  src={userData.profileImage || require("../image.png")}
                  alt="Profile"
                  className="profile-photo-circle"
                />
                <div className="profile-info">
                  <span className="username">{userData.name}</span>
                  {userData.userType === "admin" && (
                    <span className="user-role">Administrator</span>
                  )}
                </div>
              </Link>
            </li>
            <li>
              <button onClick={logout} className="logout-btn">
                <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
                <span>Logout</span>
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;