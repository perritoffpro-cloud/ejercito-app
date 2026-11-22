import React, { useState, useEffect } from 'react';
import { listarCadetes, registrarCadete, actualizarCadete, eliminarCadete } from '../../../services/cadete/CadeteMethods';
import { listarRangos } from '../../../services/rango/RangoMethods';
import ListadoCadete from './cadetePage/ListadoCadete';
import RegistrarCadeteForm from './cadetePage/RegistrarCadeteForm';
import EditarCadeteForm from './cadetePage/EditarCadeteForm';
import EliminarCadeteModal from './cadetePage/EliminarCadeteModal';
import Loading from '../../../components/Loading';
import Notificaciones from '../../../components/Notificaciones';

export default function CadetePage() {
  const [cadetes, setCadetes] = useState([]);
  const [rangos, setRangos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRango, setSelectedRango] = useState('');

  // Modales
  const [modalRegistrar, setModalRegistrar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [cadeteSeleccionado, setCadeteSeleccionado] = useState(null);

  // Alerta
  const [notif, setNotif] = useState(null);

  const cargarDatos = async () => {
    try {
      const [cadetesData, rangosData] = await Promise.all([listarCadetes(), listarRangos()]);
      setCadetes(cadetesData || []);
      setRangos(rangosData || []);
    } catch (err) {
      setNotif({ type: 'error', message: 'Error al sincronizar con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleGuardar = async (nuevoCadete) => {
    await registrarCadete(nuevoCadete);
    setNotif({ type: 'success', message: 'Cadete incorporado exitosamente' });
    await cargarDatos();
  };

  const handleActualizar = async (id, datosActualizados) => {
    await actualizarCadete(id, datosActualizados);
    setNotif({ type: 'success', message: 'Datos del cadete actualizados' });
    await cargarDatos();
  };

  const handleConfirmarEliminar = async (id) => {
    await eliminarCadete(id);
    setNotif({ type: 'success', message: 'Cadete dado de baja exitosamente' });
    await cargarDatos();
  };

  if (loading) return <Loading message="Cargando batallón de cadetes..." />;

  return (
    <div className="admin-page-container">
      <Notificaciones notification={notif} onClose={() => setNotif(null)} />

      <div className="admin-page-header">
        <div>
          <span className="page-category-badge">PERSONAL ACTIVO · ESCALAFÓN MILITAR</span>
          <h1 className="admin-page-title">Batallón de Cadetes y Tropa</h1>
          <p className="admin-page-subtitle">
            Control de altas, jerarquía militar y evaluaciones de rendimiento institucional.
          </p>
        </div>
      </div>

      <ListadoCadete
        cadetes={cadetes}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedRango={selectedRango}
        setSelectedRango={setSelectedRango}
        rangos={rangos}
        onAbrirRegistrar={() => setModalRegistrar(true)}
        onAbrirEditar={(c) => {
          setCadeteSeleccionado(c);
          setModalEditar(true);
        }}
        onAbrirEliminar={(c) => {
          setCadeteSeleccionado(c);
          setModalEliminar(true);
        }}
      />

      <RegistrarCadeteForm
        isOpen={modalRegistrar}
        onClose={() => setModalRegistrar(false)}
        onGuardar={handleGuardar}
        rangos={rangos}
      />

      <EditarCadeteForm
        isOpen={modalEditar}
        onClose={() => setModalEditar(false)}
        cadete={cadeteSeleccionado}
        onActualizar={handleActualizar}
        rangos={rangos}
      />

      <EliminarCadeteModal
        isOpen={modalEliminar}
        onClose={() => setModalEliminar(false)}
        cadete={cadeteSeleccionado}
        onConfirmar={handleConfirmarEliminar}
      />
    </div>
  );
}
