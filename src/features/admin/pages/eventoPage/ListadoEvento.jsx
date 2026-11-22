import React from 'react';
import { Search, Plus, Edit, Trash2, Calendar, MapPin, Clock } from 'lucide-react';
import { formatearFecha } from '../../../../utils/formatearFecha';

export default function ListadoEvento({
  eventos,
  searchTerm,
  setSearchTerm,
  onAbrirRegistrar,
  onAbrirEditar,
  onAbrirEliminar,
}) {
  const filtered = eventos.filter((e) => {
    const text = `${e.titulo} ${e.tipo} ${e.lugar} ${e.descripcion}`.toLowerCase();
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
              placeholder="Buscar evento por nombre, lugar o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="toolbar-right">
          <button onClick={onAbrirRegistrar} className="btn-primary-innovex">
            <Plus size={18} />
            <span>Nuevo Evento</span>
          </button>
        </div>
      </div>

      <div className="innovex-cards-grid">
        {filtered.length === 0 ? (
          <div className="no-data-card">No se encontraron eventos o ceremonias en el calendario.</div>
        ) : (
          filtered.map((evento) => (
            <div key={evento.id} className="innovex-entity-card">
              <div className="entity-card-banner">
                {evento.imagen ? (
                  <img src={evento.imagen} alt={evento.titulo} className="banner-img" />
                ) : (
                  <div className="banner-placeholder"><Calendar size={36} /></div>
                )}
                <span className="card-top-pill">{evento.tipo}</span>
              </div>

              <div className="entity-card-content">
                <h3 className="card-entity-title">{evento.titulo}</h3>
                <p className="card-entity-desc">{evento.descripcion}</p>

                <div className="card-meta-row">
                  <span><Calendar size={13} /> {formatearFecha(evento.fecha)}</span>
                  <span><Clock size={13} /> {evento.hora}</span>
                  <span><MapPin size={13} /> {evento.lugar}</span>
                </div>
              </div>

              <div className="entity-card-actions">
                <button onClick={() => onAbrirEditar(evento)} className="btn-card-action edit">
                  <Edit size={15} />
                  <span>Editar</span>
                </button>
                <button onClick={() => onAbrirEliminar(evento)} className="btn-card-action delete">
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
