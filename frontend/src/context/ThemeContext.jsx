import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * ThemeContext — Gestiona el tema de la aplicación (dark / light).
 * El tema se persiste en localStorage bajo la clave 'mystherai_theme'.
 * Se aplica como atributo data-theme en el elemento <html> para que
 * las variables CSS respondan al cambio automáticamente.
 */
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Leer el tema guardado o usar 'dark' por defecto
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('mystherai_theme') || 'dark';
  });

  // Aplicar el tema al elemento raíz del DOM y guardar en localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mystherai_theme', theme);
  }, [theme]);

  // Alternar entre dark y light
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook de conveniencia para consumir el contexto
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  return ctx;
};
