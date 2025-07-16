import React, { useState, useEffect } from 'react';
import api from '../../../infrastructure/api/api';
import { toast } from 'react-toastify';
import '../../../styles/CreateMatchForm.css';

const CreateMatchForm = ({ onClose, onMatchCreated, match }) => {
  const isEditing = !!match;
  const [formData, setFormData] = useState({
    court_id: '',
    category_id: '',
    start_time: '',
    end_time: '',
    players_needed: 1,
  });
  const [courts, setCourts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Cargar canchas y categorías para los selectores del formulario
    const fetchData = async () => {
      try {
        const courtsRes = await api.get('/api/courts/');
        const categoriesRes = await api.get('/api/matches/open-matches/categories/');
        setCourts(courtsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        toast.error("No se pudieron cargar los datos para el formulario.");
      }
    };
    fetchData();

    if (isEditing) {
      // Formatear las fechas para el input datetime-local
      const formatDateTimeLocal = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        // Ajustar a la zona horaria local para la visualización
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - (offset*60*1000));
        return adjustedDate.toISOString().slice(0, 16);
      };

      setFormData({
        court_id: match.court_id_read,
        category_id: match.category_id_read,
        start_time: formatDateTimeLocal(match.start_time),
        end_time: formatDateTimeLocal(match.end_time),
        players_needed: match.players_needed,
      });
    }
  }, [isEditing, match]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const apiCall = isEditing 
      ? api.put(`/api/matches/open-matches/${match.id}/`, formData)
      : api.post('/api/matches/open-matches/', formData);

    try {
      await apiCall;
      toast.success(isEditing ? "¡Partido actualizado!" : "¡Partido creado con éxito!");
      onMatchCreated();
      onClose();
    } catch (error) {
      console.error(isEditing ? "Error updating match:" : "Error creating match:", error);
      toast.error(error.response?.data?.detail || (isEditing ? "No se pudo actualizar el partido." : "No se pudo crear el partido."));
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{isEditing ? 'Editar Partido' : 'Crear Nuevo Partido'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cancha</label>
            <select name="court_id" value={formData.court_id} onChange={handleChange} required>
              <option value="">Selecciona una cancha</option>
              {courts && courts.map(court => <option key={court.id} value={court.id}>{court.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <select name="category_id" value={formData.category_id} onChange={handleChange} required>
              <option value="">Selecciona una categoría</option>
              {categories && categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Hora de Inicio</label>
            <input type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Hora de Fin</label>
            <input type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Jugadores Necesarios (además de ti)</label>
            <input type="number" name="players_needed" min="1" value={formData.players_needed} onChange={handleChange} required />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">{isEditing ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMatchForm;
