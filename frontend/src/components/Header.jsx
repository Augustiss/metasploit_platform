// file: src/components/header.jsx

import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import '../styles/Header.css';

function Header() {

  const isAuthenticated = !!localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <header className="header">
  <div className="container">
    <div className="left">
      <h1 className="logo">Metasploiter</h1>
    </div>
    <div className="right">
      <nav className="nav">
        <Link to="/home" className="nav-link">Home</Link>
        {isAuthenticated ? (
          <>
            <Link to="/theory" className="nav-link">Theory</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
          </>
        ) : (
          <>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
          </>
        )
        }
      </nav>
    </div>
  </div>
</header>

  );
}

export default Header;
