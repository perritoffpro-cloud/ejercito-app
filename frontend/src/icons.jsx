// Iconos de trazo (24x24) dibujados a mano, sin dependencias externas
const ring = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

const P = {
  chart: 'M3 21h18M6 17v-6M11 17V6M16 17v-4M20 17V8',
  target: `${ring(12, 12, 9)}${ring(12, 12, 5)}M12 1v4M12 19v4M1 12h4M19 12h4`,
  calendar: 'M4 5h16v16H4zM4 10h16M8 3v4M16 3v4',
  clipboard: 'M6 4h12v17H6zM9 2h6v4H9zM9 11h6M9 15h4',
  dumbbell: 'M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12',
  mountain: 'M2 20l7-12 4 6 3-4 6 10zM9 8l2 3',
  flag: 'M5 21V4M5 4h13l-3 4 3 4H5',
  map: 'M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14',
  siren: 'M7 18v-6a5 5 0 0 1 10 0v6M5 18h14v3H5zM12 2v2M4 6l1.5 1.5M20 6l-1.5 1.5',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1-4.4-4.3 6.1-.9z',
  user: `${ring(12, 8, 4)}M4 21c0-4 3.6-6 8-6s8 2 8 6`,
  users: `${ring(9, 8, 3.5)}M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5c2.4.6 4 2.4 4 5.5`,
  image: `M3 4h18v16H3z${ring(8.5, 9.5, 1.8)}M21 15l-5-5L5 20`,
  upload: 'M12 16V4M7 9l5-5 5 5M4 20h16',
  plus: 'M12 5v14M5 12h14',
  search: `${ring(11, 11, 7)}M20 20l-4-4`,
  edit: 'M4 20h4L19 9l-4-4L4 16zM13 7l4 4',
  clock: `${ring(12, 12, 9)}M12 7v5l3 2`,
  timer: `${ring(12, 13, 8)}M12 9v4M9 2h6`,
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  pin:`M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z${ring(12, 10, 2.5)}`,
  x: 'M6 6l12 12M18 6L6 18',
  check: 'M4 12l5 5L20 6',
  shield: 'M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z',
  chevL: 'M15 5l-7 7 7 7',
  chevR: 'M9 5l7 7-7 7',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14',
};

export function Icon({ name, size = 20, className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[name] || P.shield} />
    </svg>
  );
}
