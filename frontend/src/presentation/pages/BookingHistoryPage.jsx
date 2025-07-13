import React from 'react';
import { useFetchClientBookings } from '../hooks/useFetchClientBookings';
import Spinner from '../components/common/Spinner';
import '../../styles/ClientDashboard.css';

const BookingHistoryPage = () => {
  const { bookings, loading, error } = useFetchClientBookings();

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Error al cargar el historial de reservas: {error.message}</p>;
  }

  const pastBookings = bookings.filter(booking => new Date(booking.start_time) < new Date());

  return (
    <div className="client-dashboard-page">
      <h2>Historial de Reservas</h2>
      {pastBookings.length > 0 ? (
        <ul className="bookings-list">
          {pastBookings.map(booking => (
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
        <p className="no-bookings-message">No tienes reservas pasadas.</p>
      )}
    </div>
  );
};

export default BookingHistoryPage;
