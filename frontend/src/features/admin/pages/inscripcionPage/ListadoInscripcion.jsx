import React from 'react';
import { Search, Plus, Edit, Trash2, CheckCircle2, XCircle, ShieldCheck, Filter } from 'lucide-react';
import { formatearFecha } from '../../../../utils/formatearFecha';

export default function ListadoInscripcion({
  inscripciones,
  searchTerm,
  setSearchTerm,
  estadoFilter,
  setEstadoFilter,
  onAbrirRegistrar,
  onAbrirEditar,
  onAbrirEliminar,
  onAprobarPostulante,
  onRechazarPostulante,
}) {
  const filtered = inscripciones.filter((i) => {
    const text = `${i.nombres} ${i.apellidos} ${i.dni} ${i.telefono} ${i.direccion}`.toLowerCase();
    const matchSearch = text.includes(searchTerm.toLowerCase());
    const matchEstado = estadoFilter ? i.estado === estadoFilter : true;
    return matchSearch && matchEstado;
  });

  return (
    <div className="innovex-module-wrapper">
      <div className="innovex-toolbar">
        <div className="toolbar-left">
          <div className="search-input-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar postulante por nombres, apellidos, DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-select-box">
            <Filter size={16} />
            <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)}>
              <option value="">Todos los Estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Rechazado">Rechazado</option>
            </select>
          </div>
        </div>

        <div className="toolbar-right">
          <button onClick={onAbrirRegistrar} className="btn-primary-innovex">
            <Plus size={18} />
            <span>Nueva Inscripción</span>
          </button>
        </div>
      </div>

      <div className="innovex-table-container">
        <table className="innovex-table">
          <thead>
            <tr>
              <th>Postulante</th>
              <th>DNI</th>
              <th>Biometría</th>
              <th>Contacto</th>
              <th>Evaluación Médica / Física</th>
              <th>Estado Resolución</th>
              <th className="text-right">Acciones de Mando</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-muted">
                  No se encontraron fichas de postulación que coincidan.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="cadete-cell-profile">
                      {item.imagen ? (
                        <img src={item.imagen} alt={item.nombres} className="table-avatar" />
                      ) : (
                        <div className="table-avatar-placeholder">{item.nombres?.charAt(0)}</div>
                      )}
                      <div>
                        <div className="font-bold text-slate-800">{item.nombres} {item.apellidos}</div>
                        <div className="text-xs text-muted">Nacimiento: {formatearFecha(item.fecha_nacimiento)}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="font-mono text-sm">{item.dni}</span></td>
                  <td>
                    <div className="text-xs text-slate-600">
                      <div>Talla: <strong>{item.talla_cm} cm</strong></div>
                      <div>Peso: <strong>{item.peso_kg} kg</strong></div>
                    </div>
                  </td>
                  <td>
                    <div className="text-xs text-slate-600">
                      <div>Tel: {item.telefono}</div>
                      <div className="truncate max-w-xs">{item.direccion}</div>
                    </div>
                  </td>
                  <td>
                    <div className="text-xs">
                      <span className={`med-status-pill ${item.eval_medica?.startsWith('Apto') ? 'apto' : 'pending'}`}>
                        {item.eval_medica || 'Pendiente'}
                      </span>
                      <div className="text-muted mt-1">Física: <strong>{item.eval_fisica || 0}/100</strong></div>
                    </div>
                  </td>
                  <td>
                    <span className={`res-badge ${item.estado?.toLowerCase()}`}>
                      {item.estado}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="action-buttons-group">
                      {item.estado !== 'Aprobado' && (
                        <>
                          <button
                            onClick={() => onAprobarPostulante(item)}
                            className="btn-action approve"
                            title="Aprobar e incorporar como Cadete activo (Transacción ACID)"
                          >
                            <ShieldCheck size={16} />
                          </button>
                          <button
                            onClick={() => onRechazarPostulante(item)}
                            className="btn-action reject"
                            title="Rechazar postulación"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => onAbrirEditar(item)}
                        className="btn-action edit"
                        title="Modificar ficha"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onAbrirEliminar(item)}
                        className="btn-action delete"
                        title="Eliminar expediente"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
