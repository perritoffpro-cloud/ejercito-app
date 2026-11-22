import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-react';

export default function Notificaciones({ notification, onClose }) {
  if (!notification || !notification.message) return null;

  const icons = {
    success: <CheckCircle2 size={20} className="notif-icon success" />,
    error: <XCircle size={20} className="notif-icon error" />,
    warning: <AlertCircle size={20} className="notif-icon warning" />,
    info: <Info size={20} className="notif-icon info" />,
  };

  const type = notification.type || 'info';

  return (
    <div className={`notification-toast ${type}`}>
      <div className="notif-left">
        {icons[type] || icons.info}
        <span className="notif-message">{notification.message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="notif-close-btn">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
