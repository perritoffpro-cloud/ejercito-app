import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Send, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="public-header">
      <div className="header-limit">
        <Link to="/" className="public-brand">
          <div className="brand-shield-wrapper">
            <svg className="brand-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="#990000" stroke="#d4af37" />
              <path d="M12 6l-5 3v4c0 3.5 2.5 6.5 5 7.5 2.5-1 5-4 5-7.5V9l-5-3z" fill="#ffffff" />
            </svg>
          </div>
          <div className="brand-texts">
            <span className="brand-main">EJÉRCITO DEL PERÚ</span>
            <span className="brand-sub">PORTAL OFICIAL DE CONVOCATORIA Y SERVICIO MILITAR</span>
          </div>
        </Link>

        <nav className="public-nav">
          <a href="#convocatoria" className="nav-item">Convocatoria</a>
          <a href="#requisitos" className="nav-item">Requisitos</a>
          <a href="#beneficios" className="nav-item">Beneficios</a>
          <Link to="/postulacion" className="nav-btn-postular">
            <Send size={15} />
            <span>Postula Aquí</span>
          </Link>
          
          {/* Botón que abre el Login Militar para acceder al Centro de Mando */}
          <Link
            to={isAuthenticated ? "/admin" : "/login"}
            className="nav-btn-intranet"
            title={isAuthenticated ? `Sesión Activa: ${user?.rango}` : "Iniciar Sesión en el Centro de Mando"}
          >
            {isAuthenticated ? <UserCheck size={15} /> : <Lock size={15} />}
            <span>Centro de Mando</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
