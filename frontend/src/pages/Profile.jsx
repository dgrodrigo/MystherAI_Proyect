import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Settings, Shield } from "lucide-react";
import logoImg from "../assets/logo.jpeg";

/**
 * Perfil del usuario — Página en construcción.
 * Muestra navbar con logo y contenido placeholder estilizado.
 */
const Profile = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Navbar superior */}
      <nav className="app-navbar">
        <div className="navbar-logo">
          <img src={logoImg} alt="MystherAI" className="navbar-logo-img" />
          <span className="navbar-logo-text">MystherAI</span>
        </div>
        <div className="navbar-spacer" />
        <button
          className="navbar-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={15} />
          Dashboard
        </button>
      </nav>

      {/* Contenido principal */}
      <div style={styles.container}>
        {/* Encabezado de sección */}
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <User size={32} color="var(--silver-mid)" />
          </div>
          <h1 style={styles.title}>Perfil de Usuario</h1>
          <p style={styles.subtitle}>Configuración y preferencias de la cuenta</p>
        </div>

        {/* Tarjeta "En construcción" */}
        <div className="glass-panel" style={styles.card}>
          <div style={styles.constructionIcon}>🐇</div>
          <h2 style={styles.cardTitle}>En Construcción</h2>
          <p style={styles.cardDesc}>
            Esta sección será utilizada para configuración avanzada de la cuenta,
            preferencias del sistema y gestión de credenciales.
          </p>

          {/* Items de próximas funcionalidades */}
          <div style={styles.featureList}>
            {[
              { icon: <User size={16} />,    label: 'Información personal' },
              { icon: <Settings size={16} />, label: 'Preferencias del sistema' },
              { icon: <Shield size={16} />,   label: 'Seguridad y acceso' },
            ].map((item, i) => (
              <div key={i} style={styles.featureItem} className="animate-in">
                <span style={styles.featureIcon}>{item.icon}</span>
                <span style={styles.featureLabel}>{item.label}</span>
                <span style={styles.featureBadge}>Próximamente</span>
              </div>
            ))}
          </div>

          <button
            className="btn-secondary"
            style={{ marginTop: '24px' }}
            onClick={() => navigate('/dashboard')}
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    paddingTop:  '84px',
    maxWidth:    '700px',
    margin:      '0 auto',
    padding:     '84px 24px 60px',
    minHeight:   '100vh',
  },
  header: {
    textAlign:    'center',
    marginBottom: '36px',
  },
  iconWrapper: {
    display:         'inline-flex',
    padding:         '18px',
    background:      'rgba(192,192,192,0.06)',
    borderRadius:    '18px',
    border:          '1px solid rgba(192,192,192,0.12)',
    marginBottom:    '20px',
  },
  title: {
    fontFamily:   "'Outfit', 'Inter', sans-serif",
    fontSize:     '2rem',
    fontWeight:   '700',
    color:        '#f0f0f0',
    margin:       '0 0 8px',
    letterSpacing:'0.5px',
  },
  subtitle: {
    color:        'rgba(255,255,255,0.35)',
    fontSize:     '0.9rem',
    margin:       0,
  },
  card: {
    padding:   '40px',
    textAlign: 'center',
  },
  constructionIcon: {
    fontSize:     '48px',
    marginBottom: '16px',
    display:      'block',
    animation:    'logoFloat 4s ease-in-out infinite',
  },
  cardTitle: {
    fontFamily:   "'Outfit', 'Inter', sans-serif",
    fontSize:     '1.4rem',
    fontWeight:   '700',
    color:        '#e0e0e0',
    margin:       '0 0 12px',
  },
  cardDesc: {
    color:       'rgba(255,255,255,0.45)',
    fontSize:    '0.9rem',
    lineHeight:  '1.6',
    maxWidth:    '440px',
    margin:      '0 auto 28px',
  },
  featureList: {
    display:       'flex',
    flexDirection: 'column',
    gap:           '12px',
    textAlign:     'left',
    maxWidth:      '360px',
    margin:        '0 auto',
  },
  featureItem: {
    display:       'flex',
    alignItems:    'center',
    gap:           '12px',
    padding:       '12px 16px',
    background:    'rgba(255,255,255,0.025)',
    border:        '1px solid rgba(255,255,255,0.06)',
    borderRadius:  '10px',
  },
  featureIcon: {
    color:      'var(--silver-dim)',
    flexShrink: 0,
  },
  featureLabel: {
    flex:       1,
    color:      'rgba(255,255,255,0.55)',
    fontSize:   '0.9rem',
  },
  featureBadge: {
    fontSize:     '10px',
    fontWeight:   '600',
    color:        'rgba(192,192,192,0.5)',
    background:   'rgba(192,192,192,0.06)',
    border:       '1px solid rgba(192,192,192,0.12)',
    padding:      '3px 8px',
    borderRadius: '20px',
    letterSpacing:'0.3px',
    textTransform:'uppercase',
  },
};

export default Profile;
