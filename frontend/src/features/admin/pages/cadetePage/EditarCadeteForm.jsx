import React, { useState, useEffect } from 'react';
import { X, Upload, AlertCircle, Save } from 'lucide-react';
import { subirImagen } from '../../../../services/auth/authMethods';

export default function EditarCadeteForm({ isOpen, onClose, cadete, onActualizar, rangos }) {
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cadete) {
      setFormData({
        nombres: cadete.nombres || '',
        apellidos: cadete.apellidos || '',
        dni: cadete.dni || '',
        rango_id: cadete.rango_id || 1,
        nivel: cadete.nivel || 'Nuevo',
        fisico: cadete.fisico || 0,
        tactico: cadete.tactico || 0,
        disciplina: cadete.disciplina || 0,
        unidad: cadete.unidad || '',
        fecha_ingreso: cadete.fecha_ingreso || '',
        imagen: cadete.imagen || '',
      });
      setPreview(cadete.imagen || null);
    }
  }, [cadete]);

  if (!isOpen || !cadete) return null;

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
    setError(null);

    if (!/^\d{8}$/.test(String(formData.dni).trim())) {
      setError('El DNI debe tener 8 dígitos.');
      return;
    }

    setLoading(true);
    try {
      let finalImg = formData.imagen;
      if (formData.imagenTemp) {
        const uploadRes = await subirImagen(formData.imagenTemp);
        finalImg = uploadRes.url;
      }
      await onActualizar(cadete.id, { ...formData, imagen: finalImg });
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
          <h3>Modificar Ficha de Cadete</h3>
          <button onClick={onClose} className="modal-close-btn"><X size={18} /></button>
        </div>

        {error && (
          <div className="modal-error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

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
              <label>Rango Militar</label>
              <select name="rango_id" value={formData.rango_id} onChange={handleChange}>
                {rangos.map((r) => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Fecha de Ingreso</label>
              <input type="date" name="fecha_ingreso" value={formData.fecha_ingreso} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Unidad Militar</label>
            <input type="text" name="unidad" value={formData.unidad} onChange={handleChange} />
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label>Físico (0-100)</label>
              <input type="number" min="0" max="100" name="fisico" value={formData.fisico} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Táctico (0-100)</label>
              <input type="number" min="0" max="100" name="tactico" value={formData.tactico} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Disciplina (0-100)</label>
              <input type="number" min="0" max="100" name="disciplina" value={formData.disciplina} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Fotografía Militar</label>
            <div className="modal-upload-preview">
              {preview ? (
                <img src={preview} alt="Vista previa" className="modal-avatar-preview" />
              ) : (
                <div className="modal-avatar-empty"><Upload size={20} /></div>
              )}
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
              <span>{loading ? 'Guardando...' : 'Actualizar Cadete'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
