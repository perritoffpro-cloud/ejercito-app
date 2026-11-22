import React, { useState, useEffect } from 'react';
import { listarRutinas, registrarRutina, actualizarRutina, eliminarRutina } from '../../../services/rutina/RutinaMethods';
import ListadoRutina from './rutinaPage/ListadoRutina';
import RegistrarRutinaForm from './rutinaPage/RegistrarRutinaForm';
import EditarRutinaForm from './rutinaPage/EditarRutinaForm';
import EliminarRutinaModal from './rutinaPage/EliminarRutinaModal';
import Loading from '../../../components/Loading';
import Notificaciones from '../../../components/Notificaciones';

export default function RutinaPage() {
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [modalRegistrar, setModalRegistrar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);
  const [notif, setNotif] = useState(null);

  const cargarDatos = async () => {
    try {
      const data = await listarRutinas();
      setRutinas(data || []);
    } catch {
      setNotif({ type: 'error', message: 'Error al sincronizar rutinas' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleGuardar = async (nueva) => {
    await registrarRutina(nueva);
    setNotif({ type: 'success', message: 'Rutina programada exitosamente' });
    await cargarDatos();
  };

  const handleActualizar = async (id, datos) => {
    await actualizarRutina(id, datos);
    setNotif({ type: 'success', message: 'Rutina actualizada' });
    await cargarDatos();
  };

  const handleEliminar = async (id) => {
    await eliminarRutina(id);
    setNotif({ type: 'success', message: 'Rutina eliminada' });
    await cargarDatos();
  };

  if (loading) return <Loading message="Cargando cronograma de rutinas..." />;

  return (
    <div className="admin-page-container">
      <Notificaciones notification={notif} onClose={() => setNotif(null)} />

      <div className="admin-page-header">
        <div>
          <span className="page-category-badge">INSTRUCCIÓN & PREPARACIÓN TÁCTICA</span>
          <h1 className="admin-page-title">Cronograma de Entrenamiento</h1>
          <p className="admin-page-subtitle">
            Administración de programas físicos, tiro y ejercicios en campaña militar.
          </p>
        </div>
      </div>

      <ListadoRutina
        rutinas={rutinas}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAbrirRegistrar={() => setModalRegistrar(true)}
        onAbrirEditar={(r) => {
          setRutinaSeleccionada(r);
          setModalEditar(true);
        }}
        onAbrirEliminar={(r) => {
          setRutinaSeleccionada(r);
          setModalEliminar(true);
        }}
      />

      <RegistrarRutinaForm
        isOpen={modalRegistrar}
        onClose={() => setModalRegistrar(false)}
        onGuardar={handleGuardar}
      />

      <EditarRutinaForm
        isOpen={modalEditar}
        onClose={() => setModalEditar(false)}
        rutina={rutinaSeleccionada}
        onActualizar={handleActualizar}
      />

      <EliminarRutinaModal
        isOpen={modalEliminar}
        onClose={() => setModalEliminar(false)}
        rutina={rutinaSeleccionada}
        onConfirmar={handleEliminar}
      />
    </div>
  );
}
