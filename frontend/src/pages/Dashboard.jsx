import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiKey } from '../context/ApiKeyContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { clearApiKey } = useApiKey();

  return (
    <div className="dashboard-container">
      <h1 className="neon-title">Centro de Operaciones</h1>
      
      <div className="cards-wrapper">
        <div className="op-card glass-panel" onClick={() => navigate('/censo')}>
          <div className="card-icon">📁</div>
          <h2>Censo</h2>
          <p>Explorar el dataset de videos originales, metadatos de cámara y especies.</p>
        </div>

        <div className="op-card glass-panel" onClick={() => navigate('/registro')}>
          <div className="card-icon">⚡</div>
          <h2>Registro Mateo</h2>
          <p>Control de versiones finales, prompts de IA y parámetros de estilizado.</p>
        </div>

        <div className="op-card glass-panel" onClick={() => navigate('/herramienta')}>
          <div className="card-icon">🛠️</div>
          <h2>Herramienta IA</h2>
          <p>Acceso directo al motor WaveSpeed para texturización y edición avanzada.</p>
        </div>
      </div>

      <div style={{textAlign: 'center'}}>
        <button className="logout-btn" onClick={() => { clearApiKey(); navigate('/'); }}>
          CERRAR SESIÓN
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
