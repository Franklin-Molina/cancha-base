import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import '../../../styles/RegisterPage.css'; // Importar el archivo CSS

/**
 * Página de registro profesional.
 * Permite a los usuarios registrarse con email y contraseña.
 * @returns {JSX.Element} El elemento JSX de la página de registro.
 */
function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_URL;

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/users/register/`, {
        username,
        email,
        password,
        password2: confirmPassword,
        first_name: firstName,
        last_name: lastName,
        edad: age,
      });

      console.log('Registro exitoso:', response.data);
      setSuccess('¡Registro exitoso! Bienvenido a nuestra plataforma.');
      setError('');
      
      // Limpiar formulario
      setUsername('');
      setFirstName('');
      setLastName('');
      setAge('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

     
    } catch (error) {
      console.error('Error en el registro:', error);
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        let errorMessage = 'Error en el registro: ';
        for (const field in backendErrors) {
          if (backendErrors.hasOwnProperty(field)) {
            errorMessage += `${field}: ${backendErrors[field].join(', ')} `;
          }
        }
        setError(errorMessage.trim());
      } else {
        setError('Error en el registro. Por favor, inténtalo de nuevo.');
      }
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

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
                  <div className="input-icon user"></div>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ingresa tu usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="input-container">
                  <div className="input-icon mail"></div>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
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
                    className="form-input"
                    placeholder="Tu nombre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Apellido</label>
                <div className="input-container">
                  <div className="input-icon user"></div>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Tu apellido"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Edad y Contraseña */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Edad</label>
                <div className="input-container">
                  <div className="input-icon calendar"></div>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Tu edad"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="1"
                    max="120"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <div className="input-container">
                  <div className="input-icon lock"></div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    className="form-input"
                    placeholder="Confirma tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
              </div>
            </div>

            {/* Botón de registro */}
            <div className="form-row single">
              <div className="form-group">
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={loading}
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