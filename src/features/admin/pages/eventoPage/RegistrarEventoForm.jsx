import React, { useState } from 'react';
import { X, Upload, Save, AlertCircle } from 'lucide-react';
import { subirImagen } from '../../../../services/auth/authMethods';

export default function RegistrarEventoForm({ isOpen, onClose, onGuardar }) {
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'Ceremonia',
    fecha: new Date().toISOString().split('T')[0],
    hora: '08:00',
    lugar: 'Patio de Honor',
    descripcion: '',
    imagen: '',
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setFormData((prev) => ({ ...prev, imagenTemp: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImg = formData.imagen;
      if (formData.imagenTemp) {
        const res = await subirImagen(formData.imagenTemp);
        finalImg = res.url;
      }
      await onGuardar({ ...formData, imagen: finalImg });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Agendar Evento / Ceremonia Militar</h3>
          <button onClick={onClose} className="modal-close-btn"><X size={18} /></button>
        </div>

        {error && <div className="modal-error-alert"><AlertCircle size={16} /><span>{error}</span></div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nombre del Evento *</label>
            <input type="text" name="titulo" required placeholder="Ej. Ceremonia de Ascensos y Distinciones" value={formData.titulo} onChange={handleChange} />
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label>Tipo de Evento</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange}>
                <option value="Ceremonia">Ceremonia</option>
                <option value="Operativo">Operativo</option>
                <option value="Conmemoración">Conmemoración</option>
                <option value="Evaluación">Evaluación</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fecha</label>
              <input type="date" name="fecha" required value={formData.fecha} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Hora Militar</label>
              <input type="text" name="hora" placeholder="08:00" value={formData.hora} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Lugar / Emplazamiento</label>
            <input type="text" name="lugar" placeholder="Plaza de Armas / Patio Central" value={formData.lugar} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Descripción / Protocolo</label>
            <textarea name="descripcion" rows={3} placeholder="Detalla el protocolo militar y autoridades invitadas..." value={formData.descripcion} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Fotografía Oficial del Evento</label>
            <div className="modal-upload-preview">
              {preview ? <img src={preview} alt="Vista previa" className="modal-avatar-preview" /> : <div className="modal-avatar-empty"><Upload size={20} /></div>}
              <label className="btn-secondary-innovex">
                Seleccionar Imagen
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary-innovex">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary-innovex">
              <Save size={16} />
              <span>{loading ? 'Guardando...' : 'Agendar Evento'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
