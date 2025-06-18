import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiCourtRepository } from '../../infrastructure/repositories/api-court-repository';
import useButtonDisable from '../hooks/useButtonDisable.js';

/**
 * Hook personalizado para la lógica de la página de modificación de canchas.
 * Encapsula la obtención de detalles de la cancha y la lógica para actualizarla.
 *
 * @returns {object} Un objeto que contiene el estado y las funciones para la modificación de canchas.
 * @property {object} formData - Datos del formulario de la cancha.
 * @property {Function} setFormData - Setter para los datos del formulario.
 * @property {boolean} loading - Indica si los datos están cargando.
 * @property {string|null} error - Mensaje de error si ocurre uno.
 * @property {string} actionStatus - Mensaje de estado de la última acción realizada.
 * @property {boolean} isSubmitting - Indica si el formulario se está enviando.
 * @property {Function} handleChange - Manejador de cambios en los campos del formulario.
 * @property {Function} handleRemoveImage - Manejador para eliminar una imagen.
 * @property {Function} handleSubmit - Manejador para el envío del formulario.
 */
export const useModifyCourtLogic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const courtRepository = useMemo(() => new ApiCourtRepository(), []);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    is_active: true,
    characteristics: '',
    images: [],
    imagesToDelete: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState('');

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        setLoading(true);
        const courtData = await courtRepository.getCourtById(id);
        setFormData({
          name: courtData.name || '',
          price: courtData.price || '',
          is_active: courtData.is_active !== undefined ? courtData.is_active : true,
          characteristics: courtData.characteristics || '',
          images: courtData.images || [],
          imagesToDelete: [],
        });
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
        setActionStatus(`Error al cargar la cancha: ${error.message}`);
      }
    };

    if (id) {
      fetchCourt();
    } else {
      setError(new Error("No se proporcionó ID de cancha."));
      setLoading(false);
    }
  }, [id, courtRepository]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'images') {
      setFormData(prevState => ({
        ...prevState,
        images: [...prevState.images, ...Array.from(files)],
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const imageToRemove = formData.images[indexToRemove];
    if (imageToRemove.id) {
      setFormData(prevState => ({
        ...prevState,
        images: prevState.images.filter((_, index) => index !== indexToRemove),
        imagesToDelete: [...prevState.imagesToDelete, imageToRemove.id],
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        images: prevState.images.filter((_, index) => index !== indexToRemove),
      }));
    }
  };

  const [isSubmitting, handleSubmit] = useButtonDisable(async (e) => {
    e.preventDefault();
    setActionStatus('Guardando cambios...');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('is_active', formData.is_active);
    if (formData.characteristics) data.append('characteristics', formData.characteristics);

    formData.images.forEach(image => {
      if (!image.id) {
        data.append('images', image);
      }
    });

    if (formData.imagesToDelete.length > 0) {
       data.append('images_to_delete', JSON.stringify(formData.imagesToDelete));
    }

    try {
      await courtRepository.updateCourt(id, data);
      setActionStatus('Cancha actualizada exitosamente.');
      setTimeout(() => {
        setActionStatus('');
        navigate('/dashboard/canchas/manage');
      }, 2000);
    } catch (error) {
      console.error(`Error al actualizar la cancha ${id}:`, error);
      setActionStatus(`Error al actualizar cancha: ${error.message}`);
      throw error;
    }
  });

  return {
    formData,
    setFormData,
    loading,
    error,
    actionStatus,
    isSubmitting,
    handleChange,
    handleRemoveImage,
    handleSubmit,
    navigate, // Se expone navigate para el botón de cancelar
  };
};
