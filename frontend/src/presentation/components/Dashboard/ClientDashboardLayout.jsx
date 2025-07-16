import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Header from '../common/Header.jsx';
import '../../../styles/ClientDashboardLayout.css';

const ClientDashboardLayout = () => {
  return (
    <>
      <Header />
      <div className="dashboard-layout">
        <aside className="sidebar">
        <nav>
          <ul>
            <li>
              <NavLink to="/" end>
                <i className="fas fa-home"></i>
                <span>Inicio</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="bookings">
                <i className="fas fa-calendar-alt"></i>
                <span>Mis Reservas</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="history">
                <i className="fas fa-history"></i>
                <span>Historial</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="profile">
                <i className="fas fa-user"></i>
                <span>Mi Perfil</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        </aside>
        <main className="dashboard-content-client">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default ClientDashboardLayout;
