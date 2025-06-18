import React from 'react';
import '../../styles/dashboard.css';
import '../../styles/DashboardCanchaTable.css';
import Spinner from '../components/common/Spinner';
import { useModifyCourtLogic } from '../hooks/useModifyCourtLogic.js'; // Importar el nuevo hook

function DashboardModifyCourtPage() {
  // Usar el hook personalizado para toda la lógica de la página
  const {
    formData,
    loading,
    error,
    actionStatus,
    isSubmitting,
    handleChange,
    handleRemoveImage,
    handleSubmit,
    navigate,
  } = useModifyCourtLogic();

  if (loading) {
    return <Spinner />; 
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="dashboard-page-title">Modificar Cancha: {formData.name}</h1>
       {actionStatus && (
        <div className="messages">
          <div className={`alert ${actionStatus.includes('Error') ? 'error-alert' : 'success-alert'}`}>
            {actionStatus}
          </div>
        </div>
      )}
      <div className="widget">
        <div className="widget-header">
          <div className="widget-title">Detalles de la Cancha</div>
        </div>
        <div className="widget-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Nombre:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price" className="form-label">Precio:</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="characteristics" className="form-label">Características:</label>
              <textarea
                id="characteristics"
                name="characteristics"
                value={formData.characteristics}
                onChange={handleChange}
                className="form-input"
              />
            </div>

         

            {/* Sección de Imágenes (adaptada de CourtForm.jsx) */}
            <div className="form-group">
               <div className="header">
                  <div>Fotos - <span id="photo-count">{formData.images.length}</span>/5 - Puedes agregar un máximo de 5 fotos.</div>
              </div>
              <div className="gallery">
                  {/* Previsualizaciones de imágenes */}
                  {formData.images.map((image, index) => (
                      <div key={image.id || index} className="image-container">
                          {/* Determinar la fuente de la imagen: URL existente o URL temporal para nueva imagen */}
                          <img
                            src={image instanceof File ? URL.createObjectURL(image) : image.image}
                            alt={`Preview ${index}`}
                            className="image-preview"
                          />
                           <div className="dark-overlay"></div>
                          <button type="button" className="close-btn" onClick={() => handleRemoveImage(index)}>✕</button>
                      </div>
                  ))}

                  {/* Botón Agregar foto (adaptado del ejemplo) */}
                  {formData.images.length < 5 && ( // Mostrar solo si no se alcanzó el límite
                      <label htmlFor="images-input" className="image-container">
                          <div className="add-photo">
                              <div className="add-photo-icon">📷</div>
                              <div className="add-photo-text">Agregar foto</div>
                          </div>
                          <input
                              type="file"
                              id="images-input" // Cambiado el ID
                              name="images" // Cambiado el nombre
                              onChange={handleChange}
                              accept="image/*"
                              multiple // Permitir múltiples archivos
                              style={{ display: 'none' }}
                          />
                      </label>
                  )}
              </div>
            </div>


            <div className="modal-actions">
              <button type="submit" className="action-button button-modify" disabled={isSubmitting}>Guardar Cambios</button>
              <button type="button" onClick={() => navigate('/dashboard/canchas/manage')} className="action-button button-cancel">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DashboardModifyCourtPage;
