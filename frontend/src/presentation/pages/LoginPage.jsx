import React from 'react';
import { useLoginLogic } from '../hooks/useLoginLogic.js'; // Importar el nuevo hook

function LoginPage() {
  // Usar el hook personalizado para la lógica de la página de login
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    handleSubmit,
  } = useLoginLogic();

  return (
    <div>
      <h1>Página de Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className='show-password'>Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default LoginPage;
