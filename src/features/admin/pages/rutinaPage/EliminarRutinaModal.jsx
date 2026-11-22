import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function EliminarRutinaModal({ isOpen, onClose, rutina, onConfirmar }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !rutina) return null;

  const handleEliminar = async () => {
    setLoading(true);
    try {
      await onConfirmar(rutina.id);
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
        <h3>¿Eliminar Rutina de Entrenamiento?</h3>
        <p>
          Estás por remover la rutina <strong>{rutina.titulo}</strong>. Se eliminarán los horarios asociados.
        </p>
        <div className="modal-footer-center">
          <button onClick={onClose} disabled={loading} className="btn-secondary-innovex">Cancelar</button>
          <button onClick={handleEliminar} disabled={loading} className="btn-danger-innovex">
            <Trash2 size={16} />
            <span>{loading ? 'Eliminando...' : 'Sí, Eliminar Rutina'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
