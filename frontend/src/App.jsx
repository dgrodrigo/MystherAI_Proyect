import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Herramienta from './pages/Herramienta';
import Profile from './pages/Profile';
import Censo from './pages/Censo';         // <-- Asegurando esta importación
import Registro from './pages/Registro';   // <-- Asegurando esta importación
import Resumen from './pages/Resumen';     // <-- Añadiendo Resumen
import { ApiKeyProvider } from './context/ApiKeyContext';

function App() {
  return (
    <ApiKeyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/herramienta" element={<Herramienta />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/censo" element={<Censo />} />         {/* <-- Asegurando esta ruta */}
          <Route path="/registro" element={<Registro />} />   {/* <-- Asegurando esta ruta */}
          <Route path="/resumen" element={<Resumen />} />     {/* <-- Nueva ruta para el Resumen */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ApiKeyProvider>
  );
}

export default App;
