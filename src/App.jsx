import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard.jsx';
import Rutinas from './pages/Rutinas.jsx';
import Calendario from './pages/Calendario.jsx';
import Inscripciones from './pages/Inscripciones.jsx';
import { Icon } from './components/Icons.jsx';

const TABS = [
  ['rendimiento', 'Rendimiento', 'chart', Dashboard],
  ['rutinas', 'Rutinas', 'target', Rutinas],
  ['calendario', 'Calendario', 'calendar', Calendario],
  ['inscripciones', 'Inscripciones', 'clipboard', Inscripciones],
];

const initialTab = () => {
  const h = window.location.hash.slice(1);
  return TABS.some((t) => t[0] === h) ? h : 'rendimiento';
};

export default function App() {
  const [tab, setTab] = useState(initialTab);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    window.location.hash = tab;
    window.scrollTo({ top: 0 });
  }, [tab]);

  useEffect(() => {
    const h = () => setTab(initialTab());
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);

  const View = TABS.find((t) => t[0] === tab)[3];

  return (
    <div className="app">
      <aside className="side">
        <div className="brand">
          <div className="emblem" aria-hidden="true">
            <Icon name="shield" size={24} />
          </div>
          <div>
            <b>Centro de Mando</b>
            <small>Ejército del Perú</small>
          </div>
        </div>

        <nav aria-label="Menú principal">
          <small className="nav-title">Navegación</small>
          {TABS.map(([id, label, icon]) => (
            <button
              key={id}
              className={`nav-btn ${tab === id ? 'on' : ''}`}
              onClick={() => setTab(id)}
              aria-current={tab === id ? 'page' : undefined}
            >
              <Icon name={icon} size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="clock">
          <span className="status"><i /> Sistema Activo</span>
          <b>{now.toLocaleTimeString('es-PE', { hour12: false })}</b>
          <small>{now.toLocaleDateString('es-PE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</small>
        </div>
      </aside>

      <main className="content">
        <View key={tab} />
      </main>
    </div>
  );
}
