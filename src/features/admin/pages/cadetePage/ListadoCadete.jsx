import React from 'react';
import { Search, Plus, Edit, Trash2, ShieldCheck, Filter } from 'lucide-react';

export default function ListadoCadete({
  cadetes,
  searchTerm,
  setSearchTerm,
  selectedRango,
  setSelectedRango,
  rangos,
  onAbrirRegistrar,
  onAbrirEditar,
  onAbrirEliminar,
}) {
  const filtered = cadetes.filter((c) => {
    const fullName = `${c.nombres} ${c.apellidos} ${c.dni} ${c.unidad}`.toLowerCase();
    const matchSearch = fullName.includes(searchTerm.toLowerCase());
    const matchRango = selectedRango ? String(c.rango_id) === String(selectedRango) : true;
    return matchSearch && matchRango;
  });

  return (
    <div className="innovex-module-wrapper">
      {/* Barra de Herramientas y Búsqueda */}
      <div className="innovex-toolbar">
        <div className="toolbar-left">
          <div className="search-input-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombres, apellidos, DNI o unidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-select-box">
            <Filter size={16} />
            <select value={selectedRango} onChange={(e) => setSelectedRango(e.target.value)}>
              <option value="">Todos los Rangos</option>
              {rangos.map((r) => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="toolbar-right">
          <button onClick={onAbrirRegistrar} className="btn-primary-innovex">
            <Plus size={18} />
            <span>Nuevo Cadete</span>
          </button>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="innovex-table-container">
        <table className="innovex-table">
          <thead>
            <tr>
              <th>Cadete / Soldado</th>
              <th>DNI</th>
              <th>Jerarquía / Rango</th>
              <th>Unidad Militar</th>
              <th>Calificaciones (F / T / D)</th>
              <th>Promedio</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-muted">
                  No se encontraron cadetes militares que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              filtered.map((cadete) => {
                const prom = Math.round(((cadete.fisico || 0) + (cadete.tactico || 0) + (cadete.disciplina || 0)) / 3);
                return (
                  <tr key={cadete.id}>
                    <td>
                      <div className="cadete-cell-profile">
                        {cadete.imagen ? (
                          <img src={cadete.imagen} alt={cadete.nombres} className="table-avatar" />
                        ) : (
                          <div className="table-avatar-placeholder">
                            {cadete.nombres?.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-800">{cadete.nombres} {cadete.apellidos}</div>
                          <div className="text-xs text-muted">Ingreso: {cadete.fecha_ingreso || '2026'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-sm">{cadete.dni}</span>
                    </td>
                    <td>
                      <span className="badge-rango-pill">{cadete.rango || 'Cadete'}</span>
                    </td>
                    <td>{cadete.unidad || 'Centro de Instrucción'}</td>
                    <td>
                      <div className="eval-mini-bars">
                        <span title={`Físico: ${cadete.fisico}`} className="score-tag f">F: {cadete.fisico}</span>
                        <span title={`Táctico: ${cadete.tactico}`} className="score-tag t">T: {cadete.tactico}</span>
                        <span title={`Disciplina: ${cadete.disciplina}`} className="score-tag d">D: {cadete.disciplina}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`prom-badge ${prom >= 70 ? 'high' : prom >= 50 ? 'mid' : 'low'}`}>
                        {prom} pts
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons-group">
                        <button
                          onClick={() => onAbrirEditar(cadete)}
                          className="btn-action edit"
                          title="Editar información"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onAbrirEliminar(cadete)}
                          className="btn-action delete"
                          title="Dar de baja / eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
