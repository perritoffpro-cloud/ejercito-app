import { useState } from 'react';
import { api } from '../services/api.js';
import { Icon } from '../components/Icons.jsx';
import { Cover, Empty, ErrorBar, Form, Kpi, Meter, Modal, PageHead, Search, Skeleton, initials, matches, useList } from '../components/UI.jsx';

const score = (c) => Math.round((c.fisico + c.tactico + c.disciplina) / 3);

export default function Dashboard() {
  const { rows, error, loading, reload } = useList('/cadetes');
  const { rows: rangos } = useList('/rangos');
  const [rango, setRango] = useState('');
  const [nivel, setNivel] = useState('');
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState(null); // null | {} (nuevo) | cadete

  const fields = [
    { k: 'imagen', label: 'Fotografía', type: 'image', shape: 'portrait' },
    { k: 'nombres', label: 'Nombres', required: true },
    { k: 'apellidos', label: 'Apellidos', required: true },
    { k: 'dni', label: 'DNI', required: true, maxLength: 8 },
    { k: 'rango_id', label: 'Rango', type: 'select', required: true, def: 1, options: rangos.map((r) => [r.id, r.nombre]) },
    { k: 'nivel', label: 'Nivel', type: 'select', def: 'Nuevo', options: ['Nuevo', 'Avanzado'] },
    { k: 'unidad', label: 'Unidad' },
    { k: 'fisico', label: 'Físico (0-100)', type: 'number', min: 0, max: 100, def: 0 },
    { k: 'tactico', label: 'Táctico (0-100)', type: 'number', min: 0, max: 100, def: 0 },
    { k: 'disciplina', label: 'Disciplina (0-100)', type: 'number', min: 0, max: 100, def: 0 },
    { k: 'fecha_ingreso', label: 'Fecha de ingreso', type: 'date' },
  ];

  const save = async (v) => {
    edit.id ? await api.update('/cadetes', edit.id, v) : await api.create('/cadetes', v);
    setEdit(null); reload();
  };
  const del = async () => {
    if (!confirm('¿Dar de baja a este cadete?')) return;
    await api.remove('/cadetes', edit.id); setEdit(null); reload();
  };

  const shown = rows.filter((c) => (!rango || c.rango_id == rango) && (!nivel || c.nivel === nivel)
    && matches(q, `${c.nombres} ${c.apellidos}`, c.dni, c.unidad));
  const avg = (k) => (shown.length ? Math.round(shown.reduce((s, c) => s + c[k], 0) / shown.length) : 0);
  const groups = [['Nuevo', 'Nuevos cadetes'], ['Avanzado', 'Cadetes avanzados']].filter(([n]) => !nivel || nivel === n);
  const count = (id) => rows.filter((c) => c.rango_id === id).length;

  return (
    <>
      <PageHead kicker="Rendimiento" title="Cadetes y rendimiento"
                text="Avance físico, táctico y de disciplina de cada cadete, separado por nivel.">
        <button className="btn" onClick={() => setEdit({})}><Icon name="plus" size={18} /> Nuevo cadete</button>
      </PageHead>
      <ErrorBar error={error} />

      <section className="kpis">
        <Kpi label="Cadetes" value={shown.length} icon="users" />
        <Kpi label="Promedio físico" value={avg('fisico')} icon="dumbbell" bar />
        <Kpi label="Promedio táctico" value={avg('tactico')} icon="target" bar />
        <Kpi label="Promedio disciplina" value={avg('disciplina')} icon="shield" bar />
      </section>

      <div className="toolbar">
        <Search value={q} onChange={setQ} placeholder="Buscar por nombre, DNI o unidad" />
        <div className="segmented" role="group" aria-label="Nivel">
          {[['', 'Ambos'], ['Nuevo', 'Nuevos'], ['Avanzado', 'Avanzados']].map(([v, l]) => (
            <button key={v} className={nivel === v ? 'on' : ''} onClick={() => setNivel(v)}>{l}</button>
          ))}
        </div>
      </div>
      <div className="chips">
        <button className={!rango ? 'on' : ''} onClick={() => setRango('')}>Todos los rangos <small>{rows.length}</small></button>
        {rangos.filter((r) => count(r.id)).map((r) => (
          <button key={r.id} className={rango == r.id ? 'on' : ''} onClick={() => setRango(r.id)}>
            {r.nombre} <small>{count(r.id)}</small>
          </button>
        ))}
      </div>

      {loading ? <Skeleton /> : groups.map(([n, label]) => {
        const list = shown.filter((c) => c.nivel === n);
        return (
          <section key={n} className="group">
            <h2 className="group-head">{label} <small>{list.length}</small></h2>
            {!list.length && <Empty icon="users">No hay cadetes con ese filtro. Prueba otra búsqueda o agrega uno nuevo.</Empty>}
            <div className="cards">
              {list.map((c) => (
                <article key={c.id} className={`panel card person ${n === 'Nuevo' ? 'recluta' : 'veterano'}`}>
                  <Cover src={c.imagen} text={initials(c)} shape="portrait" tone={n === 'Nuevo' ? 'olivo' : 'dorado'}
                         alt={`Fotografía de ${c.nombres} ${c.apellidos}`}>
                    <span className="rank">{c.rango}</span>
                    <span className="score" title="Promedio general"><b>{score(c)}</b><small>Prom.</small></span>
                    <div className="cover-title">
                      <h3>{c.nombres} {c.apellidos}</h3>
                      <p>{c.unidad || 'Sin unidad asignada'}</p>
                    </div>
                  </Cover>
                  <div className="card-body">
                    <Meter label="Físico" value={c.fisico} />
                    <Meter label="Táctico" value={c.tactico} />
                    <Meter label="Disciplina" value={c.disciplina} />
                  </div>
                  <footer className="card-foot">
                    <span className="muted">DNI {c.dni}{c.fecha_ingreso && ` · Ingreso ${c.fecha_ingreso.slice(0, 4)}`}</span>
                    <span className="grow" />
                    <button className="btn ghost sm" onClick={() => setEdit(c)}><Icon name="edit" size={15} /> Editar</button>
                  </footer>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      {edit && (
        <Modal title={edit.id ? 'Editar cadete' : 'Nuevo cadete'} onClose={() => setEdit(null)}>
          <Form fields={fields} initial={edit} onSave={save} onCancel={() => setEdit(null)} onDelete={edit.id && del} />
        </Modal>
      )}
    </>
  );
}
