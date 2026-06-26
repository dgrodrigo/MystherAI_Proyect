import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiKey } from '../context/ApiKeyContext';
import AppNavbar from '../components/AppNavbar';
import logoImg from '../assets/logo.jpeg';

/**
 * Dashboard — Centro de operaciones principal.
 * Incluye: navbar con logo, tarjetas animadas y botón de cierre de sesión.
 * Paleta: negro/plata inspirada en el logo de MystherAI.
 */
const Dashboard = () => {
  const navigate    = useNavigate();
  const { clearApiKey } = useApiKey();

  const handleLogout = () => {
    clearApiKey();
    navigate('/');
  };

  /* Definición de tarjetas de navegación */
  const cards = [
    {
      id:       'card-censo',
      ruta:     '/censo',
      icon:     '📁',
      titulo:   'Censo',
      desc:     'Explorar el dataset de videos originales, metadatos de cámara y especies.',
      accentColor: 'rgba(192,192,192,0.15)',
    },
    {
      id:       'card-registro',
      ruta:     '/registro',
      icon:     '⚡',
      titulo:   'Registro Mateo',
      desc:     'Control de versiones finales, prompts de IA y parámetros de estilizado.',
      accentColor: 'rgba(192,192,192,0.15)',
    },
    {
      id:       'card-herramienta',
      ruta:     '/herramienta',
      icon:     '🛠️',
      titulo:   'Herramienta IA',
      desc:     'Acceso directo al motor WaveSpeed para texturización y edición avanzada.',
      accentColor: 'rgba(192,192,192,0.15)',
    },
    {
      id:       'card-resumen',
      ruta:     '/resumen',
      icon:     '📊',
      titulo:   'Resumen',
      desc:     'Análisis del censo de videos, distribución por especie, mapas y aspectos técnicos.',
      accentColor: 'rgba(192,192,192,0.15)',
    },
    {
      id:       'card-estadisticas',
      ruta:     '/estadisticas',
      icon:     '🎨',
      titulo:   'Estadísticas',
      desc:     'Balance del dataset de Fase 2: Anime, Cartoon, Lego y Ciberpunk — análisis de estilizado.',
      accentColor: 'rgba(192,192,192,0.15)',
    },
  ];

  return (
    <>
      {/* Navbar global con botón de tema */}
      <AppNavbar />

      {/* Contenido principal */}
      <div className="dashboard-container">
        {/* Encabezado con logo grande */}
        <div className="dashboard-header">
          {/* Wrapper para la sombra animada de caminata del conejo */}
          <div className="dashboard-logo-wrapper">
            <img
              src={logoImg}
              alt="MystherAI Logo"
              className="dashboard-logo"
              title="¡Hover para ver caminar al conejo!"
            />
          </div>
          <h1 className="neon-title">Centro de Operaciones</h1>
          <p className="page-subtitle">Selecciona un módulo para continuar</p>
        </div>

        {/* Grid de tarjetas */}
        <div className="cards-wrapper">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              id={card.id}
              className="op-card glass-panel animate-in"
              onClick={() => navigate(card.ruta)}
              style={{ animationDelay: `${idx * 0.07}s` }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(card.ruta)}
            >
              <span className="card-icon">{card.icon}</span>
              <h2>{card.titulo}</h2>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Botón de cierre de sesión */}
        <div style={{ textAlign: 'center' }}>
          <button
            id="logout-btn"
            className="logout-btn"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
