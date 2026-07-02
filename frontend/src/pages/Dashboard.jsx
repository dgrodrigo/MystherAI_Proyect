import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiKey } from '../context/ApiKeyContext';
import AppNavbar from '../components/AppNavbar';
import logoImg from '../assets/logo.jpeg';

const NAV = [
  {
    id: 'censo',
    ruta: '/censo',
    step: '01',
    tag: 'DATOS RAW',
    titulo: 'Censo',
    desc: 'Grabaciones originales con metadatos de cámara, especie, mapa y duración.',
    side: 'in',
  },
  {
    id: 'registro',
    ruta: '/registro',
    step: '02',
    tag: 'ESTILIZADOS',
    titulo: 'Registro',
    desc: 'Versiones transformadas con prompt de IA, estilo y parámetros por miembro.',
    side: 'out',
  },
  {
    id: 'resumen',
    ruta: '/resumen',
    step: '03',
    tag: 'ANALYTICS · ENTRADA',
    titulo: 'Resumen',
    desc: 'Distribución del censo por especie, mapa, cámara y aspectos técnicos.',
    side: 'in',
  },
  {
    id: 'estadisticas',
    ruta: '/estadisticas',
    step: '04',
    tag: 'ANALYTICS · SALIDA',
    titulo: 'Estadísticas',
    desc: 'Balance de estilizados: Anime, Cartoon, Lego y Ciberpunk por fase.',
    side: 'out',
  },
];

const S = {
  page: {
    minHeight: '100vh',
    background: '#000',
    fontFamily: "'Inter', sans-serif",
  },
  wrap: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '80px 32px 48px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '56px',
  },
  logo: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  headerText: { display: 'flex', flexDirection: 'column', gap: '2px' },
  title: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '1px',
    margin: 0,
  },
  subtitle: {
    fontSize: '11px',
    color: '#333',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    margin: 0,
  },
  logoutBtn: {
    marginLeft: 'auto',
    background: 'transparent',
    border: '1px solid #1a1a1a',
    color: '#333',
    padding: '8px 18px',
    borderRadius: '6px',
    fontSize: '11px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'border-color 0.2s, color 0.2s',
  },
  sectionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '16px',
  },
  sectionText: {
    fontSize: '10px',
    color: '#2a2a2a',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  sectionLine: {
    flex: 1,
    height: '1px',
    background: '#111',
  },
  pipeRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 56px 1fr',
    gap: '0',
    marginBottom: '12px',
    alignItems: 'stretch',
  },
  card: {
    background: '#080808',
    border: '1px solid #141414',
    borderRadius: '10px',
    padding: '28px 28px 24px',
    cursor: 'pointer',
    transition: 'border-color 0.2s, background 0.2s',
    position: 'relative',
    overflow: 'hidden',
  },
  cardOut: {
    background: '#0a0a0a',
    borderColor: '#1c1c1c',
  },
  stepNum: {
    fontSize: '72px',
    fontWeight: '800',
    color: 'rgba(255,255,255,0.025)',
    lineHeight: '1',
    position: 'absolute',
    top: '10px',
    right: '18px',
    userSelect: 'none',
    fontVariantNumeric: 'tabular-nums',
  },
  tag: {
    display: 'inline-block',
    fontSize: '9px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    fontWeight: '700',
    color: '#2a2a2a',
    marginBottom: '14px',
  },
  tagOut: { color: '#3a3a3a' },
  cardTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#e8e8e8',
    margin: '0 0 8px',
    letterSpacing: '-0.3px',
  },
  cardDesc: {
    fontSize: '13px',
    color: '#444',
    lineHeight: '1.6',
    margin: '0 0 20px',
  },
  cardArrow: {
    fontSize: '13px',
    color: '#2a2a2a',
  },
  arrowCol: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowSvg: {
    color: '#1c1c1c',
  },
  toolCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    background: '#080808',
    border: '1px solid #1a1a1a',
    borderRadius: '10px',
    padding: '22px 28px',
    cursor: 'pointer',
    transition: 'border-color 0.2s, background 0.2s',
    marginTop: '12px',
  },
  toolNum: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#1c1c1c',
    letterSpacing: '2px',
    minWidth: '24px',
  },
  toolBody: { flex: 1 },
  toolTag: {
    fontSize: '9px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#2a2a2a',
    fontWeight: '700',
    display: 'block',
    marginBottom: '4px',
  },
  toolTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#e8e8e8',
    margin: '0 0 4px',
  },
  toolDesc: {
    fontSize: '12px',
    color: '#3a3a3a',
    margin: 0,
  },
  toolArrow: { fontSize: '16px', color: '#222' },
};

