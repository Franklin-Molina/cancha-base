import { useState, useEffect, useRef } from 'react';
import { ApiCourtRepository } from '../../infrastructure/repositories/api-court-repository';
import { useNavigate } from 'react-router-dom';
import useButtonDisable from '../hooks/useButtonDisable.js';

/**
 * Hook personalizado para la lógica de la página de gestión de canchas.
 * Encapsula la obtención, suspensión, reactivación y eliminación de canchas.
 *
 * @returns {object} Un objeto que contiene el estado y las funciones para la gestión de canchas.
 * @property {Array} courts - Lista de canchas.
 * @property {boolean} loading - Indica si los datos están cargando.
 * @property {string|null} error - Mensaje de error si ocurre uno.
 * @property {string} actionStatus - Mensaje de estado de la última acción realizada.
 * @property {object|null} selectedCourt - Cancha seleccionada para ver acciones.
 * @property {object|null} courtToDelete - Cancha seleccionada para eliminar.
 * @property {boolean} isSuspending - Indica si una cancha se está suspendiendo.
 * @property {boolean} isReactivating - Indica si una cancha se está reactivando.
 * @property {boolean} isDeleting - Indica si una cancha se está eliminando.
 * @property {Function} handleSuspendCourtClick - Función para suspender una cancha.
 * @property {Function} handleReactivateCourtClick - Función para reactivar una cancha.
 * @property {Function} handleDeleteRequest - Función para solicitar la eliminación de una cancha.
 * @property {Function} handleConfirmDeleteClick - Función para confirmar la eliminación de una cancha.
 * @property {Function} handleCancelDelete - Función para cancelar la eliminación de una cancha.
 * @property {Function} handleModifyRequest - Función para navegar a la página de modificación de cancha.
 * @property {Function} handleOpenModal - Función para abrir el modal de acciones.
 * @property {Function} handleCloseModal - Función para cerrar el modal de acciones.
 */
export const useManageCourtsLogic = () => {
  const navigate = useNavigate();
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState('');
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [courtToDelete, setCourtToDelete] = useState(null);
  const hasFetchedCourts = useRef(false);

  const courtRepository = new ApiCourtRepository();

  const fetchCourts = async () => {
    try {
      setLoading(true);
      const courtsData = await courtRepository.getCourts();
      setCourts(courtsData);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetchedCourts.current) {
      fetchCourts();
      hasFetchedCourts.current = true;
    }
  }, [courtRepository]);

  const [isSuspending, handleSuspendCourtClick] = useButtonDisable(async (courtId) => {
    try {
      setActionStatus('Suspendiendo cancha...');
      await courtRepository.updateCourtStatus(courtId, false);
      setCourts(prevCourts =>
        prevCourts.map(c => c.id === courtId ? { ...c, is_active: false } : c)
      );
      setActionStatus('Cancha suspendida exitosamente.');
      setTimeout(() => setActionStatus(''), 3000);
    } catch (error) {
      console.error(`Error al suspender cancha ${courtId}:`, error);
      setActionStatus(`Error al suspender cancha: ${error.message}`);
      throw error;
    }
  });

  const [isReactivating, handleReactivateCourtClick] = useButtonDisable(async (courtId) => {
    try {
      setActionStatus('Reactivando cancha...');
      await courtRepository.updateCourtStatus(courtId, true);
      setCourts(prevCourts =>
        prevCourts.map(c => c.id === courtId ? { ...c, is_active: true } : c)
      );
      setActionStatus('Cancha reactivada exitosamente.');
      setTimeout(() => setActionStatus(''), 3000);
    } catch (error) {
      console.error(`Error al reactivar cancha ${courtId}:`, error);
      setActionStatus(`Error al reactivar cancha: ${error.message}`);
      throw error;
    }
  });

  const handleDeleteRequest = (court) => {
    setCourtToDelete(court);
    handleCloseModal();
  };

  const [isDeleting, handleConfirmDeleteClick] = useButtonDisable(async () => {
    if (!courtToDelete) return;

    try {
      setActionStatus(`Eliminando cancha ${courtToDelete.name}...`);
      await courtRepository.deleteCourt(courtToDelete.id);
      setCourts(prevCourts => prevCourts.filter(c => c.id !== courtToDelete.id));
      setActionStatus(`Cancha ${courtToDelete.name} eliminada exitosamente.`);
      setTimeout(() => setActionStatus(''), 3000);
    } catch (error) {
      console.error(`Error al eliminar la cancha ${courtToDelete.id}:`, error);
      setActionStatus(`Error al eliminar cancha ${courtToDelete.name}: ${error.message}`);
      throw error;
    } finally {
      setCourtToDelete(null);
    }
  });

  const handleCancelDelete = () => {
    setCourtToDelete(null);
  };

  const handleModifyRequest = (court) => {
    handleCloseModal();
    navigate(`/dashboard/manage-courts/${court.id}`);
  };

  const handleOpenModal = (court) => {
    setSelectedCourt(court);
  };

  const handleCloseModal = () => {
    setSelectedCourt(null);
  };

  return {
    courts,
    loading,
    error,
    actionStatus,
    selectedCourt,
    courtToDelete,
    isSuspending,
    isReactivating,
    isDeleting,
    handleSuspendCourtClick,
    handleReactivateCourtClick,
    handleDeleteRequest,
    handleConfirmDeleteClick,
    handleCancelDelete,
    handleModifyRequest,
    handleOpenModal,
    handleCloseModal,
  };
};
