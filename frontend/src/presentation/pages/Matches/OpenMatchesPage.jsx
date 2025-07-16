import React, { useState, useEffect } from 'react';
import api from '../../../infrastructure/api/api';
import '../../../styles/OpenMatchesPage.css';
import { toast } from 'react-toastify';
import CreateMatchForm from '../../components/Matches/CreateMatchForm';
import { useAuth } from '../../context/AuthContext'; // Importar useAuth

const groupMatchesByCategory = (matches) => {
  const grouped = { Mixto: [], Hombres: [], Mujeres: [] };
  matches.forEach(match => {
    // Asegurarse de que la categoría existe en el objeto `grouped`
    if (grouped.hasOwnProperty(match.category)) {
      grouped[match.category].push(match);
    }
  });
  return grouped;
};

const MatchCard = ({ match, onJoin, onCancel, onRemove, onEdit, currentUser }) => {
  const [showParticipants, setShowParticipants] = useState(false);
  const isCreator = currentUser?.id === match.creator.id;
  const isFull = match.participants.length >= match.players_needed + 1;

  return (
    <div className={`match-card ${isFull ? 'full' : ''} ${match.status === 'CANCELLED' ? 'cancelled' : ''}`}>
      <h4>{match.court}</h4>
      <p><strong>Inicio:</strong> {new Date(match.start_time).toLocaleString()}</p>
      <p><strong>Fin:</strong> {new Date(match.end_time).toLocaleString()}</p>
      <p><strong>Jugadores:</strong> {match.participants.length} / {match.players_needed + 1}</p>
      <p><strong>Creador:</strong> {match.creator.username}</p>
      <p><strong>Estado:</strong> {isFull ? 'Cerrado' : 'Abierto'}</p>
      
      <div className="participants-section">
        <button className="toggle-participants" onClick={() => setShowParticipants(!showParticipants)}>
          {showParticipants ? 'Ocultar' : 'Ver'} Participantes ({match.participants.length})
        </button>
        {showParticipants && (
          <ul className="participants-list">
            {match.participants.map(p => (
              <li key={p.user.id}>
                {p.user.username}
                {isCreator && p.user.id !== currentUser.id && (
                  <button className="remove-btn" onClick={() => onRemove(match.id, p.user.id)}>X</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {!isCreator && (
        <button className="join-btn" onClick={() => onJoin(match.id)} disabled={isFull || match.status === 'CANCELLED'}>
          {isFull ? 'Completo' : match.status === 'CANCELLED' ? 'Cancelado' : 'Unirse'}
        </button>
      )}

      {isCreator && !isFull && match.status !== 'CANCELLED' && (
        <>
          <button className="edit-btn" onClick={() => onEdit(match)}>Editar</button>
          <button className="cancel-btn" onClick={() => onCancel(match.id)}>Cancelar</button>
        </>
      )}
    </div>
  );
};

const OpenMatchesPage = () => {
  const { user } = useAuth(); // Obtener usuario logueado
  const [matches, setMatches] = useState({ Mixto: [], Hombres: [], Mujeres: [] });
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);

  const handleEditMatch = (match) => {
    setEditingMatch(match);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMatch(null);
  };

  const fetchOpenMatches = async () => {
    try {
      const response = await api.get('/api/matches/open-matches/');
      setMatches(groupMatchesByCategory(response.data));
    } catch (error) {
      console.error("Error fetching open matches:", error);
      toast.error("No se pudieron cargar los partidos abiertos.");
    }
  };

  const fetchUpcomingMatches = async () => {
    try {
      const response = await api.get('/api/matches/open-matches/my-upcoming-matches/');
      setUpcomingMatches(response.data);
    } catch (error) {
      console.error("Error fetching upcoming matches:", error);
      toast.error("No se pudieron cargar tus próximos partidos.");
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchOpenMatches(), fetchUpcomingMatches()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleJoinMatch = async (matchId) => {
    try {
      await api.post(`/api/matches/open-matches/${matchId}/join/`);
      toast.success("¡Te has unido al partido!");
      fetchAllData(); // Recargar ambos listados
    } catch (error) {
      console.error("Error joining match:", error);
      toast.error(error.response?.data?.detail || "No se pudo unir al partido.");
    }
  };

  const handleCancelMatch = async (matchId) => {
    if (window.confirm("¿Estás seguro de que quieres cancelar este partido?")) {
      try {
        await api.post(`/api/matches/open-matches/${matchId}/cancel/`);
        toast.success("Partido cancelado.");
        fetchAllData();
      } catch (error) {
        console.error("Error cancelling match:", error);
        toast.error("No se pudo cancelar el partido.");
      }
    }
  };

  const handleRemoveParticipant = async (matchId, userIdToRemove) => {
    if (window.confirm("¿Estás seguro de que quieres expulsar a este jugador?")) {
      try {
        await api.post(`/api/matches/open-matches/${matchId}/remove_participant/`, { user_id: userIdToRemove });
        toast.success("Jugador expulsado.");
        fetchAllData();
      } catch (error) {
        console.error("Error removing participant:", error);
        toast.error("No se pudo expulsar al jugador.");
      }
    }
  };

  if (loading) {
    return <div className="spinner-container">Cargando partidos...</div>; // Usar un spinner sería mejor
  }

  return (
    <div className="open-matches-container">
      {isModalOpen && (
        <CreateMatchForm 
          onClose={handleCloseModal} 
          onMatchCreated={fetchAllData}
          match={editingMatch}
        />
      )}
      
      {upcomingMatches.length > 0 && (
        <div className="upcoming-matches-section">
          <h2>Mis Próximos Partidos</h2>
          <div className="match-list">
            {upcomingMatches.map(match => (
              <MatchCard 
                key={match.id} 
                match={match} 
                onJoin={handleJoinMatch}
                onCancel={handleCancelMatch}
                onRemove={handleRemoveParticipant}
                onEdit={handleEditMatch}
                currentUser={user}
              />
            ))}
          </div>
        </div>
      )}

      <header className="matches-header">
        <h1>Encuentra tu Partido</h1>
        <button className="create-match-btn" onClick={() => setIsModalOpen(true)}>Crear Partido</button>
      </header>
      <div className="matches-grid">
        {Object.entries(matches).map(([category, matchList]) => (
          <div key={category} className="category-column">
            <h2>{category}</h2>
            <div className="match-list">
              {matchList.length > 0 ? (
                matchList.map(match => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    onJoin={handleJoinMatch}
                    onCancel={handleCancelMatch}
                    onRemove={handleRemoveParticipant}
                    onEdit={handleEditMatch}
                    currentUser={user}
                  />
                ))
              ) : (
                <p>No hay partidos abiertos en esta categoría.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpenMatchesPage;
