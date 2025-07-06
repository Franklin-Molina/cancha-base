import { useState } from 'react';
import { CreateCourtUseCase } from '../../application/use-cases/courts/create-court';
import { ApiCourtRepository } from '../../infrastructure/repositories/api-court-repository';
import useButtonDisable from './useButtonDisable.js';

export const useCourtForm = () => {
  const courtRepository = new ApiCourtRepository();
  const createCourtUseCase = new CreateCourtUseCase(courtRepository);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    images: [],
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setFormData({
        ...formData,
        images: [...formData.images, ...Array.from(files)],
      });
    } else if (name === 'price') {
      const re = /^[0-9]*\.?[0-9]*$/;
      if (value === '' || re.test(value)) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  // Función para validar los campos del formulario
  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'El nombre de la cancha es obligatorio.' });
      return false;
    }
    if (!formData.price.trim()) {
      setMessage({ type: 'error', text: 'El precio por hora es obligatorio.' });
      return false;
    }
    if (isNaN(parseFloat(formData.price))) {
      setMessage({ type: 'error', text: 'El precio debe ser un número válido.' });
      return false;
    }
    if (!formData.description.trim()) {
      setMessage({ type: 'error', text: 'La descripción es obligatoria.' });
      return false;
    }
    // Puedes añadir validación para las imágenes si es necesario
    // if (formData.images.length === 0) {
    //   setMessage({ type: 'error', text: 'Debes subir al menos una imagen.' });
    //   return false;
    // }
    return true;
  };

  const [isSubmitting, handleSubmit] = useButtonDisable(async (e) => {
    e.preventDefault();
    setMessage(null); // Limpiar mensajes anteriores

    // Validar el formulario antes de intentar enviar
    if (!validateForm()) {
      return; // Detener el envío si la validación falla
    }

    const courtData = {
      name: formData.name,
      price: parseFloat(formData.price), // Convertir precio a número
      description: formData.description,
      images: formData.images,
    };

    try {
      const createdCourt = await createCourtUseCase.execute(courtData);
      console.log('Cancha creada:', createdCourt);
      setMessage({ type: 'success', text: 'Cancha creada exitosamente!' });
      setFormData({
        name: '',
        price: '',
        description: '',
        images: [],
      });
    } catch (error) {
      console.error('Error al crear cancha:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data) {
        let errorText = 'Error al crear cancha: ';
        if (typeof error.response.data === 'object' && error.response.data !== null) {
           try {
              const errorMessages = Object.entries(error.response.data)
                .map(([field, messages]) => {
                   const msgArray = Array.isArray(messages) ? messages : [messages];
                   return `${field}: ${msgArray.join(', ')}`;
                })
                .join('; ');
              errorText += errorMessages;
           } catch (formatError) {
              errorText += JSON.stringify(error.response.data);
           }
        } else {
          errorText += error.response.data;
        }
        setMessage({ type: 'error', text: errorText });
      } else {
        setMessage({ type: 'error', text: 'Error al crear cancha. Verifica la conexión o los datos.' });
      }
      throw error;
    }
  });

  return {
    formData,
    message,
    handleChange,
    handleRemoveImage,
    handleSubmit,
    isSubmitting,
  };
};
