import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import ProfileDropdown from './ProfileDropdown.jsx';
import '../../../styles/Header.css';

function Header({ openAuthModal }) {
  const { isAuthenticated, user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        <Link to="/" className="app-logo">
          Sintetica God
        </Link>
      </div>

      <nav className="app-nav">
        {!isAuthenticated ? (
          <>
            <div onClick={openAuthModal} className="nav-link nav-button-home">
              Iniciar Sesión
            </div>
            <Link to="/register" className="nav-link">
              Registrarse
            </Link>
          </>
        ) : (
          <div className="authenticated-nav" ref={dropdownRef}>
           
            {user?.is_staff ? (
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            ) : (
              <Link to="/client" className="nav-link">Mi Dashboard</Link>
            )}
            <button onClick={toggleDropdown} className="profile-icon-button">
              <i className="fas fa-user-circle"></i>
            </button>
            {dropdownOpen && <ProfileDropdown />}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
