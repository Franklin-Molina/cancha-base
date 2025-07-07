import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import useButtonDisable from '../hooks/useButtonDisable.js';
import { toast } from 'react-toastify'; // Importar toast de react-toastify

// Casos de uso y repositorios
import { GetUserListUseCase } from '../../application/use-cases/users/get-user-list.js';
import { ApiUserRepository } from '../../infrastructure/repositories/api-user-repository.js';
import { DeleteUserUseCase } from '../../application/use-cases/users/delete-user.js';

/**
 * Hook personalizado para la lógica de la página de gestión de usuarios cliente.
 * Encapsula la obtención, suspensión, reactivación y eliminación de usuarios.
 *
 * @returns {object} Un objeto que contiene el estado y las funciones para la gestión de usuarios.
 * @property {Array} clientUsers - Lista de usuarios cliente.
 * @property {boolean} loading - Indica si los datos están cargando.
 * @property {string|null} error - Mensaje de error si ocurre uno.
 * @property {string} actionStatus - Mensaje de estado de la última acción realizada.
 * @property {boolean} showDeleteModal - Controla la visibilidad del modal de confirmación de eliminación.
 * @property {object|null} userToDelete - Usuario seleccionado para eliminar.
 * @property {boolean} showDetailsModal - Controla la visibilidad del modal de detalles.
 * @property {object|null} userDetails - Detalles del usuario a mostrar.
 * @property {boolean} isSuspending - Indica si un usuario se está suspendiendo.
 * @property {boolean} isReactivating - Indica si un usuario se está reactivando.
 * @property {boolean} isDeleting - Indica si un usuario se está eliminando.
 * @property {Function} fetchClientUsers - Función para recargar la lista de usuarios cliente.
 * @property {Function} handleSuspendUserClick - Función para suspender un usuario.
 * @property {Function} handleReactivateUserClick - Función para reactivar un usuario.
 * @property {Function} confirmDelete - Función para solicitar la eliminación de un usuario.
 * @property {Function} cancelDelete - Función para cancelar la eliminación de un usuario.
 * @property {Function} proceedDeleteClick - Función para confirmar la eliminación de un usuario.
 * @property {Function} handleViewDetails - Función para ver los detalles de un usuario.
 * @property {Function} handleCloseDetailsModal - Función para cerrar el modal de detalles.
 */
export const useDashboardUsersLogic = () => {
  const { user } = useAuth();
  const [clientUsers, setClientUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const userRepository = useMemo(() => new ApiUserRepository(), []);
  const getUserListUseCase = useMemo(() => new GetUserListUseCase(userRepository), [userRepository]);
  const deleteUserUseCase = useMemo(() => new DeleteUserUseCase(userRepository), [userRepository]);

  const fetchClientUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserListUseCase.execute({ role: 'cliente' });
      const users = Array.isArray(response) ? response : response.results || response.users || [];
      setClientUsers(users);
      setLoading(false);
    } catch (err) {
      // console.error("Error al obtener usuarios cliente:", err); // Eliminado mensaje de consola
      setError(err);
      setClientUsers([]);
      setLoading(false);
      toast.error('Error al cargar usuarios.'); // Alerta de error
    }
  };

  useEffect(() => {
    if (user) {
      fetchClientUsers();
    } else {
      setLoading(false);
    }
  }, [user, getUserListUseCase]);

  const [isSuspending, handleSuspendUserClick] = useButtonDisable(async (userId) => {
    try {
      await userRepository.updateClientUserStatus(userId, false);
      setClientUsers(prevUsers =>
        prevUsers.map(u => u.id === userId ? { ...u, is_active: false } : u)
      );
      toast.success('Usuario suspendido exitosamente.'); // Alerta de éxito
    } catch (err) {
      // console.error(`Error al suspender usuario ${userId}:`, err); // Eliminado mensaje de consola
      toast.error(`Error al suspender usuario: ${err.message}`); // Alerta de error
      throw err;
    }
  });

  const [isReactivating, handleReactivateUserClick] = useButtonDisable(async (userId) => {
    try {
      await userRepository.updateClientUserStatus(userId, true);
      setClientUsers(prevUsers =>
        prevUsers.map(u => u.id === userId ? { ...u, is_active: true } : u)
      );
      toast.success('Usuario reactivado exitosamente.'); // Alerta de éxito
    } catch (err) {
      // console.error(`Error al reactivar usuario ${userId}:`, err); // Eliminado mensaje de consola
      toast.error(`Error al reactivar usuario: ${err.message}`); // Alerta de error
      throw err;
    }
  });

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  const [isDeleting, proceedDeleteClick] = useButtonDisable(async () => {
    if (userToDelete) {
      try {
        await deleteUserUseCase.execute(userToDelete.id);
        setClientUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
        toast.success('Usuario eliminado exitosamente.'); // Alerta de éxito
      } catch (err) {
        // console.error(`Error al eliminar usuario ${userToDelete.id}:`, err); // Eliminado mensaje de consola
        toast.error(`Error al eliminar usuario: ${err.message}`); // Alerta de error
        throw err;
      } finally {
        cancelDelete();
      }
    }
  });

  const handleViewDetails = (user) => {
    setUserDetails(user);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setUserDetails(null);
    setShowDetailsModal(false);
  };

  return {
    clientUsers,
    loading,
    error,
    showDeleteModal,
    userToDelete,
    showDetailsModal,
    userDetails,
    isSuspending,
    isReactivating,
    isDeleting,
    fetchClientUsers,
    handleSuspendUserClick,
    handleReactivateUserClick,
    confirmDelete,
    cancelDelete,
    proceedDeleteClick,
    handleViewDetails,
    handleCloseDetailsModal,
  };
};
