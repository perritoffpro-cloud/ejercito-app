import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function EliminarCadeteModal({ isOpen, onClose, cadete, onConfirmar }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !cadete) return null;

  const handleEliminar = async () => {
    setLoading(true);
    try {
      await onConfirmar(cadete.id);
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
        <h3>¿Confirmar Baja de Cadete?</h3>
        <p>
          Estás a punto de dar de baja al cadete <strong>{cadete.nombres} {cadete.apellidos}</strong> (DNI: {cadete.dni}). 
          Esta acción removerá su expediente de la base de datos y limpiará sus archivos físicos.
        </p>
        <div className="modal-footer-center">
          <button onClick={onClose} disabled={loading} className="btn-secondary-innovex">Cancelar</button>
          <button onClick={handleEliminar} disabled={loading} className="btn-danger-innovex">
            <Trash2 size={16} />
            <span>{loading ? 'Eliminando...' : 'Sí, Dar de Baja'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
