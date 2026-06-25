import React, { useEffect } from 'react';
import logoImg from '../assets/logo.jpeg';

/**
 * SplashScreen: Pantalla de carga animada al iniciar la app.
 * Logo siempre visible: una sola animación continua sin cambios de fase
 * para evitar frames en blanco.
 */
const SplashScreen = ({ onDone }) => {
  useEffect(() => {
    // Notificar que terminó después de 2.6s
    const timer = setTimeout(() => { if (onDone) onDone(); }, 2600);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="splash-screen">
      {/* Orbs decorativos de fondo */}
      <div style={{
        position: 'absolute', width: '320px', height: '320px',
        borderRadius: '50%', top: '15%', left: '20%',
        background: 'radial-gradient(circle, rgba(192,192,192,0.04) 0%, transparent 70%)',
        filter: 'blur(40px)',
        animation: 'logoFloat 6s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: '200px', height: '200px',
        borderRadius: '50%', bottom: '20%', right: '15%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
        filter: 'blur(30px)',
        animation: 'logoFloat 8s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />

      {/* Logo — siempre visible, una sola animación combinada */}
      <img
        src={logoImg}
        alt="MystherAI Logo"
        className="splash-logo"
        style={{
          opacity: 1,
          /* splashLogoContinuous: entra con escala y luego flota sin interrupción */
          animation: 'splashLogoContinuous 3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        }}
      />

      {/* Título con entrada escalonada */}
      <div
        className="splash-title"
        style={{ animation: 'splashTextIn 0.5s ease 0.4s both' }}
      >
        MystherAI
      </div>

      {/* Subtítulo */}
      <div style={{
        color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '3px',
        textTransform: 'uppercase', marginTop: '-10px', marginBottom: '24px',
        animation: 'splashTextIn 0.5s ease 0.6s both',
      }}>
        Cargando sistema...
      </div>

      {/* Barra de progreso */}
      <div className="splash-bar-wrapper">
        <div
          className="splash-bar"
          style={{ animation: 'splashBarSlide 2.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both' }}
        />
      </div>

      {/* Indicador de tres puntos */}
      <div
        className="dots-loader"
        style={{ marginTop: '20px', animation: 'splashTextIn 0.5s ease 0.8s both' }}
      >
        <span /><span /><span />
      </div>
    </div>
  );
};

export default SplashScreen;


