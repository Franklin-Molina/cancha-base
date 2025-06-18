import React from 'react';
import CourtActionsModal from '../components/Dashboard/CourtActionsModal.jsx';
import '../../styles/DashboardCanchaTable.css';
import Spinner from '../components/common/Spinner.jsx';
import { useManageCourtsLogic } from '../hooks/useManageCourtsLogic.js'; // Importar el nuevo hook

function DashboardManageCourtsPage() {
  // Usar el hook personalizado para toda la lógica de la página
  const {
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
  } = useManageCourtsLogic();

  if (loading) {
    return <Spinner />; 
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="dashboard-page-title">Gestión de Canchas</h1>
       {actionStatus && (
        <div className="messages">
          <div className={`alert ${actionStatus.includes('Error') ? 'error-alert' : 'success-alert'}`}>
            {actionStatus}
          </div>
        </div>
      )}
      {/* Contenido de la sección de gestión de canchas */}
      {/* <p>Aquí se listarán y gestionarán las canchas.</p> */}
      {/* TODO: Implementar tabla de canchas */}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {courts.map(court => (
            <tr key={court.id}>
              <td>{court.id}</td>
              <td>{court.name}</td>
              <td>{court.price}</td>
              <td>{court.is_active ? 'Activa' : 'Suspendida'}</td>
              <td>
                <button
                  onClick={() => handleOpenModal(court)}
                  className="action-button button-more"
                >
                  Ver más
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedCourt && (
        <CourtActionsModal
          court={selectedCourt}
          onClose={handleCloseModal}
          onDeleteRequest={handleDeleteRequest}
          onModifyRequest={handleModifyRequest}
          onToggleActiveStatus={async (courtId, isActive) => {
            if (isActive) {
              await handleReactivateCourtClick(courtId);
            } else {
              await handleSuspendCourtClick(courtId);
            }
          }}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      {courtToDelete && (
        <div className="modal-details"> {/* Reutilizar clases de estilo si es posible */}
          <div className="modal-contentx">
            <h2 className="modal-title">Confirmar Eliminación</h2>
            <p>¿Está seguro de que desea eliminar la cancha "{courtToDelete.name}"?</p>
            <div className="modal-actions">
              <button onClick={handleConfirmDeleteClick} className="action-button button-delete" disabled={isDeleting}>Sí, eliminar</button>
              <button onClick={handleCancelDelete} className="action-button button-cancel">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Eliminar renderizado condicional del formulario de modificación */}
      {/* {courtToModify && (
        <CourtModifyForm
          court={courtToModify}
          onSave={handleUpdateCourt}
          onCancel={handleCancelModify}
        />
      )} */}




    </div>
  );
}

export default DashboardManageCourtsPage;
