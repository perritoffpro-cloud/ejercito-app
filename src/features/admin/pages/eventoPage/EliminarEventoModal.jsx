import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function EliminarEventoModal({ isOpen, onClose, evento, onConfirmar }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !evento) return null;

  const handleEliminar = async () => {
    setLoading(true);
    try {
      await onConfirmar(evento.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-confirm">
        <div className="confirm-icon-box">
          <AlertTriangle size={32} className="text-danger" />
        </div>
        <h3>¿Cancelar Evento Militar?</h3>
        <p>
          Estás por eliminar el evento <strong>{evento.titulo}</strong> del calendario institucional.
        </p>
        <div className="modal-footer-center">
          <button onClick={onClose} disabled={loading} className="btn-secondary-innovex">Regresar</button>
          <button onClick={handleEliminar} disabled={loading} className="btn-danger-innovex">
            <Trash2 size={16} />
            <span>{loading ? 'Eliminando...' : 'Sí, Cancelar Evento'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
