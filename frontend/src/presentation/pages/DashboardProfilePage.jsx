import React from 'react';
import LogoutButton from '../components/Auth/LogoutButton.jsx';
import '../../styles/ProfilePage.css';
import { useProfilePageLogic } from '../hooks/useProfilePageLogic.js'; // Importar el nuevo hook

function DashboardProfilePage() {
  // Usar el hook personalizado para toda la lógica de la página
  const {
    user,
    loading,
    isEditing,
    setIsEditing,
    isPasswordModalOpen,
    setIsPasswordModalOpen,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    passwordError,
    setPasswordError,
    passwordSuccess,
    setPasswordSuccess,
    username,
    setUsername,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    edad,
    setEdad,
    error,
    setError,
    success,
    setSuccess,
    isSubmittingProfile,
    isSubmittingPassword,
    handleEditClick,
    handleCancelClick,
    handleProfileSubmit,
    handleChangePasswordSubmit,
  } = useProfilePageLogic();


  return (
    <div className="profile-container">
      <h1 className="page-title">Perfil de Usuario</h1>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</div>
          <div className="profile-info-header">
            <h2 className="profile-username">{user.username}</h2>
            <p className="profile-role">{user.role}</p>
          </div>
        </div>

        {isEditing ? (
          <form className="profile-form" onSubmit={handleProfileSubmit}>
            {error && <div className="alert error-alert">{error}</div>}
            {success && <div className="alert success-alert">{success}</div>}
            <div className="form-group">
              <label htmlFor="username">Nombre de Usuario:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="firstName">Nombre:</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Apellido:</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="edad">Edad:</label>
              <input
                type="number"
                id="edad"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button className="save-button" type="submit" disabled={isSubmittingProfile}>Guardar</button>
              <button className="exit-button" type="button" onClick={handleCancelClick}>Cancelar</button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">Nombre:</span>
              <span className="detail-value">{user.first_name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Apellido:</span>
              <span className="detail-value">{user.last_name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{user.email}</span>
            </div>
            {user.edad && (
              <div className="detail-item">
                <span className="detail-label">Edad:</span>
                <span className="detail-value">{user.edad}</span>
              </div>
            )}
            <button className="edit-button" onClick={handleEditClick}>Editar Perfil</button>
            <button className="change-password-button" onClick={() => setIsPasswordModalOpen(true)}>Cambiar Contraseña</button>
          </div>
        )}
      </div>

      {/* Modal para cambiar contraseña */}
      {isPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Cambiar Contraseña</h2>
              <button className="close-button" onClick={() => setIsPasswordModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-content">
              <form onSubmit={handleChangePasswordSubmit}>
                <div className="form-group">
                  <label htmlFor="current-password">Contraseña Actual:</label>
                  <input
                    type="password"
                    id="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new-password">Nueva Contraseña:</label>
                  <input
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                {passwordError && <div className="alert error-alert">{passwordError}</div>}
                {passwordSuccess && <div className="alert success-alert">{passwordSuccess}</div>}
                <div className="form-actions">
                  <button className="save-button" type="submit" disabled={isSubmittingPassword}>Cambiar Contraseña</button>
                  <button className="exit-button" type="button" onClick={() => setIsPasswordModalOpen(false)}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="social-profiles-card">
        <h2 className="card-title">Cuentas Vinculadas</h2>
        {user.social_profiles && user.social_profiles.length > 0 ? (
          <ul className="social-profiles-list">
            {user.social_profiles.map(profile => (
              <li key={profile.id} className="social-profile-item">
                <span className="provider-label">Proveedor:</span> {profile.provider}, <span className="uid-label">UID:</span> {profile.uid}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-social-profiles">No hay cuentas sociales vinculadas.</p>
        )}
      </div>

      <div className="logout-section">
        <LogoutButton />
      </div>
    </div>
  );
}

export default DashboardProfilePage;
