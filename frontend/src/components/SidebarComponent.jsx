import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Shield, Users, Dumbbell, Calendar, ClipboardCheck, LayoutDashboard, Globe, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SidebarComponent({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/admin', label: 'Centro de Mando', icon: LayoutDashboard, end: true },
    { to: '/admin/cadetes', label: 'Cadetes Militares', icon: Users },
    { to: '/admin/rutinas', label: 'Rutinas e Instrucción', icon: Dumbbell },
    { to: '/admin/eventos', label: 'Calendario Oficial', icon: Calendar },
    { to: '/admin/inscripciones', label: 'Admisión y Reclutas', icon: ClipboardCheck },
  ];

  return (
    <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
      {/* Encabezado del Sidebar */}
      <div className="sidebar-header">
        <div className="sidebar-logo-box">
          <svg className="shield-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="#990000" stroke="#d4af37" />
            <path d="M12 6l-5 3v4c0 3.5 2.5 6.5 5 7.5 2.5-1 5-4 5-7.5V9l-5-3z" fill="#ffffff" />
            <path d="M12 8v8M8 12h8" stroke="#990000" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="sidebar-title-group">
          <h2 className="sidebar-title">EJÉRCITO DEL PERÚ</h2>
          <span className="sidebar-subtitle">CENTRO DE MANDO · COMGE</span>
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="sidebar-nav">
        <span className="nav-section-label">MÓDULOS OPERATIVOS</span>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="link-icon" size={19} />
              <span className="link-text">{item.label}</span>
              <ChevronRight className="link-arrow" size={15} />
            </NavLink>
          );
        })}
      </nav>

      {/* Pie del Sidebar */}
      <div className="sidebar-footer">
        <Link to="/" className="portal-publico-btn" title="Ir al Portal Web Institucional">
          <Globe size={17} />
          <span>Portal Web Público</span>
        </Link>

        {user && (
          <div className="user-profile-box">
            <div className="user-avatar">
              {user.nombre.charAt(0)}
            </div>
            <div className="user-info">
              <span className="user-name">{user.nombre}</span>
              <span className="user-rank">{user.rango}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn" title="Cerrar sesión">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
