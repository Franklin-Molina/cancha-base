import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useButtonDisable from '../hooks/useButtonDisable.js';

// Importar el caso de uso y el repositorio
import { RegisterUserUseCase } from '../../application/use-cases/users/register-user.js';
import { ApiUserRepository } from '../../infrastructure/repositories/api-user-repository.js';

/**
 * Hook personalizado para la lógica de la página de registro.
 * Encapsula el manejo del formulario de registro y la interacción con el caso de uso de registro.
 *
 * @returns {object} Un objeto que contiene el estado y las funciones para el registro.
 * @property {string} username - Nombre de usuario del formulario.
 * @property {Function} setUsername - Setter para el nombre de usuario.
 * @property {string} email - Email del formulario.
 * @property {Function} setEmail - Setter para el email.
 * @property {string} password - Contraseña del formulario.
 * @property {Function} setPassword - Setter para la contraseña.
 * @property {string} confirmPassword - Confirmación de contraseña del formulario.
 * @property {Function} setConfirmPassword - Setter para la confirmación de contraseña.
 * @property {string} firstName - Nombre del usuario del formulario.
 * @property {Function} setFirstName - Setter para el nombre.
 * @property {string} lastName - Apellido del usuario del formulario.
 * @property {Function} setLastName - Setter para el apellido.
 * @property {string} age - Edad del usuario del formulario.
 * @property {Function} setAge - Setter para la edad.
 * @property {string} error - Mensaje de error del registro.
 * @property {boolean} isSubmitting - Indica si el formulario se está enviando.
 * @property {Function} handleFormSubmit - Manejador para el envío del formulario de registro.
 */
export const useRegisterLogic = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Instanciar repositorio y caso de uso
  const userRepository = new ApiUserRepository();
  const registerUserUseCase = new RegisterUserUseCase(userRepository);

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const [isSubmitting, handleFormSubmit] = useButtonDisable(async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!username || !email || !password || !confirmPassword || !firstName || !lastName || !age) {
      setError('Por favor completa todos los campos.');
      alert("completa esa wea")
      return;
    }

    try {
      await registerUserUseCase.execute(username, email, password, firstName, lastName, parseInt(age, 10));
      console.log('Registro exitoso');
      navigate('/login');
    } catch (err) {
      console.error('Error en el registro:', err.response ? err.response.data : err.message);
      let errorMessage = 'Error en el registro';
      if (err.response && err.response.data) {
        // Si err.response.data es un objeto (como { "campo": ["error1", "error2"] })
        if (typeof err.response.data === 'object') {
          errorMessage = Object.keys(err.response.data).map(field => {
            const fieldErrors = err.response.data[field];
            // Asegurarse de que fieldErrors sea un array antes de usar join
            if (Array.isArray(fieldErrors)) {
              return `${field}: ${fieldErrors.join(', ')}`;
            } else {
              // Si no es un array, tratarlo como una cadena o convertirlo
              return `${field}: ${fieldErrors}`;
            }
          }).join('\n');
        } else {
          // Si err.response.data no es un objeto (ej. una cadena de error global)
          errorMessage = err.response.data;
        }
      }
      setError(errorMessage);
      throw err; // Re-lanzar el error para que useButtonDisable lo maneje
    }
  });

  return {
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
    setError,
    isSubmitting,
    handleFormSubmit,
  };
};
