import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User } from 'lucide-react';
import api from '../utils/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login/', {
        username,
        password
      });

      if (response.status === 200) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#020617', 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ 
        backgroundColor: '#0f172a', 
        padding: '50px', 
        borderRadius: '24px', 
        width: '100%', 
        maxWidth: '420px',
        border: '1px solid #1e293b'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            display: 'inline-flex', 
            padding: '16px', 
            backgroundColor: '#1e40af', 
            borderRadius: '16px',
            marginBottom: '20px'
          }}>
            <ShieldCheck size={42} color="white" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'white', margin: '0' }}>
            Hechicer<span style={{ color: '#3b82f6' }}>.ia</span>
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px' }}>Acceso Seguro</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '18px' }}>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input 
                type="text" 
                placeholder="Usuario" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '14px 14px 14px 42px', 
                  borderRadius: '10px', 
                  border: '1px solid #334155', 
                  backgroundColor: '#020617', 
                  color: 'white',
                  fontSize: '15px'
                }} 
                required 
              />
            </div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input 
                type="password" 
                placeholder="Contraseña" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '14px 14px 14px 42px', 
                  borderRadius: '10px', 
                  border: '1px solid #334155', 
                  backgroundColor: '#020617', 
                  color: 'white',
                  fontSize: '15px'
                }} 
                required 
              />
            </div>
          </div>

          {error && (
            <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '16px', fontSize: '14px' }}>
              {error}
            </p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '14px', 
              borderRadius: '10px', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              fontWeight: '600', 
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
