import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { useAuth } from '../../context/AuthContext.jsx';
import '../../../styles/DashboardNavbar.css';

function DashboardNavbar({ toggleSidebar }) {
  const { user } = useAuth();
  const navigate = useNavigate(); // Obtener la función de navegación

  const handleNavbarRightClick = () => {
    if (user.role === 'cliente') {
      navigate('/client/profile');
    } else {
      navigate('/dashboard/perfil');
    }
  };

  return (
    <header className="dashboard-navbar">
      <div className="navbar-left">
        {/* Botón de hamburguesa para móviles */}
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i> {/* Icono de hamburguesa */}
        </div>

        {/* Título o logo del dashboard */}
        <div className="navbar-brand">
          <h2>Administración</h2>
        </div>
      </div>

      {/* Información del usuario o elementos de la derecha */}
      <div className="navbar-right" onClick={handleNavbarRightClick} style={{ cursor: 'pointer' }}> {/* Añadir onClick y estilo de cursor */}
        <div className="user-profile">
          <div className="user-avatar">{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</div>
          <div className="user-info">
            <div className="user-name">{user.username}</div>
            <div className="user-role">{user.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardNavbar;
