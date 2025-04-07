import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import "./LayoutDefault.css";
import Cookies from "js-cookie";
import { getCookie } from "../../helpers/cookie";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { searchProducts } from "../../utils/request";

function LayoutDefault() {
  
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const token = getCookie("token");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
    navigate(`/home/category/${categoryId}`);
  };

const handleSearch = (e) => {
  e.preventDefault();
  console.log('Search query:', searchQuery); // Log search query
  if (searchQuery.trim()) {
    console.log('Navigating to search with keyword:', searchQuery);
    navigate(`/home/search?keyword=${searchQuery}`);
  }
};

// In Search.js
const loadSearchResults = async (keyword) => {
  try {
    console.log('Attempting to search with keyword:', keyword);
    console.log('Current token:', Cookies.get('token')); // Check token
    
    const data = await searchProducts(keyword);
    console.log('Raw search results:', data);
  } catch (err) {
    console.error('Complete error details:', err);
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
  }
};

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="layout-container">
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h2>
              <Link to="/home" className="logo-link">
                Shop Tech
              </Link>
            </h2>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </div>

          {/* Search Bar */}
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <FaSearch />
            </button>
          </form>

          {/* Navigation Menu */}
          <nav className={`nav-menu ${mobileMenuOpen ? "active" : ""}`}>
            <ul>
              <li>
                <Link to="/home">Products</Link>
                <div className="dropdown-menu">
                  <Link to="/home/category/1" onClick={() => handleCategoryClick(1)}>Điện thoại</Link>
                  <Link to="/home/category/2" onClick={() => handleCategoryClick(2)}>Laptop</Link>
                  <Link to="/home/category/3" onClick={() => handleCategoryClick(3)}>Smartwatch</Link>
                  <Link to="/home/category/4" onClick={() => handleCategoryClick(4)}>Tablet</Link>
                  <Link to="/home/category/5" onClick={() => handleCategoryClick(5)}>Máy ảnh</Link>
                  <Link to="/home/category/6" onClick={() => handleCategoryClick(6)}>Loa</Link>
                  <Link to="/home/category/7" onClick={() => handleCategoryClick(7)}>Điện tử</Link>
                  <Link to="/home/category/8" onClick={() => handleCategoryClick(8)}>Phụ kiện</Link>
                </div>
              </li>
              <li>
                <Link to="/cart" className="cart-link">
                  <FaShoppingCart /> Cart
                </Link>
              </li>
              {!token ? (
                <li className="user-menu">
                  <Link to="/login" className="user-link">
                    <FaUser /> Account
                  </Link>
                  <div className="dropdown-menu">
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                  </div>
                </li>
              ) : (
                <li className="user-menu">
                  <Link to="/account" className="user-link">
                    <FaUser /> My Account
                  </Link>
                  <div className="dropdown-menu">
                    <Link to="/profile">Profile</Link>
                    <Link to="/logout">Logout</Link>
                  </div>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Outlet context={{ selectedCategoryId }} />
      </main>

      {/* Footer Section */}
      <footer className="footer">
        {/* Footer content không thay đổi */}
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>We provide the best products at affordable prices.</p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/shipping">Shipping Policy</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: info@myshop.com</p>
            <p>Phone: +1 234 567 8900</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} My Shop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LayoutDefault;