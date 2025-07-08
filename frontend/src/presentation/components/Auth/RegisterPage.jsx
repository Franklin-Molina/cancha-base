import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRegisterForm from '../../hooks/useRegisterForm.js'; // Importar el hook personalizado
import '../../../styles/RegisterPage.css'; // Importar el archivo CSS

/**
 * Página de registro profesional.
 * Permite a los usuarios registrarse con email y contraseña.
 * @returns {JSX.Element} El elemento JSX de la página de registro.
 */
function RegisterPage() {
  const {
    username, setUsername, usernameError, setUsernameError, validateUsername,
    firstName, setFirstName, firstNameError, setFirstNameError, validateName,
    lastName, setLastName, lastNameError, setLastNameError,
    age, setAge, ageError, setAgeError, validateAge,
    email, setEmail, emailError, setEmailError, validateEmail,
    password, setPassword, passwordError, setPasswordError, validatePassword,
    confirmPassword, setConfirmPassword, confirmPasswordError, setConfirmPasswordError, validateConfirmPassword,
    error, success, loading,
    handleRegistration,
    navigate, // navigate se obtiene del hook
  } = useRegisterForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleNavigation = (path) => {
    // Función para navegar a otras páginas
    navigate(path);
  };

  return (
    <div className="register-page-container">
      <div className="register-wrapper">
        {/* Header */}
        <div className="register-header">
          <div className="register-icon"></div>
          <h1 className="register-title">Crear Cuenta</h1>
          <p className="register-subtitle">Únete a nuestra comunidad y comienza tu experiencia</p>
        </div>

        {/* Contenedor principal */}
        <div className="register-container">
          <h2>Registro de Usuario</h2>
          
          {/* Mensajes de alerta */}
          {(error || success) && (
            <div className={`alert-container ${error ? 'error' : 'success'}`}>
              <div className={`alert-icon ${error ? 'error' : 'success'}`}></div>
              <p>{error || success}</p>
            </div>
          )}

          <form onSubmit={handleRegistration}>
            {/* Usuario y Email */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label"> Usuario</label>
                <div className="input-container">
                  <div className="input-icon user"></div> {/* Icono de usuario */}
                  <input
                    type="text"
                    className={`form-input ${usernameError ? 'input-error' : ''}`}
                    placeholder="Ingresa tu usuario"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError(validateUsername(e.target.value));
                    }}
                    required
                    disabled={loading}
                  />
                </div>
                {usernameError && <p className="error-message">{usernameError}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="input-container">
                  <div className="input-icon mail"></div> {/* Icono de email */}
                  <input
                    type="email"
                    className={`form-input ${emailError ? 'input-error' : ''}`}
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(validateEmail(e.target.value));
                    }}
                    required
                    disabled={loading}
                  />
                </div>
                {emailError && <p className="error-message">{emailError}</p>}
              </div>
            </div>

            {/* Nombre y Apellido */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <div className="input-container">
                  <div className="input-icon user"></div>
                  <input
                    type="text"
                    className={`form-input ${firstNameError ? 'input-error' : ''}`}
                    placeholder="Tu nombre"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setFirstNameError(validateName(e.target.value, 'nombre'));
                    }}
                    required
                    disabled={loading}
                  />
                </div>
                {firstNameError && <p className="error-message">{firstNameError}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Apellido</label>
                <div className="input-container">
                  <div className="input-icon user"></div>
                  <input
                    type="text"
                    className={`form-input ${lastNameError ? 'input-error' : ''}`}
                    placeholder="Tu apellido"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setLastNameError(validateName(e.target.value, 'apellido'));
                    }}
                    required
                    disabled={loading}
                  />
                </div>
                {lastNameError && <p className="error-message">{lastNameError}</p>}
              </div>
            </div>

            {/* Fecha de Nacimiento y Contraseña */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fecha de Nacimiento</label>
                <div className="input-container">
                  <div className="input-icon calendar"></div>
                  <input
                    type="date"
                    className={`form-input ${ageError ? 'input-error' : ''}`}
                    placeholder="Tu fecha de nacimiento"
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value);
                      setAgeError(validateAge(e.target.value));
                    }}
                    required
                    disabled={loading}
                  />
                </div>
                {ageError && <p className="error-message">{ageError}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <div className="input-container">
                  <div className="input-icon lock"></div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-input ${passwordError ? 'input-error' : ''}`}
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError(validatePassword(e.target.value));
                      setConfirmPasswordError(validateConfirmPassword(confirmPassword, e.target.value)); // Revalidar confirmación
                    }}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={`password-toggle ${showPassword ? 'visible' : 'hidden'}`}
                    onClick={togglePasswordVisibility}
                    disabled={loading}
                  ></button>
                </div>
                {passwordError && <p className="error-message">{passwordError}</p>}
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div className="form-row single">
              <div className="form-group">
                <label className="form-label">Confirmar Contraseña</label>
                <div className="input-container">
                  <div className="input-icon lock"></div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`form-input ${confirmPasswordError ? 'input-error' : ''}`}
                    placeholder="Confirma tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmPasswordError(validateConfirmPassword(e.target.value, password));
                    }}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={`password-toggle ${showConfirmPassword ? 'visible' : 'hidden'}`}
                    onClick={toggleConfirmPasswordVisibility}
                    disabled={loading}
                  ></button>
                </div>
                {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
              </div>
            </div>

            {/* Botón de registro */}
            <div className="form-row single">
              <div className="form-group">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading || usernameError || firstNameError || lastNameError || ageError || emailError || passwordError || confirmPasswordError}
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Registrando...
                    </>
                  ) : (
                    'Crear Cuenta'
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Footer del formulario */}
          <div className="form-footer">
            <p>
              ¿Ya tienes una cuenta?{' '}
              <a href="#" onClick={() => handleNavigation('/login')}>
                Iniciar Sesión
              </a>
            </p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bottom-info">
          <p>
            Al registrarte, aceptas nuestros{' '}
            <a href="#" /* onClick={() => handleNavigation('/terms')} */>
              Términos de Servicio
            </a>
            {' '}y{' '}
            <a href="#" /* onClick={() => handleNavigation('/privacy')} */>
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
