import { useState, useEffect } from 'react';
import { useUseCases } from '../context/UseCaseContext';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Hook personalizado para obtener la lista de reservas de un cliente específico.
 * @returns {object} Un objeto con la lista de reservas, estado de carga y error.
 */
export const useFetchClientBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getBookingsUseCase } = useUseCases();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Asumimos que el caso de uso puede tomar un userId para filtrar
        const bookingsList = await getBookingsUseCase.execute({ userId: user.id });
        setBookings(bookingsList);
      } catch (err) {
        setError(err);
        console.error('Error al obtener reservas del cliente:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [getBookingsUseCase, user]);

  return { bookings, loading, error };
};
