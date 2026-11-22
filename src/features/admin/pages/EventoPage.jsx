import React, { useState, useEffect } from 'react';
import { listarEventos, registrarEvento, actualizarEvento, eliminarEvento } from '../../../services/evento/EventoMethods';
import ListadoEvento from './eventoPage/ListadoEvento';
import RegistrarEventoForm from './eventoPage/RegistrarEventoForm';
import EditarEventoForm from './eventoPage/EditarEventoForm';
import EliminarEventoModal from './eventoPage/EliminarEventoModal';
import Loading from '../../../components/Loading';
import Notificaciones from '../../../components/Notificaciones';

export default function EventoPage() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [modalRegistrar, setModalRegistrar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [notif, setNotif] = useState(null);

  const cargarDatos = async () => {
    try {
      const data = await listarEventos();
      setEventos(data || []);
    } catch {
      setNotif({ type: 'error', message: 'Error al sincronizar eventos' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleGuardar = async (nuevo) => {
    await registrarEvento(nuevo);
    setNotif({ type: 'success', message: 'Evento militar agendado' });
    await cargarDatos();
  };

  const handleActualizar = async (id, datos) => {
    await actualizarEvento(id, datos);
    setNotif({ type: 'success', message: 'Evento actualizado' });
    await cargarDatos();
  };

  const handleEliminar = async (id) => {
    await eliminarEvento(id);
    setNotif({ type: 'success', message: 'Evento cancelado y eliminado' });
    await cargarDatos();
  };

  if (loading) return <Loading message="Cargando calendario oficial..." />;

  return (
    <div className="admin-page-container">
      <Notificaciones notification={notif} onClose={() => setNotif(null)} />

      <div className="admin-page-header">
        <div>
          <span className="page-category-badge">CEREMONIAS Y PROTOCOLO OFICIAL</span>
          <h1 className="admin-page-title">Calendario de Actos Militares</h1>
          <p className="admin-page-subtitle">
            Programación de ascensos, desfiles, izamientos de bandera y maniobras en terreno.
          </p>
        </div>
      </div>

      <ListadoEvento
        eventos={eventos}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAbrirRegistrar={() => setModalRegistrar(true)}
        onAbrirEditar={(e) => {
          setEventoSeleccionado(e);
          setModalEditar(true);
        }}
        onAbrirEliminar={(e) => {
          setEventoSeleccionado(e);
          setModalEliminar(true);
        }}
      />

      <RegistrarEventoForm
        isOpen={modalRegistrar}
        onClose={() => setModalRegistrar(false)}
        onGuardar={handleGuardar}
      />

      <EditarEventoForm
        isOpen={modalEditar}
        onClose={() => setModalEditar(false)}
        evento={eventoSeleccionado}
        onActualizar={handleActualizar}
      />

      <EliminarEventoModal
        isOpen={modalEliminar}
        onClose={() => setModalEliminar(false)}
        evento={eventoSeleccionado}
        onConfirmar={handleEliminar}
      />
    </div>
  );
}
