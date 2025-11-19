// src/components/Header.jsx
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ user }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserInitials = (email) => {
    if (user.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return email ? email[0].toUpperCase() : 'U';
  };

  const getUserDisplayName = () => {
    return user.displayName || user.email.split('@')[0];
  };

  return (
    <header className="header">
      <div className="container">
        <div className="navbar">
          {/* Left Section - Logo and Home */}
          <div className="nav-left">
            <Link to="/" className="logo">
              <div className="logo-icon">📊</div>
              <span>VizAssistant</span>
            </Link>
            
            {/* Home Button for larger screens */}
            <Link to="/" className="home-btn desktop-only">
              <span className="home-icon">🏠</span>
              Home
            </Link>
          </div>
          
          {/* Center Section - Navigation Links */}
          <nav className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/upload">Upload Data</Link>
            <Link to="/analysis">Analysis</Link>
            <Link to="/insights">AI Insights</Link>
          </nav>
          
          {/* Right Section - User Menu */}
          <div className="nav-right">
            {/* Mobile Home Button */}
            <Link to="/" className="home-btn mobile-only">
              <span className="home-icon">🏠</span>
            </Link>
            
            <div className="user-menu">
              <div 
                className="user-avatar"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={getUserDisplayName()}
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-fallback">
                    {getUserInitials(user.email)}
                  </div>
                )}
              </div>
              
              {showDropdown && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="user-info">
                      <div className="user-name">{getUserDisplayName()}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="dropdown-icon">👤</span>
                    Profile
                  </Link>
                  <Link 
                    to="/" 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="dropdown-icon">🏠</span>
                    Home
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="logout-btn dropdown-item"
                  >
                    <span className="dropdown-icon">🚪</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {showDropdown && (
        <div 
          className="dropdown-overlay"
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;