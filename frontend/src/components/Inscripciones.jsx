import { useCallback, useState } from 'react';
import { api } from '../api.js';
import { Icon } from '../icons.jsx';
import { Cover, Empty, ErrorBar, Form, Meter, Modal, PageHead, Search, Skeleton, Toast, initials, matches, useList } from '../ui.jsx';

const fields = [
  { k: 'imagen', label: 'Fotografía del postulante', type: 'image', shape: 'portrait' },
  { k: 'nombres', label: 'Nombres', required: true },
  { k: 'apellidos', label: 'Apellidos', required: true },
  { k: 'dni', label: 'DNI', required: true, maxLength: 8 },
  { k: 'fecha_nacimiento', label: 'Fecha de nacimiento', type: 'date', required: true },
  { k: 'telefono', label: 'Teléfono' },
  { k: 'direccion', label: 'Dirección' },
  { k: 'talla_cm', label: 'Talla (cm)', type: 'number', min: 100, max: 230 },
  { k: 'peso_kg', label: 'Peso (kg)', type: 'number', step: '0.1', min: 30, max: 200 },
  { k: 'eval_medica', label: 'Evaluación médica', type: 'select', def: 'Pendiente',
    options: ['Pendiente', 'Apto', 'Apto con observaciones', 'No apto'] },
  { k: 'eval_fisica', label: 'Evaluación física (0-100)', type: 'number', min: 0, max: 100, def: 0 },
  { k: 'estado', label: 'Estado de admisión', type: 'select', def: 'Pendiente', options: ['Pendiente', 'Aprobado', 'Rechazado'] },
];

const ESTADOS = [['Pendiente', 'Pendientes', 'clock'], ['Aprobado', 'Aprobados', 'check'], ['Rechazado', 'Rechazados', 'x']];
const MED = { Apto: 'ok', 'Apto con observaciones': 'warn', 'No apto': 'bad', Pendiente: 'neutral' };
const TONE = { Pendiente: 'petroleo', Aprobado: 'olivo', Rechazado: 'carmesi' };
const age = (d) => {
  if (!d) return '—';
  const b = new Date(`${d}T12:00:00`), n = new Date();
  return n.getFullYear() - b.getFullYear() - (n < new Date(n.getFullYear(), b.getMonth(), b.getDate()) ? 1 : 0);
};

export default function Inscripciones() {
  const { rows, error, loading, reload } = useList('/inscripciones');
  const [estado, setEstado] = useState('Pendiente');
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState(null);
  const [msg, setMsg] = useState(null);
  const clear = useCallback(() => setMsg(null), []);

  const save = async (v) => {
    edit.id ? await api.update('/inscripciones', edit.id, v) : await api.create('/inscripciones', v);
    setEdit(null); reload();
  };
  const del = async () => {
    if (!confirm('¿Eliminar esta inscripción?')) return;
    await api.remove('/inscripciones', edit.id); setEdit(null); reload();
  };
  const decide = async (i, accion) => {
    try {
      await api.action('/inscripciones', i.id, accion);
      setMsg({ text: accion === 'aprobar'
        ? `${i.nombres} ${i.apellidos} fue aprobado y pasó a Nuevos cadetes.`
        : `La postulación de ${i.nombres} ${i.apellidos} fue rechazada.` });
    } catch (e) { setMsg({ text: e.message, bad: true }); }
    reload();
  };

  const shown = rows.filter((r) => r.estado === estado && matches(q, `${r.nombres} ${r.apellidos}`, r.dni));

  return (
    <>
      <PageHead kicker="Admisión" title="Inscripciones"
                text="Postulantes, evaluación médica y física, y decisión final de ingreso.">
        <button className="btn" onClick={() => setEdit({})}><Icon name="plus" size={18} /> Nuevo postulante</button>
      </PageHead>
      <ErrorBar error={error} />

      <section className="kpis">
        {ESTADOS.map(([s, l, icon]) => (
          <button key={s} className={`panel kpi pick ${estado === s ? 'on' : ''}`} onClick={() => setEstado(s)}>
            <div className="kpi-top"><small>{l}</small><Icon name={icon} size={18} /></div>
            <b>{rows.filter((r) => r.estado === s).length}</b>
          </button>
        ))}
      </section>

      <div className="toolbar">
        <Search value={q} onChange={setQ} placeholder="Buscar postulante por nombre o DNI" />
      </div>

      {loading ? <Skeleton /> : !shown.length && <Empty icon="clipboard">No hay postulantes {estado.toLowerCase()}s{q && ' con esa búsqueda'}.</Empty>}
      <div className="cards">
        {shown.map((r) => (
          <article key={r.id} className="panel card person">
            <Cover src={r.imagen} text={initials(r)} shape="portrait" tone={TONE[r.estado]} alt={`Fotografía de ${r.nombres} ${r.apellidos}`}>
              <span className={`badge ${MED[r.eval_medica]}`}>{r.eval_medica}</span>
              <div className="cover-title">
                <h3>{r.nombres} {r.apellidos}</h3>
                <p>DNI {r.dni} · {age(r.fecha_nacimiento)} años</p>
              </div>
            </Cover>
            <div className="card-body">
              <ul className="facts">
                <li><Icon name="user" size={15} /> {r.talla_cm || '—'} cm · {r.peso_kg || '—'} kg</li>
                {r.telefono && <li><Icon name="phone" size={15} /> {r.telefono}</li>}
                {r.direccion && <li><Icon name="pin" size={15} /> {r.direccion}</li>}
              </ul>
              <Meter label="Ev. física" value={r.eval_fisica} />
            </div>
            <footer className="card-foot">
              <button className="icon-btn" onClick={() => setEdit(r)} aria-label="Editar" title="Editar"><Icon name="edit" size={17} /></button>
              <span className="grow" />
              {r.estado === 'Pendiente' && <>
                <button className="btn danger sm" onClick={() => decide(r, 'rechazar')}>Rechazar</button>
                <button className="btn sm" onClick={() => decide(r, 'aprobar')}>Aprobar</button>
              </>}
            </footer>
          </article>
        ))}
      </div>
      {edit && (
        <Modal title={edit.id ? 'Editar postulante' : 'Nuevo postulante'} onClose={() => setEdit(null)}>
          <Form fields={fields} initial={edit} onSave={save} onCancel={() => setEdit(null)} onDelete={edit.id && del} />
        </Modal>
      )}
      <Toast msg={msg} onDone={clear} />
    </>
  );
}
