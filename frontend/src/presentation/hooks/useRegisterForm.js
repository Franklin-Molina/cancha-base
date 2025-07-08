import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Hook personalizado para manejar la lógica del formulario de registro y sus validaciones.
 * @returns {Object} Un objeto que contiene los estados del formulario, errores y funciones de manejo.
 */
const useRegisterForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [firstName, setFirstNameState] = useState('');
  const [lastName, setLastNameState] = useState('');
  const [age, setAge] = useState(''); // age representa fecha_nacimiento
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados para los errores de validación de cada campo
  const [usernameError, setUsernameError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Funciones de validación
  const validateUsername = (value) => {
    if (!value) return 'El usuario es requerido.';
    if (value.length < 3) return 'El usuario debe tener al menos 3 caracteres.';
    if (value.length > 30) return 'El usuario no debe exceder los 30 caracteres.';
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) return 'El usuario solo puede contener letras, números, guiones bajos y guiones medios.';
    return '';
  };

  const validateName = (value, fieldName) => {
    if (!value) return `El ${fieldName} es requerido.`;
    if (value.length < 2) return `El ${fieldName} debe tener al menos 2 caracteres.`;
    if (value.length > 50) return `El ${fieldName} no debe exceder los 50 caracteres.`;
    if (!/^[a-zA-Z\s]+$/.test(value)) return `El ${fieldName} solo puede contener letras y espacios.`;
    return '';
  };

  const validateAge = (value) => {
    if (!value) return 'La fecha de nacimiento es requerida.';
    const birthDate = new Date(value);
    const today = new Date();
    const ageInYears = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (birthDate > today) return 'La fecha de nacimiento no puede ser en el futuro.';
    if (ageInYears < 14 || (ageInYears === 14 && (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)))) {
      return 'Debes tener al menos 14 años.';
    }
    return '';
  };

  // Funciones para actualizar el estado filtrando caracteres no permitidos
  const setFirstName = (value) => {
    const filteredValue = value.replace(/[^a-zA-Z\s]/g, ''); // Solo letras y espacios
    setFirstNameState(filteredValue);
  };

  const setLastName = (value) => {
    const filteredValue = value.replace(/[^a-zA-Z\s]/g, ''); // Solo letras y espacios
    setLastNameState(filteredValue);
  };

  const validateEmail = (value) => {
    if (!value) return 'El email es requerido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Formato de email inválido.';
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return 'La contraseña es requerida.';
    if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (!/[A-Z]/.test(value)) return 'La contraseña debe contener al menos una letra mayúscula.';
    if (!/[a-z]/.test(value)) return 'La contraseña debe contener al menos una letra minúscula.';
    if (!/[0-9]/.test(value)) return 'La contraseña debe contener al menos un número.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'La contraseña debe contener al menos un carácter especial.';
    return '';
  };

  const validateConfirmPassword = (value, passwordValue) => {
    if (!value) return 'La confirmación de contraseña es requerida.';
    if (value !== passwordValue) return 'Las contraseñas no coinciden.';
    return '';
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Limpiar errores generales antes de la validación
    setSuccess(''); // Limpiar mensaje de éxito

    // Validar todos los campos antes de enviar
    const usernameErr = validateUsername(username);
    const firstNameErr = validateName(firstName, 'nombre');
    const lastNameErr = validateName(lastName, 'apellido');
    const ageErr = validateAge(age);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmPasswordErr = validateConfirmPassword(confirmPassword, password);

    setUsernameError(usernameErr);
    setFirstNameError(firstNameErr);
    setLastNameError(lastNameErr);
    setAgeError(ageErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);

    // Si hay algún error, detener el envío
    if (usernameErr || firstNameErr || lastNameErr || ageErr || emailErr || passwordErr || confirmPasswordErr) {
      setLoading(false);
      setError('Por favor, corrige los errores en el formulario.');
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
        fecha_nacimiento: age,
      });

      //console.log('Registro exitoso:', response.data);
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

      // Hacer que el mensaje de éxito desaparezca después de 1.5 segundos
      setTimeout(() => {
        setSuccess('');
      }, 1500);

    } catch (error) {
      console.error('Error en el registro:', error);
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        let errorMessage = 'Error en el registro:';
        const fieldMap = {
          username: 'usuario',
          email: 'correo electrónico',
          password: 'contraseña',
          password2: 'confirmación de contraseña',
          first_name: 'nombre',
          last_name: 'apellido',
          fecha_nacimiento: 'fecha de nacimiento',
        };

        const errorMessages = [];
        for (const field in backendErrors) {
          if (backendErrors.hasOwnProperty(field)) {
            const friendlyFieldName = fieldMap[field] || field;
            errorMessages.push(`${friendlyFieldName}: ${backendErrors[field].join(', ')}`);
          }
        }
        setError(`${errorMessage}\n${errorMessages.join('\n')}`);
      } else {
        setError('Error en el registro. Por favor, inténtalo de nuevo.');
      }
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return {
    username, setUsername, usernameError, setUsernameError, validateUsername,
    firstName, setFirstName, firstNameError, setFirstNameError, validateName, // firstName y setFirstName ahora son las funciones filtradas
    lastName, setLastName, lastNameError, setLastNameError, // lastName y setLastName ahora son las funciones filtradas
    age, setAge, ageError, setAgeError, validateAge,
    email, setEmail, emailError, setEmailError, validateEmail,
    password, setPassword, passwordError, setPasswordError, validatePassword,
    confirmPassword, setConfirmPassword, confirmPasswordError, setConfirmPasswordError, validateConfirmPassword,
    error, success, loading,
    handleRegistration,
    navigate, // Para la navegación, aunque podría manejarse fuera del hook si es solo para enlaces estáticos
    login, // Si login se usa dentro del hook, mantenerlo aquí
  };
};

export default useRegisterForm;
