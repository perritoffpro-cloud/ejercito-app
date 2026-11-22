import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, User, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(usuario, password);
      if (result.success) {
        navigate('/admin', { replace: true });
      } else {
        setError(result.message || 'Credenciales incorrectas');
      }
    } catch {
      setError('Error en el servicio de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen-wrapper">
      {/* Fondo de ambientación táctica */}
      <div className="login-backdrop-overlay"></div>

      <div className="login-box-card">
        {/* Encabezado Institucional */}
        <div className="login-card-header">
          <div className="login-emblem-badge">
            <svg className="login-shield-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="#8B0000" stroke="#d4af37" />
              <path d="M12 6l-5 3v4c0 3.5 2.5 6.5 5 7.5 2.5-1 5-4 5-7.5V9l-5-3z" fill="#ffffff" />
            </svg>
          </div>
          <span className="login-category-tag">SISTEMA DE MANDO Y CONTROL OPERATIVO</span>
          <h1 className="login-main-title">EJÉRCITO DEL PERÚ</h1>
          <p className="login-sub-title">Autenticación de Oficiales y Personal de Comando</p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="login-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Formulario de Login */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field-group">
            <label className="login-label">Usuario Militar / DNI / Correo Institucional</label>
            <div className="login-input-wrap">
              <User className="login-field-icon" size={18} />
              <input
                type="text"
                className="login-input"
                placeholder="ejemplo: admin@ejercito.mil.pe"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="login-field-group">
            <label className="login-label">Contraseña de Mando</label>
            <div className="login-input-wrap">
              <Lock className="login-field-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="login-eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? (
              <span>Verificando credenciales...</span>
            ) : (
              <>
                <Lock size={18} />
                <span>Ingresar al Centro de Mando</span>
              </>
            )}
          </button>
        </form>

        {/* Pie de página con enlace de retorno */}
        <div className="login-card-footer">
          <Link to="/" className="login-back-link">
            <ArrowLeft size={16} />
            <span>Volver al Portal Público Institucional</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
