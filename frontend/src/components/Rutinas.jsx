import { useState } from 'react';
import { api } from '../api.js';
import { Icon } from '../icons.jsx';
import { Cover, Empty, ErrorBar, Form, Modal, PageHead, Skeleton, useList } from '../ui.jsx';

const TIPOS = ['Entrenamiento físico', 'Instrucción de combate', 'Supervivencia'];
const LOOK = {
  'Entrenamiento físico': ['dumbbell', 'olivo'],
  'Instrucción de combate': ['target', 'carmesi'],
  'Supervivencia': ['mountain', 'petroleo'],
};
const DIAS = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function Rutinas() {
  const { rows, error, loading, reload } = useList('/rutinas');
  const { rows: rangos } = useList('/rangos');
  const [tipo, setTipo] = useState('');
  const [edit, setEdit] = useState(null);

  const fields = [
    { k: 'imagen', label: 'Imagen de portada', type: 'image', shape: 'wide' },
    { k: 'titulo', label: 'Título', required: true, full: true },
    { k: 'tipo', label: 'Tipo', type: 'select', def: TIPOS[0], options: TIPOS },
    { k: 'frecuencia', label: 'Frecuencia', type: 'select', def: 'Diaria', options: ['Diaria', 'Semanal'] },
    { k: 'dia_semana', label: 'Día (si es semanal)', type: 'select', options: DIAS.map((d) => [d, d || '—']) },
    { k: 'hora', label: 'Hora', type: 'time', required: true },
    { k: 'duracion_min', label: 'Duración (min)', type: 'number', min: 10, def: 60 },
    { k: 'nivel', label: 'Grupo de cadetes', type: 'select', def: 'Todos', options: ['Todos', 'Nuevo', 'Avanzado'] },
    { k: 'rango_id', label: 'Rango asignado', type: 'select', full: true,
      options: [['', 'Todos los rangos'], ...rangos.map((r) => [r.id, r.nombre])] },
    { k: 'descripcion', label: 'Descripción', type: 'textarea', full: true },
  ];

  const save = async (v) => {
    edit.id ? await api.update('/rutinas', edit.id, v) : await api.create('/rutinas', v);
    setEdit(null); reload();
  };
  const del = async () => {
    if (!confirm('¿Eliminar esta rutina?')) return;
    await api.remove('/rutinas', edit.id); setEdit(null); reload();
  };

  const shown = rows.filter((r) => !tipo || r.tipo === tipo);
  const horas = Math.round(rows.reduce((s, r) => s + r.duracion_min * (r.frecuencia === 'Diaria' ? 7 : 1), 0) / 60);

  return (
    <>
      <PageHead kicker="Rutinas" title="Rutinas de entrenamiento"
                text={`${rows.length} rutinas · unas ${horas} h de instrucción a la semana.`}>
        <button className="btn" onClick={() => setEdit({})}><Icon name="plus" size={18} /> Nueva rutina</button>
      </PageHead>
      <ErrorBar error={error} />
      <div className="chips">
        <button className={!tipo ? 'on' : ''} onClick={() => setTipo('')}>Todas <small>{rows.length}</small></button>
        {TIPOS.map((t) => (
          <button key={t} className={tipo === t ? 'on' : ''} onClick={() => setTipo(t)}>
            <Icon name={LOOK[t][0]} size={16} /> {t} <small>{rows.filter((r) => r.tipo === t).length}</small>
          </button>
        ))}
      </div>
      {loading ? <Skeleton /> : !shown.length && <Empty icon="target">Todavía no hay rutinas de este tipo. Agrega una con «Nueva rutina».</Empty>}
      <div className="cards">
        {shown.map((r) => (
          <article key={r.id} className="panel card">
            <Cover src={r.imagen} icon={LOOK[r.tipo][0]} tone={LOOK[r.tipo][1]} alt={r.titulo}>
              <span className="rank">{r.tipo}</span>
              <span className="when"><Icon name="clock" size={15} /> {r.hora.slice(0, 5)}</span>
            </Cover>
            <div className="card-body">
              <h3>{r.titulo}</h3>
              <ul className="facts">
                <li><Icon name="calendar" size={15} /> {r.frecuencia === 'Diaria' ? 'Todos los días' : r.dia_semana || 'Semanal'}</li>
                <li><Icon name="timer" size={15} /> {r.duracion_min} min</li>
                <li><Icon name="users" size={15} /> {r.rango || 'Todos los rangos'}</li>
              </ul>
              {r.descripcion && <p className="desc">{r.descripcion}</p>}
            </div>
            <footer className="card-foot">
              <span className="tag">Grupo {r.nivel}</span>
              <span className="grow" />
              <button className="btn ghost sm" onClick={() => setEdit(r)}><Icon name="edit" size={15} /> Editar</button>
            </footer>
          </article>
        ))}
      </div>
      {edit && (
        <Modal title={edit.id ? 'Editar rutina' : 'Nueva rutina'} onClose={() => setEdit(null)}>
          <Form fields={fields} initial={edit} onSave={save} onCancel={() => setEdit(null)} onDelete={edit.id && del} />
        </Modal>
      )}
    </>
  );
}
