import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, startOfWeek, addDays, setHours, setMinutes } from 'date-fns';
import { useRepositories } from '../context/RepositoryContext';
import { useUseCases } from '../context/UseCaseContext';

/**
 * Hook personalizado para la lógica de la página de detalles de la cancha.
 * Encapsula la obtención de detalles de la cancha, la disponibilidad semanal,
 * y la gestión del proceso de reserva.
 *
 * @returns {object} Un objeto que contiene el estado y las funciones para la página de detalles de la cancha.
 * @property {object|null} court - Detalles de la cancha.
 * @property {boolean} loading - Estado de carga inicial de la cancha.
 * @property {string|null} error - Error al cargar la cancha.
 * @property {string|null} selectedImage - URL de la imagen seleccionada para el modal.
 * @property {boolean} isBooking - Indica si una reserva está en proceso.
 * @property {string|null} bookingError - Error específico de la reserva.
 * @property {boolean} bookingSuccess - Indica si la reserva fue exitosa.
 * @property {boolean} showLoginModal - Controla la visibilidad del modal de login.
 * @property {boolean} showConfirmModal - Controla la visibilidad del modal de confirmación de reserva.
 * @property {object|null} bookingDetailsToConfirm - Detalles de la reserva a confirmar.
 * @property {object} weeklyAvailability - Datos de disponibilidad semanal.
 * @property {boolean} loadingWeeklyAvailability - Estado de carga de la disponibilidad semanal.
 * @property {string|null} weeklyAvailabilityError - Error al cargar la disponibilidad semanal.
 * @property {Date} currentWeekStartDate - Fecha de inicio de la semana actual del calendario.
 * @property {Array} daysOfWeek - Nombres de los días de la semana.
 * @property {Array} hoursOfDay - Rangos de horas del día.
 * @property {Function} fetchCourtDetails - Función para recargar los detalles de la cancha.
 * @property {Function} handleCellClick - Manejador de clic en una celda de disponibilidad.
 * @property {Function} confirmBooking - Función para confirmar la reserva.
 * @property {Function} cancelConfirmation - Función para cancelar la confirmación de reserva.
 * @property {Function} handleCloseLoginModal - Manejador para cerrar el modal de login.
 * @property {Function} handlePreviousWeek - Navega a la semana anterior en el calendario.
 * @property {Function} handleNextWeek - Navega a la semana siguiente en el calendario.
 * @property {Function} openModal - Abre el modal de imagen.
 * @property {Function} closeModal - Cierra el modal de imagen.
 */
