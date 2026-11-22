import React from 'react';

export default function Loading({ message = 'Cargando información del Centro de Mando...' }) {
  return (
    <div className="loading-wrapper">
      <div className="loading-spinner-box">
        <div className="loading-military-spinner"></div>
        <p className="loading-text">{message}</p>
      </div>
    </div>
  );
}
