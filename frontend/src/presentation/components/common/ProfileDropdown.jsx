import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import '../../../styles/ProfileDropdown.css';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="profile-dropdown">
      <div className="dropdown-header">
        <span className="username">{user.username}</span>
        <span className="email">{user.email}</span>
      </div>
      <ul className="dropdown-menu">
        <li>
          <Link to={user.is_staff ? "/dashboard/perfil" : "/client/profile"} className="profile-link">
            <i className="myprofile fas fa-user"></i> Mi Perfil
          </Link>
        </li>
        <li>
          <button onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
