import React, { useState } from 'react';
import { X, Upload, Save, AlertCircle } from 'lucide-react';
import { subirImagen } from '../../../../services/auth/authMethods';

export default function RegistrarRutinaForm({ isOpen, onClose, onGuardar }) {
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'Entrenamiento físico',
    frecuencia: 'Diaria',
    dia_semana: 'Lunes a Viernes',
    hora: '06:00',
    duracion_min: 90,
    rango_id: 1,
    nivel: 'Todos los rangos',
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
          <h3>Programar Nueva Rutina de Instrucción</h3>
          <button onClick={onClose} className="modal-close-btn"><X size={18} /></button>
        </div>

        {error && <div className="modal-error-alert"><AlertCircle size={16} /><span>{error}</span></div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Título del Entrenamiento *</label>
            <input type="text" name="titulo" required placeholder="Ej. Trote de Resistencia y Pista de Combate" value={formData.titulo} onChange={handleChange} />
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label>Tipo de Instrucción</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange}>
                <option value="Entrenamiento físico">Entrenamiento físico</option>
                <option value="Instrucción de combate">Instrucción de combate</option>
                <option value="Supervivencia">Supervivencia</option>
                <option value="Tiro y Armamento">Tiro y Armamento</option>
              </select>
            </div>
            <div className="form-group">
              <label>Hora Militar</label>
              <input type="text" name="hora" placeholder="05:30" value={formData.hora} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Duración (minutos)</label>
              <input type="number" name="duracion_min" value={formData.duracion_min} onChange={handleChange} />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Día / Frecuencia</label>
              <input type="text" name="dia_semana" placeholder="Todos los días" value={formData.dia_semana} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Nivel de Exigencia</label>
              <input type="text" name="nivel" placeholder="Todos los rangos" value={formData.nivel} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Descripción / Objetivos</label>
            <textarea name="descripcion" rows={3} placeholder="Detalla el circuito, recorrido y equipo requerido..." value={formData.descripcion} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Fotografía o Esquema Táctico</label>
            <div className="modal-upload-preview">
              {preview ? (
                <img src={preview} alt="Vista previa" className="modal-avatar-preview" />
              ) : (
                <div className="modal-avatar-empty"><Upload size={20} /></div>
              )}
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
              <span>{loading ? 'Guardando...' : 'Programar Rutina'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
