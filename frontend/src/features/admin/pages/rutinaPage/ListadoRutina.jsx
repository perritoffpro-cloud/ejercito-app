import React from 'react';
import { Search, Plus, Edit, Trash2, Dumbbell, Clock } from 'lucide-react';

export default function ListadoRutina({
  rutinas,
  searchTerm,
  setSearchTerm,
  onAbrirRegistrar,
  onAbrirEditar,
  onAbrirEliminar,
}) {
  const filtered = rutinas.filter((r) => {
    const text = `${r.titulo} ${r.tipo} ${r.descripcion}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="innovex-module-wrapper">
      <div className="innovex-toolbar">
        <div className="toolbar-left">
          <div className="search-input-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar entrenamiento por título, tipo o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="toolbar-right">
          <button onClick={onAbrirRegistrar} className="btn-primary-innovex">
            <Plus size={18} />
            <span>Nueva Rutina</span>
          </button>
        </div>
      </div>

      <div className="innovex-cards-grid">
        {filtered.length === 0 ? (
          <div className="no-data-card">No se encontraron rutinas de entrenamiento.</div>
        ) : (
          filtered.map((rutina) => (
            <div key={rutina.id} className="innovex-entity-card">
              <div className="entity-card-banner">
                {rutina.imagen ? (
                  <img src={rutina.imagen} alt={rutina.titulo} className="banner-img" />
                ) : (
                  <div className="banner-placeholder"><Dumbbell size={36} /></div>
                )}
                <span className="card-top-pill">{rutina.tipo}</span>
                <span className="card-time-pill"><Clock size={12} /> {rutina.hora}</span>
              </div>

              <div className="entity-card-content">
                <h3 className="card-entity-title">{rutina.titulo}</h3>
                <p className="card-entity-desc">{rutina.descripcion}</p>

                <div className="card-meta-row">
                  <span><strong>Frecuencia:</strong> {rutina.dia_semana || rutina.frecuencia}</span>
                  <span><strong>Duración:</strong> {rutina.duracion_min} min</span>
                  <span><strong>Nivel:</strong> {rutina.nivel || 'Todos'}</span>
                </div>
              </div>

              <div className="entity-card-actions">
                <button onClick={() => onAbrirEditar(rutina)} className="btn-card-action edit">
                  <Edit size={15} />
                  <span>Editar</span>
                </button>
                <button onClick={() => onAbrirEliminar(rutina)} className="btn-card-action delete">
                  <Trash2 size={15} />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
