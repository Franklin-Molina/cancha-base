import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/common/Spinner.jsx';
import { useDashboardUsersLogic } from '../hooks/useDashboardUsersLogic.js'; // Importar el nuevo hook

import '../../styles/dashboard.css';
import '../../styles/DashboardUserTable.css';

function DashboardUsersPage() {
  // Usar el hook personalizado para toda la lógica de la página
  const {
    clientUsers,
    loading,
    error,
    actionStatus,
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
  } = useDashboardUsersLogic();

  const { user } = useAuth(); // Mantener useAuth para verificar el rol del usuario si es necesario en el JSX


  if (loading) {
    return <Spinner />; 
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error.message}</div>;
  }

  return (
    <div className="user-page-content"> {/* Usar la clase del layout */}
      <h1 className="page-title">Gestión de Usuarios Cliente</h1> {/* Usar page-title */}

      {actionStatus && (
        <div className="messages">
          <div className={`alert ${actionStatus.includes('Error') ? 'error-alert' : 'success-alert'}`}>
            {actionStatus}
          </div>
        </div>
      )}

      {/* Verificar si clientUsers es un array y no está vacío antes de mapear */}
      {Array.isArray(clientUsers) && clientUsers.length === 0 ? (
        <p>No se encontraron usuarios cliente.</p>
      ) : (
        Array.isArray(clientUsers) && ( // Asegurarse de que sea un array antes de renderizar la tabla
          <table className="users-table">
            {/* Usar la clase admin-table */}
            <thead>
              <tr>               
                <th>Usuario</th> 
                <th>Nombre</th>
                <th>Estado</th>
                <th>Acciones</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
  {clientUsers.map(clientUser => (
    <tr key={clientUser.id}>
      <td>{clientUser.username}</td>
      <td>{clientUser.first_name} {clientUser.last_name}</td>
      <td>
        <span className={`status ${clientUser.is_active ? 'status-active' : 'status-suspended'}`}>
          {clientUser.is_active ? 'Activo' : 'Suspendido'}
        </span>
      </td>
      <td>
        {clientUser.is_active ? (
          <button
            onClick={() => handleSuspendUserClick(clientUser.id)}
            className="action-button button-suspend"
            disabled={isSuspending}
          >
            Suspender
          </button>
        ) : (
          <button
            onClick={() => handleReactivateUserClick(clientUser.id)}
            className="action-button button-reactivate"
            disabled={isReactivating}
          >
            Reactivar
          </button>
        )}
        <button
          onClick={() => confirmDelete(clientUser)}
          className="action-button button-delete"
        >
          Eliminar
        </button>
      </td>
      <td>
        <button
          onClick={() => handleViewDetails(clientUser)}
          className="action-button button-details"
        >
          Ver más
        </button>
      </td>
    </tr>
  ))}
</tbody>

          
          </table>)
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && userToDelete && (
        <div className="modal-delete">
          <div className="modal-contentx">
            <h2 className='modal-title'>Confirmar Eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar al usuario:</p>
            <p><strong>Usuario:</strong> {userToDelete.username}</p>
            <p><strong>Email:</strong> {userToDelete.email}</p>
            <p><strong>Nombre:</strong> {userToDelete.first_name} {userToDelete.last_name}</p>
            <div className="modal-actions">
              <button onClick={proceedDeleteClick} className="action-button button-delete" disabled={isDeleting}>Sí, Eliminar</button>
              <button onClick={cancelDelete} className="action-button button-cancel">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles del Usuario */}
      {showDetailsModal && userDetails && (
        <div className="modal-details">
          <div className="modal-contentx">
            <h2 className='modal-title'>Detalles del Usuario</h2>
            <p><strong>ID:</strong> {userDetails.id}</p>
            <p><strong>Usuario:</strong> {userDetails.username}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Nombre:</strong> {userDetails.first_name}</p>
            <p><strong>Apellido:</strong> {userDetails.last_name}</p>
            <p><strong>Rol:</strong> {userDetails.role}</p>
            <p><strong>Estado:</strong> {userDetails.is_active ? 'Activo' : 'Suspendido'}</p>
            {/* Agrega aquí más campos si es necesario */}
            <div className="modal-actions">
              <button onClick={handleCloseDetailsModal} className="action-button button-cancel">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardUsersPage;
