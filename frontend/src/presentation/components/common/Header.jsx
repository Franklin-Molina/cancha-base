import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import '../../../styles/Header.css';

function Header({ openAuthModal }) {
  const { isAuthenticated, user } = useAuth();

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
          <>
            <Link to="/courts" className="nav-link">Canchas</Link>
            <Link to="/profile" className="nav-link">Perfil</Link>
            {user?.is_staff && (
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            )}
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
