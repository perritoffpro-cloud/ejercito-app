import React, { useState, useEffect } from 'react';
import { X, Upload, Save, AlertCircle } from 'lucide-react';
import { subirImagen } from '../../../../services/auth/authMethods';

export default function EditarInscripcionForm({ isOpen, onClose, inscripcion, onActualizar }) {
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (inscripcion) {
      setFormData({
        nombres: inscripcion.nombres || '',
        apellidos: inscripcion.apellidos || '',
        dni: inscripcion.dni || '',
        fecha_nacimiento: inscripcion.fecha_nacimiento || '',
        telefono: inscripcion.telefono || '',
        direccion: inscripcion.direccion || '',
        talla_cm: inscripcion.talla_cm || '',
        peso_kg: inscripcion.peso_kg || '',
        eval_medica: inscripcion.eval_medica || 'Pendiente',
        eval_fisica: inscripcion.eval_fisica || 0,
        estado: inscripcion.estado || 'Pendiente',
        imagen: inscripcion.imagen || '',
      });
      setPreview(inscripcion.imagen || null);
    }
  }, [inscripcion]);

  if (!isOpen || !inscripcion) return null;

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
    if (!/^\d{8}$/.test(String(formData.dni).trim())) {
      setError('El DNI debe tener 8 dígitos.');
      return;
    }
    setLoading(true);
    try {
      let finalImg = formData.imagen;
      if (formData.imagenTemp) {
        const res = await subirImagen(formData.imagenTemp);
        finalImg = res.url;
      }
      await onActualizar(inscripcion.id, { ...formData, imagen: finalImg });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Modificar Ficha de Inscripción</h3>
          <button onClick={onClose} className="modal-close-btn"><X size={18} /></button>
        </div>

        {error && <div className="modal-error-alert"><AlertCircle size={16} /><span>{error}</span></div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid-2">
            <div className="form-group">
              <label>Nombres *</label>
              <input type="text" name="nombres" required value={formData.nombres} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Apellidos *</label>
              <input type="text" name="apellidos" required value={formData.apellidos} onChange={handleChange} />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label>DNI *</label>
              <input type="text" name="dni" maxLength={8} required value={formData.dni} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Fecha de Nacimiento</label>
              <input type="date" name="fecha_nacimiento" required value={formData.fecha_nacimiento} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input type="tel" name="telefono" required value={formData.telefono} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input type="text" name="direccion" required value={formData.direccion} onChange={handleChange} />
          </div>

          <div className="form-grid-4">
            <div className="form-group">
              <label>Talla (cm)</label>
              <input type="number" name="talla_cm" value={formData.talla_cm} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Peso (kg)</label>
              <input type="number" step="0.1" name="peso_kg" value={formData.peso_kg} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Eval. Médica</label>
              <select name="eval_medica" value={formData.eval_medica} onChange={handleChange}>
                <option value="Apto">Apto</option>
                <option value="Apto con observaciones">Apto con observaciones</option>
                <option value="No Apto">No Apto</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>
            <div className="form-group">
              <label>Puntaje Físico</label>
              <input type="number" min="0" max="100" name="eval_fisica" value={formData.eval_fisica} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Estado de Resolución</label>
            <select name="estado" value={formData.estado} onChange={handleChange}>
              <option value="Pendiente">Pendiente</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Rechazado">Rechazado</option>
            </select>
          </div>

          <div className="form-group">
            <label>Fotografía</label>
            <div className="modal-upload-preview">
              {preview ? <img src={preview} alt="Vista previa" className="modal-avatar-preview" /> : <div className="modal-avatar-empty"><Upload size={20} /></div>}
              <label className="btn-secondary-innovex">
                Cambiar Fotografía
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary-innovex">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary-innovex">
              <Save size={16} />
              <span>{loading ? 'Guardando...' : 'Actualizar Ficha'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
