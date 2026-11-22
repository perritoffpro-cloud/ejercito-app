import React from 'react';
import { Menu, Bell, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TopNavbar({ onToggleSidebar }) {
  const { user } = useAuth();
  const fechaHoy = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="topnavbar">
      <div className="topnavbar-left">
        <button className="mobile-toggle-btn" onClick={onToggleSidebar} title="Abrir Menú">
          <Menu size={22} />
        </button>
        <div className="topnavbar-status">
          <span className="status-indicator"></span>
          <span className="status-text">SISTEMA OPERATIVO Y DISPONIBLE</span>
          <span className="separator">|</span>
          <span className="current-date">{fechaHoy}</span>
        </div>
      </div>

      <div className="topnavbar-right">
        <div className="notification-bell" title="Alertas de Servicio">
          <Bell size={19} />
          <span className="bell-badge">3</span>
        </div>

        <div className="topnavbar-user-chip">
          <div className="chip-shield">
            <Shield size={14} />
          </div>
          <div className="chip-details">
            <span className="chip-title">{user?.rango || 'Oficial'}</span>
            <span className="chip-subtitle">{user?.unidad || 'Comando General'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
