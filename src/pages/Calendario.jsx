import { useState } from 'react';
import { api } from '../services/api.js';
import { Icon } from '../components/Icons.jsx';
import { Cover, Empty, ErrorBar, Form, Modal, PageHead, localISO, useList } from '../components/UI.jsx';

const TIPOS = ['Ceremonia', 'Maniobra', 'Simulacro', 'Fecha clave'];
const LOOK = {
  Ceremonia: ['flag', 'dorado'],
  Maniobra: ['map', 'olivo'],
  Simulacro: ['siren', 'acero'],
  'Fecha clave': ['star', 'carmesi'],
};
const pad = (n) => String(n).padStart(2, '0');
const slug = (t) => t.split(' ')[0].toLowerCase();
const fmt = (iso, o) => new Date(`${iso}T12:00:00`).toLocaleDateString('es-PE', o);

export default function Calendario() {
  const { rows, error, reload } = useList('/eventos');
  const [cur, setCur] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [edit, setEdit] = useState(null);

  const fields = [
    { k: 'imagen', label: 'Imagen del evento', type: 'image', shape: 'wide' },
    { k: 'titulo', label: 'Título', required: true, full: true },
    { k: 'tipo', label: 'Tipo', type: 'select', def: TIPOS[0], options: TIPOS },
    { k: 'fecha', label: 'Fecha', type: 'date', required: true },
    { k: 'hora', label: 'Hora', type: 'time' },
    { k: 'lugar', label: 'Lugar' },
    { k: 'descripcion', label: 'Descripción', type: 'textarea', full: true },
  ];

  const save = async (v) => {
    edit.id ? await api.update('/eventos', edit.id, v) : await api.create('/eventos', v);
    setEdit(null); reload();
  };
  const del = async () => {
    if (!confirm('¿Eliminar este evento?')) return;
    await api.remove('/eventos', edit.id); setEdit(null); reload();
  };

  const first = new Date(cur.y, cur.m, 1);
  const offset = (first.getDay() + 6) % 7; // semana inicia en lunes
  const days = new Date(cur.y, cur.m + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const iso = (d) => `${cur.y}-${pad(cur.m + 1)}-${pad(d)}`;
  const move = (n) => setCur(({ y, m }) => { const d = new Date(y, m + n, 1); return { y: d.getFullYear(), m: d.getMonth() }; });
  const goToday = () => { const d = new Date(); setCur({ y: d.getFullYear(), m: d.getMonth() }); };
  const today = localISO();
  const upcoming = rows.filter((e) => e.fecha >= today).slice(0, 6);
  const inMonth = rows.filter((e) => e.fecha.startsWith(`${cur.y}-${pad(cur.m + 1)}`)).length;

  return (
    <>
      <PageHead kicker="Calendario" title="Calendario de actividades"
                text="Ceremonias, maniobras, simulacros y fechas importantes. Haz clic en un día para agregar un evento.">
        <button className="btn" onClick={() => setEdit({ fecha: today })}><Icon name="plus" size={18} /> Nuevo evento</button>
      </PageHead>
      <ErrorBar error={error} />

      <div className="cal-layout">
        <section className="panel cal-panel">
          <div className="cal-head">
            <button className="icon-btn" onClick={() => move(-1)} aria-label="Mes anterior"><Icon name="chevL" /></button>
            <h2 className="month">{first.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}</h2>
            <button className="icon-btn" onClick={() => move(1)} aria-label="Mes siguiente"><Icon name="chevR" /></button>
            <span className="muted">{inMonth} eventos</span>
            <span className="grow" />
            <button className="btn ghost sm" onClick={goToday}>Hoy</button>
          </div>
          <div className="legend">
            {TIPOS.map((t) => <span key={t} className={`t-${slug(t)}`}>{t}</span>)}
          </div>
          <div className="calendar">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => <div key={d} className="dow">{d}</div>)}
            {cells.map((d, i) => (
              <div key={i} className={`day ${d ? '' : 'void'} ${d && iso(d) === today ? 'today' : ''}`}
                   onClick={() => d && setEdit({ fecha: iso(d) })}>
                {d && <span>{d}</span>}
                {d && rows.filter((e) => e.fecha === iso(d)).map((e) => (
                  <button key={e.id} className={`evt t-${slug(e.tipo)}`} title={e.titulo}
                          onClick={(ev) => { ev.stopPropagation(); setEdit(e); }}>
                    {e.hora ? e.hora.slice(0, 5) + ' ' : ''}{e.titulo}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </section>

        <aside className="upcoming">
          <h2 className="group-head">Próximos eventos <small>{upcoming.length}</small></h2>
          {!upcoming.length && <Empty icon="calendar">No hay eventos próximos.</Empty>}
          {upcoming.map((e) => (
            <article key={e.id} className="panel card event" onClick={() => setEdit(e)} tabIndex={0}
                     onKeyDown={(k) => k.key === 'Enter' && setEdit(e)}>
              <Cover src={e.imagen} icon={LOOK[e.tipo][0]} tone={LOOK[e.tipo][1]} alt={e.titulo}>
                <span className="rank">{e.tipo}</span>
                <span className="datebox">
                  <b>{fmt(e.fecha, { day: '2-digit' })}</b>
                  <small>{fmt(e.fecha, { month: 'short' })}</small>
                </span>
              </Cover>
              <div className="card-body">
                <h3>{e.titulo}</h3>
                <ul className="facts">
                  <li><Icon name="clock" size={15} /> {fmt(e.fecha, { weekday: 'long' })}{e.hora ? ` · ${e.hora.slice(0, 5)}` : ''}</li>
                  {e.lugar && <li><Icon name="pin" size={15} /> {e.lugar}</li>}
                </ul>
              </div>
            </article>
          ))}
        </aside>
      </div>

      {edit && (
        <Modal title={edit.id ? 'Editar evento' : 'Nuevo evento'} onClose={() => setEdit(null)}>
          <Form fields={fields} initial={edit} onSave={save} onCancel={() => setEdit(null)} onDelete={edit.id && del} />
        </Modal>
      )}
    </>
  );
}
