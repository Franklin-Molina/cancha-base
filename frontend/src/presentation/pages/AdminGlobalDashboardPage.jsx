import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useAdminDashboard } from '../hooks/useAdminDashboard.js'; // Importar el nuevo hook

import '../../styles/AdminGlobalDashboard.css';
import Spinner from '../components/common/Spinner';

function AdminGlobalDashboardPage() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para controlar la visibilidad de la sidebar

  // Usar el hook personalizado para la lógica del dashboard
  const {
    adminUsers,
    loading,
    error,
    suspendSuccess,
    fetchAdminUsers,
    handleSuspendUser,
    handleReactivateUser,
    handleDeleteUser,
  } = useAdminDashboard();


  if (loading) {
    return <Spinner/>; 
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error al cargar administradores: {error.message}</div>;
  }

  // Verificar si el usuario actual es adminglobal antes de renderizar el contenido sensible
  if (!user || user.role !== 'adminglobal') {
    // Idealmente, ProtectedRoute ya debería haber manejado esto.
    // Esto es una doble verificación.
    return <div>Acceso denegado. Debes ser Administrador Global para ver esta página.</div>;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-global-dashboard-layout">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}> {/* Añadir clase 'open' si isSidebarOpen es true */}
        <div className="sidebar-header">
         
          <h2>Admin - Global</h2>
        </div>
        <div className="sidebar-menu">
          <div className="profile-container">
            <div className="profile-img">
                <i className="fas fa-user"></i>
            </div>
            <div className="profile-name">{user.username}</div>
            <div className="profile-role">{user.role}</div>
        </div>
          {/* Usar NavLink para active class si se implementan más rutas de dashboard */}
          <NavLink to="/adminglobal" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"} end onClick={toggleSidebar}> {/* Cerrar sidebar al hacer click */}
            {/* Este enlace podría ir a una página de resumen o directamente a manage-admins si es la vista principal */}
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </NavLink>
          
          <div className="menu-title">GESTIÓN</div>
          
          {/* El NavLink a /adminglobal ya cubre la tabla de admins si es la ruta index */}
          {/* Si se quiere un enlace explícito a la tabla de admins: */}
          <NavLink to="/adminglobal/manage-admins" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"} onClick={toggleSidebar}> {/* Cerrar sidebar al hacer click */}
            <i className="fas fa-users-cog"></i>
            <span>Gestionar Admins</span>
          </NavLink>

          <NavLink to="/adminglobal/register-admin" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"} onClick={toggleSidebar}> {/* Cerrar sidebar al hacer click */}
            <i className="fas fa-user-plus"></i>
            <span>Crear Admin</span>
          </NavLink>
          
          {/* Añadir más items de menú según sea necesario */}
          
          <div className="menu-title">EXTRAS</div>
          
          <NavLink to="/adminglobal/profile" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"} onClick={toggleSidebar}> {/* Actualizar ruta a /adminglobal/profile */} {/* Cerrar sidebar al hacer click */}
            <i className="fas fa-user"></i>
            <span>Mi Perfil</span>
          </NavLink>
          
          <div className="menu-item" onClick={() => { logout(); toggleSidebar(); }}> {/* Logout usando la función del contexto y cerrar sidebar */}
              <i className="fas fa-sign-out-alt"></i>
            <span> Cerrar Sesión</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          {/* Botón de hamburguesa para móviles */}
          <div className="sidebar-toggle" onClick={toggleSidebar}>
            <i className="minimiza fas fa-bars"></i> {/* Icono de hamburguesa */}
          </div>

        {/*   <div className="header-right">
            
            <div className="user-profile">
              <div className="user-avatar">{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</div>
              <div className="user-info">
                <div className="user-name">{user.username}</div>
                <div className="user-role">{user.role}</div>
              </div>
              
            </div>
          </div> */}
        </div>
        
        {/* Content */}
        <div className="content">
          {/* Mostrar alerta de suspensión si existe */}
          {suspendSuccess && (
            <div className="messages"> {/* Usar la clase messages para centrar */}
              <div className="alert success-alert">{suspendSuccess}</div>
            </div>
          )}
          {/* Outlet renderizará el componente de la ruta anidada */}
          <Outlet context={{ adminUsers, loading, error, fetchAdminUsers, handleSuspendUser, handleReactivateUser, handleDeleteUser }} />
        </div>
      </div>
    </div>
  );
}

export default AdminGlobalDashboardPage;
