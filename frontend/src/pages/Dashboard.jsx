import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiKey } from '../context/ApiKeyContext';
import AppNavbar from '../components/AppNavbar';
import api from '../utils/api';
import logoImg from '../assets/logo.jpeg';

/* Gradio official logo (stacked blocks, orange-yellow gradient) */
const GradioLogo = () => (
  <svg viewBox="0 0 200 160" width="52" height="42" aria-label="Gradio" style={{ display: 'block', margin: '0 auto' }}>
    <defs>
      <linearGradient id="gr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF7C00" />
        <stop offset="100%" stopColor="#FFD21E" />
      </linearGradient>
    </defs>
    <rect x="5"  y="115" width="190" height="38" rx="13" fill="url(#gr-grad)" />
    <rect x="25" y="68"  width="150" height="36" rx="11" fill="url(#gr-grad)" opacity="0.88" />
    <rect x="52" y="24"  width="96"  height="34" rx="10" fill="url(#gr-grad)" opacity="0.76" />
  </svg>
);

const RING_R  = 54;
const RING_C  = 2 * Math.PI * RING_R;

const Dashboard = () => {
  const navigate    = useNavigate();
  const { clearApiKey } = useApiKey();

  const [censoCnt,    setCensoCnt]    = useState(0);
  const [registroCnt, setRegistroCnt] = useState(0);
  const [animPct,     setAnimPct]     = useState(0);
  const [animCount,   setAnimCount]   = useState(0);
  const [statsReady,  setStatsReady]  = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    Promise.all([
      api.get('/sheets/videos/?tipo=censo'),
      api.get('/sheets/videos/?tipo=registro'),
    ]).then(([cRes, rRes]) => {
      const c = cRes.data.length;
      const r = rRes.data.length;
      setCensoCnt(c);
      setRegistroCnt(r);
      setStatsReady(true);
      const targetPct = c > 0 ? (r / c) * 100 : 0;
      const dur = 2200;
      let t0 = null;
      const tick = (ts) => {
        if (!t0) t0 = ts;
        const p   = Math.min((ts - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        setAnimPct(targetPct * ease);
        setAnimCount(Math.round(r * ease));
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }).catch(() => setStatsReady(true));
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const handleLogout = () => {
    clearApiKey();
    navigate('/');
  };

  const topCards = [
    {
      id:    'card-censo',
      ruta:  '/censo',
      icon:  '📁',
      titulo: 'Censo',
      desc:  'Explora el dataset de videos originales con metadatos de cámara, mapas, género y especie.',
      tag:   'Dataset',
    },
    {
      id:    'card-registro',
      ruta:  '/registro',
      icon:  '⚡',
      titulo: 'Registro Grabaciones',
      desc:  'Control de versiones finales, prompts de IA y parámetros de estilizado por miembro.',
      tag:   'Pipeline',
    },
  ];

  const bottomCards = [
    {
      id:    'card-resumen',
      ruta:  '/resumen',
      icon:  '📊',
      titulo: 'Resumen',
      desc:  'Análisis del censo: distribución por especie, mapas y aspectos técnicos.',
      tag:   'Analytics',
    },
    {
      id:    'card-estadisticas',
      ruta:  '/estadisticas',
      icon:  '🎨',
      titulo: 'Estadísticas',
      desc:  'Balance del dataset Fase 2: Anime, Cartoon, Lego y Ciberpunk.',
      tag:   'Analytics',
    },
    {
      id:    'card-herramienta',
      ruta:  '/herramienta',
      icon:  <GradioLogo />,
      titulo: 'Servidor Gradio',
      desc:  'Motor WaveSpeed para texturización y edición de video con IA.',
      tag:   'Herramienta',
      accent: true,
    },
  ];

  const renderCard = (card, idx, delay = 0) => (
    <div
      key={card.id}
      id={card.id}
      className={`op-card glass-panel animate-in${card.accent ? ' op-card--gradio' : ''}`}
      onClick={() => navigate(card.ruta)}
      style={{ animationDelay: `${(idx + delay) * 0.07}s` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(card.ruta)}
    >
      <span className="card-tag">{card.tag}</span>
      <span className="card-icon">{card.icon}</span>
      <h2>{card.titulo}</h2>
      <p>{card.desc}</p>
      <span className="card-arrow">→</span>
    </div>
  );

  return (
    <>
      <AppNavbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
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

        {/* Top row — 2 large cards */}
        <div className="cards-wrapper cards-wrapper--top">
          {topCards.map((card, idx) => renderCard(card, idx))}
        </div>

        {/* Bottom row — 3 compact cards */}
        <div className="cards-wrapper cards-wrapper--bottom">
          {bottomCards.map((card, idx) => renderCard(card, idx, topCards.length))}
        </div>

        {/* ── Widget de progreso ── */}
        {statsReady && (
          <div className="glass-panel" style={{
            margin: '24px auto 0',
            maxWidth: '580px',
            padding: '28px 36px',
            borderTop: '2px solid rgba(0,242,255,0.25)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* fondo radial sutil */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% -20%, rgba(0,242,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <p style={{ margin: '0 0 22px', fontSize: '0.68rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              Progreso de Estilizado
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '36px', flexWrap: 'wrap' }}>

              {/* ── Anillo SVG ── */}
              <svg width="150" height="150" viewBox="0 0 150 150" style={{ flexShrink: 0, filter: 'drop-shadow(0 0 12px rgba(0,242,255,0.25))' }}>
                <defs>
                  <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#00f2ff" />
                    <stop offset="100%" stopColor="#bc13fe" />
                  </linearGradient>
                </defs>
                {/* pista de fondo */}
                <circle cx="75" cy="75" r={RING_R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="11" />
                {/* arco de progreso */}
                <circle
                  cx="75" cy="75" r={RING_R}
                  fill="none"
                  stroke="url(#rg)"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  strokeDashoffset={RING_C - (animPct / 100) * RING_C}
                  transform="rotate(-90 75 75)"
                />
                {/* porcentaje central */}
                <text x="75" y="69" textAnchor="middle" fill="white" fontSize="26" fontWeight="bold" fontFamily="monospace">
                  {Math.round(animPct)}%
                </text>
                <text x="75" y="86" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8.5" letterSpacing="2.5">
                  COMPLETADO
                </text>
              </svg>

              {/* ── Contadores ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'left' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '3px' }}>Videos estilizados</div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 'bold', color: '#00f2ff', fontFamily: 'monospace', lineHeight: 1, textShadow: '0 0 20px rgba(0,242,255,0.5)' }}>
                    {animCount}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '3px' }}>Total grabados</div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.22)', fontFamily: 'monospace', lineHeight: 1 }}>
                    {censoCnt}
                  </div>
                </div>

                {/* barra lineal mini */}
                <div style={{ width: '175px' }}>
                  <div style={{ height: '3px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${animPct}%`, height: '100%',
                      background: 'linear-gradient(to right, #00f2ff, #bc13fe)',
                      borderRadius: '2px',
                      boxShadow: '0 0 8px rgba(0,242,255,0.6)',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '0.62rem', color: 'var(--text-dim)' }}>
                    <span>0</span><span>{censoCnt} videos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <button id="logout-btn" className="logout-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
