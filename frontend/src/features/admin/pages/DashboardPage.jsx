import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarCadetes } from '../../../services/cadete/CadeteMethods';
import { listarRutinas } from '../../../services/rutina/RutinaMethods';
import { listarEventos } from '../../../services/evento/EventoMethods';
import { listarInscripciones } from '../../../services/inscripcion/InscripcionMethods';
import { Users, Dumbbell, Calendar, ClipboardCheck, ArrowUpRight, ShieldCheck, Award } from 'lucide-react';
import Loading from '../../../components/Loading';

export default function DashboardPage() {
  const [cadetes, setCadetes] = useState([]);
  const [rutinas, setRutinas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      listarCadetes(),
      listarRutinas(),
      listarEventos(),
      listarInscripciones(),
    ])
      .then(([c, r, e, i]) => {
        setCadetes(c || []);
        setRutinas(r || []);
        setEventos(e || []);
        setInscripciones(i || []);
      })
      .catch((err) => console.error('Error al cargar dashboard:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading message="Cargando Centro de Mando Militar..." />;

  const postulantesPendientes = inscripciones.filter((i) => i.estado === 'Pendiente' || i.estado?.includes('observ'));
  const promedioGeneral = cadetes.length
    ? Math.round(
        cadetes.reduce((acc, c) => acc + ((c.fisico || 0) + (c.tactico || 0) + (c.disciplina || 0)) / 3, 0) /
          cadetes.length
      )
    : 0;

  return (
    <div className="admin-page-container">
      {/* Header del Dashboard */}
      <div className="admin-page-header">
        <div>
          <span className="page-category-badge">COMANDO GENERAL · REPORTE TÁCTICO</span>
          <h1 className="admin-page-title">Centro de Mando Operativo</h1>
          <p className="admin-page-subtitle">
            Monitoreo en tiempo real del personal militar, entrenamientos y postulantes.
          </p>
        </div>
      </div>

      {/* Grid de 4 Estadísticas Principales */}
      <div className="kpi-grid">
        <div className="kpi-card crimson-accent">
          <div className="kpi-icon-box">
            <Users size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-title">Cadetes Activos</span>
            <div className="kpi-number">{cadetes.length}</div>
            <Link to="/admin/cadetes" className="kpi-link">
              <span>Gestionar batallón</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        <div className="kpi-card gold-accent">
          <div className="kpi-icon-box">
            <ClipboardCheck size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-title">Postulantes Pendientes</span>
            <div className="kpi-number">{postulantesPendientes.length}</div>
            <Link to="/admin/inscripciones" className="kpi-link">
              <span>Evaluar admisiones</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        <div className="kpi-card blue-accent">
          <div className="kpi-icon-box">
            <Dumbbell size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-title">Rutinas Programadas</span>
            <div className="kpi-number">{rutinas.length}</div>
            <Link to="/admin/rutinas" className="kpi-link">
              <span>Ver cronograma</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        <div className="kpi-card dark-accent">
          <div className="kpi-icon-box">
            <Award size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-title">Rendimiento Promedio</span>
            <div className="kpi-number">{promedioGeneral}/100</div>
            <span className="kpi-subtext">Evaluación Física y Táctica</span>
          </div>
        </div>
      </div>

      {/* Dos Columnas de Contenido Rápido */}
      <div className="dashboard-columns">
        {/* Columna Izquierda: Cadetes Destacados */}
        <div className="dashboard-box">
          <div className="box-header">
            <h3>Cadetes con Mayor Calificación</h3>
            <Link to="/admin/cadetes" className="box-header-link">Ver todos</Link>
          </div>
          <div className="box-list">
            {cadetes.slice(0, 4).map((cadete) => {
              const prom = Math.round(((cadete.fisico || 0) + (cadete.tactico || 0) + (cadete.disciplina || 0)) / 3);
              return (
                <div key={cadete.id} className="box-list-item">
                  <div className="item-avatar-wrap">
                    {cadete.imagen ? (
                      <img src={cadete.imagen} alt={cadete.nombres} className="item-avatar-img" />
                    ) : (
                      <div className="item-avatar-placeholder">{cadete.nombres.charAt(0)}</div>
                    )}
                  </div>
                  <div className="item-text-info">
                    <span className="item-name">{cadete.nombres} {cadete.apellidos}</span>
                    <span className="item-sub">{cadete.rango || 'Cadete'} · {cadete.unidad}</span>
                  </div>
                  <div className="item-badge-score">
                    <ShieldCheck size={14} />
                    <span>{prom} pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Próximos Eventos Militares */}
        <div className="dashboard-box">
          <div className="box-header">
            <h3>Agenda Militar Inmediata</h3>
            <Link to="/admin/eventos" className="box-header-link">Ver calendario</Link>
          </div>
          <div className="box-list">
            {eventos.slice(0, 4).map((ev) => (
              <div key={ev.id} className="box-list-item">
                <div className="event-date-box">
                  <span className="ev-day">{String(ev.fecha || '').split('-')[2] || '24'}</span>
                  <span className="ev-month">NOV</span>
                </div>
                <div className="item-text-info">
                  <span className="item-name">{ev.titulo}</span>
                  <span className="item-sub">{ev.lugar} · {ev.hora}</span>
                </div>
                <span className="event-type-pill">{ev.tipo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
