import React from 'react';
import '../styles/RegisterPage.css';
import { useRegisterLogic } from '../hooks/useRegisterLogic.js'; // Importar el nuevo hook

function RegisterPage() {
  // Usar el hook personalizado para toda la lógica de la página de registro
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    age,
    setAge,
    error,
    isSubmitting,
    handleFormSubmit,
  } = useRegisterLogic();

  return (
    <div className="register-container"> {/* Usar la clase register-container */}
      <h2>Registro de Usuario</h2> {/* Usar h2 para el título */}
      {error && <div className="error">{error}</div>} {/* Usar la clase error para mostrar errores */}
      <form onSubmit={handleFormSubmit}>
        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              id="username"
              className="form-input"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              id="nombre"
              className="form-input"
              placeholder="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="apellido"
              className="form-input"
              placeholder="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <input
              type="number"
              id="edad"
              className="form-input"
              placeholder="Edad"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <input
              type="password"
              id="confirmPassword"
              className="form-input"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>Registrar</button>
      </form>
    </div>
  );
}

export default RegisterPage;
