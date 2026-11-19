import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from './api.js';
import { Icon } from './icons.jsx';

export function useList(path) {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const reload = useCallback(
    () => api.list(path)
      .then((r) => { setRows(r); setError(''); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false)),
    [path]
  );
  useEffect(() => { reload(); }, [reload]);
  return { rows, error, loading, reload };
}

// Fecha local en formato YYYY-MM-DD (evita el desfase de toISOString en UTC)
export const localISO = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const initials = (p) =>
  `${(p.nombres || '').trim()[0] || ''}${(p.apellidos || '').trim()[0] || ''}`.toUpperCase();

// Normaliza para búsquedas sin tildes ni mayúsculas
const norm = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
export const matches = (q, ...vals) => !q.trim() || vals.some((v) => norm(v).includes(norm(q.trim())));

export function PageHead({ kicker, title, text, children }) {
  return (
    <header className="page-head">
      <div>
        <span className="kicker">{kicker}</span>
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
      {children && <div className="head-actions">{children}</div>}
    </header>
  );
}

export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="veil" onClick={onClose}>
      <div className="panel modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar"><Icon name="x" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Portada de tarjeta: muestra la imagen o, si no hay, un fondo temático con icono o iniciales
export function Cover({ src, icon = 'shield', text, tone = 'petroleo', shape = 'wide', alt = '', children }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [src]);
  const hasImg = src && !broken;
  return (
    <div className={`cover ${shape} tone-${tone} ${hasImg ? 'has-img' : ''}`}>
      {hasImg
        ? <img src={src} alt={alt} loading="lazy" onError={() => setBroken(true)} />
        : <div className="cover-fallback">{text ? <span className="ini">{text}</span> : <Icon name={icon} size={64} />}</div>}
      <div className="cover-shade" />
      {children}
    </div>
  );
}

// Reduce la imagen en el navegador antes de subirla (máx. 1280 px, JPEG)
async function shrink(file, max = 1280) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((ok, ko) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = () => ko(new Error('No se pudo leer la imagen'));
      i.src = url;
    });
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * k);
    c.height = Math.round(img.naturalHeight * k);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#121413';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.86);
  } finally { URL.revokeObjectURL(url); }
}

export function ImageField({ value, onChange, shape = 'wide', label }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState('');

  const pick = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('El archivo debe ser una imagen.');
    setBusy(true); setError('');
    try { onChange((await api.upload(await shrink(file))).url); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="imgfield full">
      <span className="field-label">{label}</span>
      <div className="imgfield-row">
        <button type="button" className={`drop ${shape} ${drag ? 'over' : ''}`}
                onClick={() => input.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}>
          {value
            ? <img src={value} alt="Vista previa" />
            : <span className="drop-hint"><Icon name="image" size={30} />{busy ? 'Subiendo…' : 'Arrastra o haz clic'}</span>}
          {busy && value && <span className="drop-busy">Subiendo…</span>}
        </button>
        <div className="imgfield-ctrl">
          <div className="actions">
            <button type="button" className="btn sm" onClick={() => input.current.click()} disabled={busy}>
              <Icon name="upload" size={16} /> {value ? 'Cambiar imagen' : 'Subir imagen'}
            </button>
            {value && <button type="button" className="btn ghost sm" onClick={() => onChange('')}>Quitar</button>}
          </div>
          <input type="text" inputMode="url" placeholder="…o pega la URL de una imagen" value={value || ''}
                 onChange={(e) => onChange(e.target.value)} />
          <small className="muted">PNG, JPG o WEBP. Se ajusta automáticamente a 1280 px.</small>
          {error && <small className="err">{error}</small>}
        </div>
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => { pick(e.target.files[0]); e.target.value = ''; }} />
    </div>
  );
}

// Formulario genérico. fields: [{k, label, type, options, required, full, shape}]
export function Form({ fields, initial = {}, onSave, onCancel, onDelete, saveLabel = 'Guardar' }) {
  const [v, setV] = useState(() => Object.fromEntries(fields.map((f) => [f.k, initial[f.k] ?? f.def ?? ''])));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const put = (k, val) => setV((s) => ({ ...s, [k]: val }));
  const set = (k) => (e) => put(k, e.target.value);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(v); } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  return (
    <form className="form" onSubmit={submit}>
      {fields.map((f) => f.type === 'image' ? (
        <ImageField key={f.k} label={f.label} shape={f.shape} value={v[f.k]} onChange={(x) => put(f.k, x)} />
      ) : (
        <label key={f.k} className={f.full ? 'full' : ''}>
          <span className="field-label">{f.label}{f.required && <em> *</em>}</span>
          {f.type === 'select' ? (
            <select value={v[f.k] ?? ''} onChange={set(f.k)} required={f.required}>
              {f.options.map((o) => {
                const [val, lab] = Array.isArray(o) ? o : [o, o];
                return <option key={val} value={val}>{lab}</option>;
              })}
            </select>
          ) : f.type === 'textarea' ? (
            <textarea rows="3" value={v[f.k] ?? ''} onChange={set(f.k)} />
          ) : (
            <input type={f.type || 'text'} value={v[f.k] ?? ''} onChange={set(f.k)} required={f.required}
                   min={f.min} max={f.max} step={f.step} maxLength={f.maxLength} />
          )}
        </label>
      ))}
      {error && <p className="alert full">{error}</p>}
      <div className="actions full form-foot">
        {onDelete && <button type="button" className="btn danger" onClick={onDelete}><Icon name="trash" size={16} /> Eliminar</button>}
        <span className="grow" />
        <button type="button" className="btn ghost" onClick={onCancel}>Cancelar</button>
        <button className="btn" disabled={saving}>{saving ? 'Guardando…' : saveLabel}</button>
      </div>
    </form>
  );
}

export function Meter({ label, value }) {
  const v = Number(value) || 0;
  return (
    <div className="meter">
      <span>{label}</span>
      <div className="track"><i style={{ width: `${v}%` }} className={v < 50 ? 'low' : v >= 85 ? 'high' : ''} /></div>
      <b>{v}</b>
    </div>
  );
}

export function Kpi({ label, value, icon, bar }) {
  return (
    <div className="panel kpi">
      <div className="kpi-top"><small>{label}</small>{icon && <Icon name={icon} size={18} />}</div>
      <b>{value}</b>
      {bar && <div className="track"><i style={{ width: `${value}%` }} /></div>}
    </div>
  );
}

export function Search({ value, onChange, placeholder }) {
  return (
    <label className="search">
      <Icon name="search" size={18} />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
    </label>
  );
}

export function Toast({ msg, onDone }) {
  useEffect(() => { if (msg) { const t = setTimeout(onDone, 4500); return () => clearTimeout(t); } }, [msg, onDone]);
  return msg ? <div className={`toast ${msg.bad ? 'bad' : ''}`} role="status"><Icon name={msg.bad ? 'x' : 'check'} size={18} />{msg.text}</div> : null;
}

export const Empty = ({ icon = 'shield', children }) => (
  <div className="empty"><Icon name={icon} size={34} /><p>{children}</p></div>
);

export const Skeleton = ({ n = 3 }) => (
  <div className="cards">{Array.from({ length: n }, (_, i) => <div key={i} className="panel card skel" />)}</div>
);

export const ErrorBar = ({ error }) =>
  error ? <p className="alert">{error} — verifica que el backend esté activo en el puerto 3001.</p> : null;
