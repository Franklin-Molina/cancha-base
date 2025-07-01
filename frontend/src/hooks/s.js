import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UseCaseContext } from '../context/UseCaseContext'; // Asumo que se usa un contexto para los casos de uso

export function useModifyCourtLogic() {
  const { courtUseCases } = useContext(UseCaseContext); // Asumo un contexto de casos de uso
  const { id } = useParams(); // Para obtener el ID de la cancha de la URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    characteristics: '',
    images: [], // Aquí se guardan las imágenes (File objects o {id, image} objects)
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // NUEVO ESTADO: para guardar los IDs de las imágenes a eliminar
  const [imagesToDelete, setImagesToDelete] = useState([]); 

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        const court = await courtUseCases.getCourtById.execute(id); // Asumo un caso de uso para obtener la cancha
        if (court) {
          setFormData({
            name: court.name,
            price: court.price,
            description: court.description || '',
            characteristics: court.characteristics || '',
            images: court.images || [], // Cargar imágenes existentes
          });
        } else {
          setError(new Error('Cancha no encontrada.'));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourt();
  }, [id, courtUseCases]);

  const handleChange = (e) => {
    if (e.target.name === 'images') {
      // Manejar la adición de nuevas imágenes
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...Array.from(e.target.files)],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => {
      const newImages = prev.images.filter((image, index) => {
        if (index === indexToRemove) {
          // Si la imagen tiene un ID, significa que ya existe en el backend y debe ser eliminada
          if (image.id) {
            setImagesToDelete(prevDelete => [...prevDelete, image.id]);
          }
          return false; // Eliminar esta imagen del array
        }
        return true;
      });
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setActionStatus(null);
    setError(null);

    try {
      const dataToUpdate = new FormData();
      dataToUpdate.append('name', formData.name);
      dataToUpdate.append('price', formData.price);
      dataToUpdate.append('description', formData.description);
      dataToUpdate.append('characteristics', formData.characteristics);

      // Añadir nuevas imágenes (objetos File)
      formData.images.forEach(image => {
        if (image instanceof File) {
          dataToUpdate.append('images', image);
        }
      });

      // NUEVO: Añadir los IDs de las imágenes a eliminar
      if (imagesToDelete.length > 0) {
        // Enviar como un array de IDs. El backend necesitará procesar esto.
        // Para FormData, lo más simple es un string JSON.
        dataToUpdate.append('images_to_delete', JSON.stringify(imagesToDelete));
      }

      await courtUseCases.updateCourt.execute(id, dataToUpdate); // Asumo un caso de uso para actualizar la cancha
      setActionStatus('Cancha actualizada exitosamente.');
      navigate('/dashboard/canchas/manage'); // Redirigir después de guardar
    } catch (err) {
      console.error('Error al actualizar la cancha:', err);
      setError(err);
      setActionStatus(`Error: ${err.message || 'No se pudo actualizar la cancha.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    loading,
    error,
    actionStatus,
    isSubmitting,
    handleChange,
    handleRemoveImage,
    handleSubmit,
    navigate,
  };
}