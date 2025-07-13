import React from 'react';
import { useFetchClientBookings } from '../hooks/useFetchClientBookings';
import Spinner from '../components/common/Spinner';
import '../../styles/ClientDashboard.css';

const MyBookingsPage = () => {
  const { bookings, loading, error } = useFetchClientBookings();

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Error al cargar las reservas: {error.message}</p>;
  }

  const upcomingBookings = bookings.filter(booking => new Date(booking.start_time) >= new Date());

  return (
    <div className="client-dashboard-page">
      <h2>Mis Reservas</h2>
      {upcomingBookings.length > 0 ? (
        <ul className="bookings-list">
          {upcomingBookings.map(booking => (
            <li key={booking.id} className="booking-item">
              <div className="booking-item-details">
                <span className="court-name">{booking.court_details.name}</span>
                <span> - Fecha: {new Date(booking.start_time).toLocaleDateString()}</span>
                <span> - Hora: {new Date(booking.start_time).toLocaleTimeString()}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-bookings-message">No tienes próximas reservas.</p>
      )}
    </div>
  );
};

export default MyBookingsPage;
