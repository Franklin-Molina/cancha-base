import React from 'react';
import { useCourtForm } from '../../hooks/useCourtForm'; // Importar el hook personalizado
import '../../../styles/CourtForm.css'; // Importar los estilos
import { Upload, X, Camera, MapPin, DollarSign, FileText, Image } from 'lucide-react';


function CourtForm() {
  const {
    formData,
    handleChange,
    handleRemoveImage,
    handleSubmit,
    isSubmitting,
  } = useCourtForm();

  return (
    <div className="court-form-widget">
      <div className="court-form-widget-header">
        <MapPin className="header-icon" /> {/* Icono de ubicación */}
        <div className="header-text-content">
          <div className="court-form-widget-title">Crear Nueva Cancha</div>
          <div className="court-form-widget-subtitle">Completa la información para registrar tu cancha deportiva

</div>
        </div>
      </div>
      <div className="court-form-widget-content">
        {/* Eliminamos la lógica de renderizado de mensajes aquí, ya que react-toastify los manejará */}
        <form onSubmit={handleSubmit}>
          {/* Contenedor para Nombre y Precio */}
          <div className="court-form-name-price-group">
            {/* Nombre de la Cancha */}
            <div className="court-form-input-group">
              <label htmlFor="name" className="court-form-label">
                <MapPin className="input-icon" /> Nombre de la Cancha
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="court-form-input"
                placeholder="Ej: Cancha de Fútbol El Campeón"
              />
            </div>

            {/* Precio por Hora */}
            <div className="court-form-input-group">
              <label htmlFor="price" className="court-form-label">
                <DollarSign className="input-icon green-icon" /> Precio por Hora
              </label>
             
                
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  pattern="[0-9]*\.?[0-9]*"
                  inputMode="decimal"
                  className="price-input"
                  placeholder="$ 0.00"
                />
              
            </div>
          </div>          

          {/* Descripción */}
          <div className="court-form-input-group">
            <label htmlFor="description" className="court-form-label">
              <FileText className="input-icon purple-icon" /> Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="court-form-textarea"
              placeholder="Describe las características de tu cancha, servicios incluidos, ubicación, etc."
            ></textarea>
          </div>

          {/* Campo para las imágenes */}
          <div className="court-form-input-group">
            <div className="court-form-gallery-header">
              <label className="court-form-label">
                <Image className="input-icon orange-icon" /> Fotografías de la Cancha
              </label>
              <div className="photo-count-text">{formData.images.length}/5 fotos</div>
            </div>
            <div className="court-form-gallery">
              {/* Previsualizaciones de imágenes */}
              {formData.images.map((image, index) => (
                <div key={index} className="court-form-image-container">
                  <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} className="court-form-image-preview" />
                  <div className="court-form-dark-overlay"></div>
                  <button type="button" className="court-form-close-btn" onClick={() => handleRemoveImage(index)}>
                    <X size={16} /> {/* Icono de X para cerrar */}
                  </button>
                </div>
              ))}

              {/* Botón Agregar foto */}
              {formData.images.length < 5 && (
                <label htmlFor="images-input" className="court-form-image-container add-photo-container">
                  <div className="court-form-add-photo">
                    <Camera className="add-photo-icon" /> {/* Icono de cámara */}
                    <div className="court-form-add-photo-text">Agregar foto</div>
                  </div>
                  <input
                    type="file"
                    id="images-input"
                    name="images"
                    onChange={handleChange}
                    accept="image/*"
                    multiple
                    className="court-form-hidden-input"
                  />
                </label>
              )}
            </div>
          </div>

          <button type="submit" className="court-form-submit-button" disabled={isSubmitting}>
            Crear Cancha
          </button>
        </form>
      </div>
    </div>
  );
}

export default CourtForm;
