import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Herramienta from "./pages/Herramienta";
import Profile from "./pages/Profile";
import { ApiKeyProvider } from "./context/ApiKeyContext";

function App() {
  return (
    <ApiKeyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/herramienta" element={<Herramienta />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ApiKeyProvider>
  );
}

export default App;
