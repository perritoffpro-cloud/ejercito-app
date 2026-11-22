import React, { useState, useEffect } from 'react';
import {
  listarInscripciones,
  registrarInscripcion,
  actualizarInscripcion,
  eliminarInscripcion,
  aprobarInscripcion,
  rechazarInscripcion,
} from '../../../services/inscripcion/InscripcionMethods';
import ListadoInscripcion from './inscripcionPage/ListadoInscripcion';
import RegistrarInscripcionForm from './inscripcionPage/RegistrarInscripcionForm';
import EditarInscripcionForm from './inscripcionPage/EditarInscripcionForm';
import EliminarInscripcionModal from './inscripcionPage/EliminarInscripcionModal';
import Loading from '../../../components/Loading';
import Notificaciones from '../../../components/Notificaciones';

export default function InscripcionPage() {
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');

  const [modalRegistrar, setModalRegistrar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState(null);
  const [notif, setNotif] = useState(null);

  const cargarDatos = async () => {
    try {
      const data = await listarInscripciones();
      setInscripciones(data || []);
    } catch {
      setNotif({ type: 'error', message: 'Error al sincronizar admisiones' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleGuardar = async (nuevo) => {
    await registrarInscripcion(nuevo);
    setNotif({ type: 'success', message: 'Ficha de inscripción registrada' });
    await cargarDatos();
  };

  const handleActualizar = async (id, datos) => {
    await actualizarInscripcion(id, datos);
    setNotif({ type: 'success', message: 'Ficha de inscripción actualizada' });
    await cargarDatos();
  };

  const handleEliminar = async (id) => {
    await eliminarInscripcion(id);
    setNotif({ type: 'success', message: 'Inscripción eliminada' });
    await cargarDatos();
  };

  const handleAprobar = async (item) => {
    try {
      setLoading(true);
      const res = await aprobarInscripcion(item.id);
      setNotif({
        type: 'success',
        message: `¡Postulante Aprobado! Incorporado al batallón con ID de Cadete #${res.cadete_id} (Transacción ACID completada)`,
      });
      await cargarDatos();
    } catch (err) {
      setNotif({
        type: 'error',
        message: err.response?.data?.error || err.message || 'Error al aprobar postulante',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRechazar = async (item) => {
    try {
      await rechazarInscripcion(item.id);
      setNotif({ type: 'warning', message: 'Postulación rechazada' });
      await cargarDatos();
    } catch (err) {
      setNotif({ type: 'error', message: 'Error al rechazar' });
    }
  };

  if (loading) return <Loading message="Cargando expedientes de admisión..." />;

  return (
    <div className="admin-page-container">
      <Notificaciones notification={notif} onClose={() => setNotif(null)} />

      <div className="admin-page-header">
        <div>
          <span className="page-category-badge">ADMISIONES & RECLUTAMIENTO MILITAR</span>
          <h1 className="admin-page-title">Postulantes al Servicio Militar</h1>
          <p className="admin-page-subtitle">
            Evaluación médica y física con aprobación atómica a cadetes activos.
          </p>
        </div>
      </div>

      <ListadoInscripcion
        inscripciones={inscripciones}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        estadoFilter={estadoFilter}
        setEstadoFilter={setEstadoFilter}
        onAbrirRegistrar={() => setModalRegistrar(true)}
        onAbrirEditar={(i) => {
          setInscripcionSeleccionada(i);
          setModalEditar(true);
        }}
        onAbrirEliminar={(i) => {
          setInscripcionSeleccionada(i);
          setModalEliminar(true);
        }}
        onAprobarPostulante={handleAprobar}
        onRechazarPostulante={handleRechazar}
      />

      <RegistrarInscripcionForm
        isOpen={modalRegistrar}
        onClose={() => setModalRegistrar(false)}
        onGuardar={handleGuardar}
      />

      <EditarInscripcionForm
        isOpen={modalEditar}
        onClose={() => setModalEditar(false)}
        inscripcion={inscripcionSeleccionada}
        onActualizar={handleActualizar}
      />

      <EliminarInscripcionModal
        isOpen={modalEliminar}
        onClose={() => setModalEliminar(false)}
        inscripcion={inscripcionSeleccionada}
        onConfirmar={handleEliminar}
      />
    </div>
  );
}
