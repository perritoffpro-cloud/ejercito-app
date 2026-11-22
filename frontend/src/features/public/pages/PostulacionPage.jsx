import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/landing/Header';
import Footer from '../../../components/landing/Footer';
import { registrarInscripcion } from '../../../services/inscripcion/InscripcionMethods';
import { subirImagen } from '../../../services/auth/authMethods';
import { ShieldCheck, Upload, CheckCircle2, AlertCircle, ArrowLeft, Send } from 'lucide-react';

export default function PostulacionPage() {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    fecha_nacimiento: '',
    telefono: '',
    direccion: '',
    talla_cm: '',
    peso_kg: '',
    imagen: '',
    estado: 'Pendiente',
    eval_medica: 'Pendiente',
    eval_fisica: 0,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('La fotografía no debe superar los 5 MB');
      return;
    }

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

    // Validación DNI
    if (!/^\d{8}$/.test(formData.dni.trim())) {
      setError('El DNI debe contener exactamente 8 dígitos numéricos.');
      return;
    }

    setLoading(true);
    try {
      let imagenUrl = formData.imagen;
      if (formData.imagenTemp) {
        const uploadRes = await subirImagen(formData.imagenTemp);
        imagenUrl = uploadRes.url;
      }

      await registrarInscripcion({
        ...formData,
        imagen: imagenUrl || '/assets/postulante-lara.jpg',
      });

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al enviar la postulación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-layout">
      <Header />

      <main className="postulacion-main-wrapper">
        <div className="postulacion-box">
          <Link to="/" className="btn-back-link">
            <ArrowLeft size={16} />
            <span>Volver a la portada</span>
          </Link>

          {success ? (
            <div className="success-card-postulacion">
              <div className="success-icon-badge">
                <CheckCircle2 size={48} className="text-success" />
              </div>
              <h2>¡Postulación Registrada Exitosamente!</h2>
              <p>
                Tu registro con DNI <strong>{formData.dni}</strong> ha ingresado al sistema del Centro de Mando.
                Un oficial revisará tu ficha médica y física para emitir la resolución correspondiente.
              </p>
              <div className="success-actions">
                <Link to="/" className="btn-hero-primary">Volver al Inicio</Link>
                <Link to="/admin" className="btn-hero-secondary">Ir a Intranet</Link>
              </div>
            </div>
          ) : (
            <div className="postulacion-card">
              <div className="postulacion-header">
                <div className="postulacion-badge">
                  <ShieldCheck size={16} />
                  <span>SERVICIO MILITAR VOLUNTARIO 2026</span>
                </div>
                <h2>Ficha Única de Inscripción Militar</h2>
                <p>Ingresa tus datos con veracidad conforme a tu Documento Nacional de Identidad (DNI).</p>
              </div>

              {error && (
                <div className="error-alert-banner">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="postulacion-form">
                <div className="form-section-title">1. Datos Personales</div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Nombres Completos *</label>
                    <input
                      type="text"
                      name="nombres"
                      required
                      placeholder="Ej. Juan Alberto"
                      value={formData.nombres}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Apellidos Completos *</label>
                    <input
                      type="text"
                      name="apellidos"
                      required
                      placeholder="Ej. Quispe Huamán"
                      value={formData.apellidos}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label>DNI (8 dígitos) *</label>
                    <input
                      type="text"
                      name="dni"
                      maxLength={8}
                      required
                      placeholder="71234567"
                      value={formData.dni}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Fecha de Nacimiento *</label>
                    <input
                      type="date"
                      name="fecha_nacimiento"
                      required
                      value={formData.fecha_nacimiento}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono de Contacto *</label>
                    <input
                      type="tel"
                      name="telefono"
                      required
                      placeholder="987654321"
                      value={formData.telefono}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Dirección Domiciliaria Actual *</label>
                  <input
                    type="text"
                    name="direccion"
                    required
                    placeholder="Av. Universitaria 123, Distrito, Ciudad"
                    value={formData.direccion}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-section-title">2. Medidas Biométricas y Fotografía</div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Estatura (en centímetros) *</label>
                    <input
                      type="number"
                      name="talla_cm"
                      min={140}
                      max={220}
                      required
                      placeholder="175"
                      value={formData.talla_cm}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Peso Corporal (kg) *</label>
                    <input
                      type="number"
                      name="peso_kg"
                      min={40}
                      max={140}
                      step="0.1"
                      required
                      placeholder="70.5"
                      value={formData.peso_kg}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Fotografía de Frente (Fondo Blanco o Neutro)</label>
                  <div className="upload-photo-box">
                    {preview ? (
                      <div className="preview-container">
                        <img src={preview} alt="Vista previa" className="preview-img" />
                        <label className="btn-change-photo">
                          Cambiar Foto
                          <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                        </label>
                      </div>
                    ) : (
                      <label className="dropzone-box">
                        <Upload size={32} className="text-muted" />
                        <span>Haz clic para seleccionar tu foto (JPG o PNG)</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                      </label>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn-submit-postulacion" disabled={loading}>
                  <Send size={18} />
                  <span>{loading ? 'Procesando Envío...' : 'Enviar Mi Ficha de Postulación'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
