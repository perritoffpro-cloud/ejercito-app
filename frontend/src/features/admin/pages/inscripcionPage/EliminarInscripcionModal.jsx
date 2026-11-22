import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function EliminarInscripcionModal({ isOpen, onClose, inscripcion, onConfirmar }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !inscripcion) return null;

  const handleEliminar = async () => {
    setLoading(true);
    try {
      await onConfirmar(inscripcion.id);
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
        <h3>¿Eliminar Expediente de Postulación?</h3>
        <p>
          Estás a punto de anular la inscripción de <strong>{inscripcion.nombres} {inscripcion.apellidos}</strong> (DNI: {inscripcion.dni}).
        </p>
        <div className="modal-footer-center">
          <button onClick={onClose} disabled={loading} className="btn-secondary-innovex">Cancelar</button>
          <button onClick={handleEliminar} disabled={loading} className="btn-danger-innovex">
            <Trash2 size={16} />
            <span>{loading ? 'Eliminando...' : 'Sí, Anular Inscripción'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