export const useCourtDetailLogic = () => {
  const { courtId } = useParams();
  const navigate = useNavigate();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const { courtRepository, bookingRepository } = useRepositories();
  const { getCourtByIdUseCase, checkAvailabilityUseCase, getWeeklyAvailabilityUseCase, createBookingUseCase } = useUseCases();

  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingDetailsToConfirm, setBookingDetailsToConfirm] = useState(null);

  const [weeklyAvailability, setWeeklyAvailability] = useState({});
  const [loadingWeeklyAvailability, setLoadingWeeklyAvailability] = useState(false);
  const [weeklyAvailabilityError, setWeeklyAvailabilityError] = useState(null);
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const fetchCourtDetails = useCallback(async () => {
    if (!courtId) return;

    try {
      setLoading(true);
      setError(null);
      const courtDetails = await getCourtByIdUseCase.execute(courtId);
      setCourt(courtDetails);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error(`Error al obtener detalles de la cancha ${courtId}:`, err);
    }
  }, [courtId, getCourtByIdUseCase]);

  const fetchWeeklyAvailability = useCallback(async () => {
    setLoadingWeeklyAvailability(true);
    setWeeklyAvailabilityError(null);

    const sunday = addDays(currentWeekStartDate, 6);
    const endOfSunday = setMinutes(setHours(sunday, 23), 59);

    const formattedStartTime = currentWeekStartDate.toISOString();
    const formattedEndTime = endOfSunday.toISOString();

    try {
      const weeklyAvailabilityResults = await getWeeklyAvailabilityUseCase.execute(courtId, formattedStartTime, formattedEndTime);
      setWeeklyAvailability({ ...weeklyAvailabilityResults });
      setLoadingWeeklyAvailability(false);
    } catch (err) {
      setWeeklyAvailabilityError("Error al cargar la disponibilidad semanal.");
      setLoadingWeeklyAvailability(false);
      console.error('Error fetching weekly availability:', err);
    }
  }, [courtId, currentWeekStartDate, getWeeklyAvailabilityUseCase]);

  useEffect(() => {
    fetchCourtDetails();
  }, [fetchCourtDetails]);

  useEffect(() => {
    if (court) {
      fetchWeeklyAvailability();
    }
  }, [court, fetchWeeklyAvailability]);

  const handleCellClick = async (date, hour) => {
    setIsBooking(true);
    setBookingError(null);
    setBookingSuccess(false);

    try {
      const [year, month, day] = date.split('-').map(Number);
      const baseDate = new Date(year, month - 1, day);

      const startDateTime = setMinutes(setHours(baseDate, hour), 0);
      const endDateTime = setMinutes(setHours(baseDate, hour + 1), 0);

      const formattedStartTime = startDateTime.toISOString();
      const formattedEndTime = endDateTime.toISOString();

      setBookingDetailsToConfirm({
        courtId,
        startDateTime,
        endDateTime,
        formattedStartTime,
        formattedEndTime,
        courtName: court?.name,
        price: court?.price,
      });
      setShowConfirmModal(true);

    } catch (err) {
      setBookingError("Error al preparar la reserva. Inténtalo de nuevo.");
      console.error('Error preparing booking:', err.response ? err.response.data : err.message);
    } finally {
      setIsBooking(false);
    }
  };

  const confirmBooking = async () => {
    if (!bookingDetailsToConfirm) return;

    setIsBooking(true);
    setBookingError(null);
    setBookingSuccess(false);
    setShowConfirmModal(false);

    try {
      await createBookingUseCase.execute(
        bookingDetailsToConfirm.courtId,
        bookingDetailsToConfirm.formattedStartTime,
        bookingDetailsToConfirm.formattedEndTime
      );
      setBookingSuccess(true);
      fetchWeeklyAvailability();
    } catch (err) {
      console.log("DEBUG: Error en confirmBooking:", err);
      console.log("DEBUG: err.response:", err.response);
      console.log("DEBUG: err.response.status:", err.response ? err.response.status : 'N/A');
      console.log("DEBUG: err.message:", err.message);

      if ((err.response && err.response.status === 401) || (err.message === "No se pudo crear la reserva.")) {
        setBookingError(null);
        setShowLoginModal(true);
      } else {
        setBookingError("Error al crear la reserva. Inténtalo de nuevo.");
      }
      console.error('Error creating booking:', err.response ? err.response.data : err.message);
    } finally {
      setIsBooking(false);
      setBookingDetailsToConfirm(null);
    }
  };

  const cancelConfirmation = () => {
    setShowConfirmModal(false);
    setBookingDetailsToConfirm(null);
    setIsBooking(false);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    navigate('/login');
  };

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const hoursOfDay = Array.from({ length: 18 }, (_, i) => {
    const startHour24 = i + 6;
    const endHour24 = startHour24 + 1;
    const tempStartDate = setMinutes(setHours(new Date(), startHour24), 0);
    const tempEndDate = setMinutes(setHours(new Date(), endHour24), 0);
    return `${format(tempStartDate, 'h:mm a')} - ${format(tempEndDate, 'h:mm a')}`;
  });

  const handlePreviousWeek = () => {
    setCurrentWeekStartDate(addDays(currentWeekStartDate, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStartDate(addDays(currentWeekStartDate, 7));
  };

  const openModal = (image) => {
    setSelectedImage(image.image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return {
    court,
    loading,
    error,
    selectedImage,
    isBooking,
    bookingError,
    bookingSuccess,
    showLoginModal,
    showConfirmModal,
    bookingDetailsToConfirm,
    weeklyAvailability,
    loadingWeeklyAvailability,
    weeklyAvailabilityError,
    currentWeekStartDate,
    daysOfWeek,
    hoursOfDay,
    fetchCourtDetails,
    handleCellClick,
    confirmBooking,
    cancelConfirmation,
    handleCloseLoginModal,
    handlePreviousWeek,
    handleNextWeek,
    openModal,
    closeModal,
  };
};
