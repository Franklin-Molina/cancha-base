import { useEffect, useState, useRef } from 'react';
import { GetCourtsUseCase } from '../../application/use-cases/courts/get-courts.js';
import { ApiCourtRepository } from '../../infrastructure/repositories/api-court-repository.js';

/**
 * Hook personalizado para la lógica de la página de inicio (HomePage).
 * Encapsula la obtención de la lista de canchas y el manejo de su estado.
 *
 * @returns {object} Un objeto que contiene el estado y los datos de las canchas.
 * @property {Array} courts - Lista de canchas disponibles.
 * @property {boolean} loading - Indica si los datos están cargando.
 * @property {string|null} error - Mensaje de error si ocurre uno.
 */
export const useHomePageLogic = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const courtRepository = new ApiCourtRepository();
  const getCourtsUseCase = new GetCourtsUseCase(courtRepository);

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      const fetchCourts = async () => {
        try {
          setLoading(true);
          // Obtener solo las canchas que están activas
          const courtsList = await getCourtsUseCase.execute({ is_active: true });
          setCourts(courtsList);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
          console.error('Error al obtener canchas:', err);
        }
      };

      fetchCourts();
      effectRan.current = true;
    }
  }, [getCourtsUseCase]); // Dependencia del caso de uso

  return {
    courts,
    loading,
    error,
  };
};
