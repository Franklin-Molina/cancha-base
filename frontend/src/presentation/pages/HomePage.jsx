import React from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/common/Spinner.jsx';
import { useHomePageLogic } from '../hooks/useHomePageLogic.js'; // Importar el nuevo hook

import '../../styles/HomePage.css';
import '../../styles/dashboard.css';

import AuthPage from '../components/Auth/AuthPage.jsx'; // Importar AuthPage


function HomePage({ openAuthModal }) { // Recibir openAuthModal como prop
  // Usar el hook personalizado para la lógica de la página de inicio
  const { courts, loading, error } = useHomePageLogic();


  if (loading) {
    return <Spinner />; 
  }

  if (error) {
    return <div className="home-content" style={{ color: 'red' }}>Error al cargar canchas: {error.message}</div>;
  }

  return (
    <div className="home-content"> {/* Usar clase de estilo para el contenido */}
      <h1>Canchas Disponibles</h1>

      {courts.length === 0 ? (
      <p>No hay canchas disponibles en este momento.</p>
    ) : (
      <div className="courts-list"> {/* Contenedor para la lista de canchas */}
        {courts.map(court => (
          <div key={court.id} className="court-item" style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}> {/* Estilo básico de item */}
            <h2>{court.name}</h2>
            <p>Precio por hora: ${court.price}</p>
            {court.description && <p>{court.description}</p>}
            {court.characteristics && <p>{court.characteristics}</p>}

            {/* Mostrar imágenes si existen */}
            {court.images && court.images.length > 0 && (
              <div className="gallery" style={{ marginTop: '1rem' }}> {/* Usar clase de estilo de galería */}
                {court.images.map(image => (
                  <div key={image.id} className="image-container"> {/* Usar clase de estilo de imagen */}
                    {/* La URL de la imagen ya viene completa del backend */}
                    <img src={`${image.image}`} alt={`Imagen de ${court.name}`} className="image-preview" /> {/* Usar clase de estilo de previsualización */}
                     <div className="dark-overlay"></div> {/* Overlay */}
                  </div>
                ))}
              </div>
            )}

            {/* Botón para ver detalles */}
            <Link to={`/courts/${court.id}`} style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#4a89dc', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
              Ver más
            </Link>

            {/* TODO: Añadir botón para reservar */}
          </div>
        ))}
      </div>
    )}
  </div>
  );
}

export default HomePage;