const PipeCard = ({ item, onClick }) => {
  const [hover, setHover] = React.useState(false);
  const isOut = item.side === 'out';
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...S.card,
        ...(isOut ? S.cardOut : {}),
        borderColor: hover ? (isOut ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.12)') : (isOut ? '#1c1c1c' : '#141414'),
        background: hover ? '#0f0f0f' : (isOut ? '#0a0a0a' : '#080808'),
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <span style={S.stepNum}>{item.step}</span>
      <span style={{ ...S.tag, ...(isOut ? S.tagOut : {}) }}>{item.tag}</span>
      <h2 style={S.cardTitle}>{item.titulo}</h2>
      <p style={S.cardDesc}>{item.desc}</p>
      <span style={{ ...S.cardArrow, color: hover ? '#555' : '#2a2a2a' }}>→</span>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { clearApiKey } = useApiKey();

  const handleLogout = () => { clearApiKey(); navigate('/'); };

  const pairs = [
    { label: 'DATOS', items: [NAV[0], NAV[1]] },
    { label: 'ANALYTICS', items: [NAV[2], NAV[3]] },
  ];

  return (
    <div style={S.page}>
      <AppNavbar />
      <div style={S.wrap}>

        {/* Header */}
        <header style={S.header}>
          <img src={logoImg} alt="MystherAI" style={S.logo} />
          <div style={S.headerText}>
            <h1 style={S.title}>MystherAI</h1>
            <p style={S.subtitle}>Pipeline de Producción · Fase 2</p>
          </div>
          <button
            style={S.logoutBtn}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#888'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.color = '#333'; }}
            onClick={handleLogout}
          >
            Salir
          </button>
        </header>

        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px 1fr', marginBottom: '10px' }}>
          <div style={{ fontSize: '9px', color: '#1e1e1e', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: '700', paddingLeft: '4px' }}>
            ENTRADA
          </div>
          <div />
          <div style={{ fontSize: '9px', color: '#1e1e1e', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: '700', paddingLeft: '4px' }}>
            SALIDA
          </div>
        </div>

        {/* Pipeline pairs */}
        {pairs.map(({ label, items }) => (
          <div key={label}>
            {/* Section divider */}
            <div style={S.sectionLabel}>
              <span style={S.sectionText}>{label}</span>
              <div style={S.sectionLine} />
            </div>

            <div style={S.pipeRow}>
              <PipeCard item={items[0]} onClick={() => navigate(items[0].ruta)} />

              {/* Arrow connector */}
              <div style={S.arrowCol}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={S.arrowSvg}>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="#1c1c1c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <PipeCard item={items[1]} onClick={() => navigate(items[1].ruta)} />
            </div>
          </div>
        ))}

        {/* Engine — full width */}
        <div style={{ marginTop: '8px' }}>
          <div style={S.sectionLabel}>
            <span style={S.sectionText}>MOTOR IA</span>
            <div style={S.sectionLine} />
          </div>

          {React.createElement(
            'div',
            {
              style: S.toolCard,
              onClick: () => navigate('/herramienta'),
              onMouseEnter: (e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.background = '#0f0f0f';
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.borderColor = '#1a1a1a';
                e.currentTarget.style.background = '#080808';
              },
              role: 'button',
              tabIndex: 0,
              onKeyDown: (e) => e.key === 'Enter' && navigate('/herramienta'),
            },
            React.createElement('span', { style: S.toolNum }, '05'),
            React.createElement('div', { style: S.toolBody },
              React.createElement('span', { style: S.toolTag }, 'MOTOR IA · WAVESPEED'),
              React.createElement('h2', { style: S.toolTitle }, 'Servidor Gradio'),
              React.createElement('p', { style: S.toolDesc }, 'Transformación V2V · Estilizado I2I · Edición de video con modelos WAN 2.7, LTX y Seedance.')
            ),
            React.createElement('span', { style: S.toolArrow }, '→')
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
