import React from 'react';
import '../../styles/HomePage.css';
import '../../styles/dashboard.css';
import '../../styles/CourtDetailPage.css';
import Spinner from '../components/common/Spinner';
import Modal from '../components/common/Modal';
import WeeklyAvailabilityCalendar from '../pages/WeeklyAvailabilityCalendar.jsx';
import { Check, Icon } from 'lucide-react';
import { soccerBall } from '@lucide/lab';
import { format, addDays } from 'date-fns'; // Mantener format y añadir addDays para el JSX

// Importar el nuevo hook personalizado
import { useCourtDetailLogic } from '../hooks/useCourtDetailLogic.js';

function CourtDetailPage() {
  // Usar el hook personalizado para toda la lógica de la página
  const {
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
  } = useCourtDetailLogic();

  if (loading) {
    return (
      <div className="court-detail-loading">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="court-detail-error">
        <div className="error-content">
          <h2>¡Oops! Algo salió mal</h2>
          <p>Error al cargar detalles de la cancha: {error.message}</p>
          <button className="retry-button" onClick={fetchCourtDetails}>
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="court-detail-not-found">
        <div className="not-found-content">
          <h2>Cancha no encontrada</h2>
          <p>Lo sentimos, no pudimos encontrar la cancha que buscas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="court-detail-container">


      {/* Header de la cancha */}


      <div className="availability-section">
        <div className="availability-header">
          <div className="test">
            <div className="header-left">
              <div className="header-icon">
                {/* Icono de cancha, puedes usar un icono de Lucide React si es necesario */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
              </div>
              <div className="header-text">
                <h1 className="header-title">{court.name}</h1>
              </div>
            </div>
            <div className="container-price">
              <div className="court-price-badge">
                <span className="price-label">Precio por hora</span>
                <span className="price-value">${court.price}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Información de la cancha */}
      <div className="court-info-section">
        {court.description && (
          <div className="court-description">
            <h3>Descripción</h3>
            <p>{court.description}</p>
          </div>
        )}

        {court.characteristics && (
          <div className="court-characteristics">
            <h3>Características</h3>
            <p>{court.characteristics}</p>
          </div>
        )}
      </div>
      {/* Stats Cards */}
     {/*  <div className="stats-container">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-text">
              <p className="stat-label">Slots Disponibles</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-text">
              <p className="stat-label">Disponibilidad</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Galería de imágenes */}
      {court.images && court.images.length > 0 && (
        <div className="court-gallery-section">
          <div className='sub-content-imagen'>
            <h3>Galería</h3>
            <div className="court-image-gallery">
              {court.images.map(image => (
                <div
                  key={image.id}
                  className="gallery-image-container"
                  onClick={() => openModal(image)}
                >
                  <img
                    src={image.image}
                    alt={`Imagen de ${court.name}`}
                    className="gallery-image"
                  />
                  <div className="image-overlay">
                    <span className="view-icon">👁</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Test button*/}
      <div className="availability-container-b">
        <div className="availability-header-moder">
          <div className="header-content-b">
            <div className="header-title-b">
              <div className="header-icon">📅</div>
              <div className="header-text">
                <h1>Reservas</h1>
                <p>Gestiona tu horario disponible</p>
              </div>
            </div>
            <div className="week-navigation-b">
              <button className="nav-button-b" onClick={handlePreviousWeek}
                aria-label="Semana anterior">
                ← Anterior
              </button>
              <span className="current-week-b">
                {format(currentWeekStartDate, 'dd/MM/yyyy')} - {format(addDays(currentWeekStartDate, 6), 'dd/MM/yyyy')}
              </span>

              <button className="nav-button-b"
                onClick={handleNextWeek}
                aria-label="Semana siguiente">
                Siguiente →
              </button>
            </div>
            <div className="legend">
              <div className="legend-item legend-disponible">                             
                  <Check className="icon-check" />                           
                <span>Disponible</span>
              </div>
              <div className="legend-item legend-ocupado">
                <Icon iconNode={soccerBall} className="iconsoccer" />
                <span>Ocupado</span>
              </div>

            </div>
          </div>
        </div>


      </div>
      {/* Sección de disponibilidad */}
      <div className="availability-section">

        <div className="calendar-container">
          <WeeklyAvailabilityCalendar
            weeklyAvailability={weeklyAvailability}
            loadingWeeklyAvailability={loadingWeeklyAvailability}
            weeklyAvailabilityError={weeklyAvailabilityError}
            onTimeSlotClick={handleCellClick}
            daysOfWeek={daysOfWeek}
            hoursOfDay={hoursOfDay}
            monday={currentWeekStartDate}
          />
        </div>
      </div>

      {/* Mensajes de estado */}
      {bookingError && (
        <div className="booking-message booking-error">
          <span className="message-icon">⚠️</span>
          <span>{bookingError}</span>
        </div>
      )}

      {bookingSuccess && (
        <div className="booking-message booking-success">
          <span className="message-icon">✅</span>
          <span>¡Reserva creada con éxito!</span>
        </div>
      )}

      {/* Modal de imagen expandida */}
      {selectedImage && (
        <div className="image-modal-overlay" onClick={closeModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Imagen expandida" className="modal-expanded-image" />
            <button className="modal-close-button" onClick={closeModal}>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación de reserva */}
      {showConfirmModal && bookingDetailsToConfirm && (
        <div className="booking-modal-overlay">
          <div className="booking-modal-content">
            <div className="modal-headerx">
              <h2 className="modal-title">Confirmar reservación </h2>
            </div>

            <div className="modal-body">
              <p className="confirmation-question">¿Estás seguro de que deseas reservar esta cancha?</p>

              <div className="booking-details">
                <div className="detail-item">
                  <span className="detail-label">Cancha:</span>
                  <span className="detail-value">{bookingDetailsToConfirm.courtName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fecha:</span>
                  <span className="detail-value">{format(bookingDetailsToConfirm.startDateTime, 'dd/MM/yyyy')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Hora:</span>
                  <span className="detail-value">
                    {format(bookingDetailsToConfirm.startDateTime, 'h:mm a')} - {format(bookingDetailsToConfirm.endDateTime, 'h:mm a')}
                  </span>
                </div>
                <div className="detail-item price-item">
                  <span className="detail-label">Precio:</span>
                  <span className="detail-value price-highlight">${bookingDetailsToConfirm.price}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={confirmBooking}
                className="action-button confirm-button"
                disabled={isBooking}
              >
                {isBooking ? 'Procesando...' : 'Confirmar Reserva'}
              </button>
              <button
                onClick={cancelConfirmation}
                className="action-button cancel-button"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nuevo Modal para solicitar inicio de sesión */}
      <Modal
        show={showLoginModal}
        onClose={handleCloseLoginModal}
        title="Acceso Requerido"
      >
        <p>Para reservar una cancha, debes estar registrado e iniciar sesión.</p>
        <button onClick={handleCloseLoginModal} className="modal-button">
          Ir a Iniciar Sesión
        </button>
      </Modal>
    </div>
  );
}

export default CourtDetailPage;
