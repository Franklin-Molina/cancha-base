import React from 'react';
import '../../styles/dashboard.css'; // Reutilizar estilos del dashboard
import Spinner from '../components/common/Spinner';
import { useFetchBookings } from '../hooks/useFetchBookings';

function DashboardBookingsPage() {
  const { bookings, loading, error } = useFetchBookings();

  if (loading) {
    return <Spinner />; 
  }

  if (error) {
    return <div className="dashboard-page-content" style={{ color: 'red' }}>Error al cargar reservas: {error.message}</div>;
  }

  return (
    <div className="dashboard-page-content"> {/* Usar clase de estilo del dashboard */}
      <h1 className="dashboard-page-title">Gestión de Reservas</h1>

      {bookings.length === 0 ? (
        <p>No hay reservas registradas.</p>
      ) : (
        <div className="widget"> {/* Usar clase de estilo del dashboard para la tabla */}
            <div className="widget-header">
                <div className="widget-title">Lista de Reservas</div>
            </div>
            <div className="widget-content" > 
                <table className="recent-orders"> 
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cancha</th>
                            <th>Usuario</th>
                            <th>Inicio</th>
                            <th>Fin</th>
                            <th>Estado</th>
                            <th>Pago</th>                         
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                           <tr key={booking.id}>
                              <td>{booking.id}</td>
                              <td>{booking.court}</td>
                              <td>{booking.user}</td>
                              <td>{new Date(booking.start_time).toLocaleString()}</td>
                              <td>{new Date(booking.end_time).toLocaleString()}</td>
                              <td>{booking.status}</td>
                              <td>{booking.payment}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
}

export default DashboardBookingsPage;
