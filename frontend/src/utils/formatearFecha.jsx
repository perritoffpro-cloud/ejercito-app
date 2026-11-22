export function formatearFecha(fechaStr) {
  if (!fechaStr) return '-';
  try {
    // Si viene como YYYY-MM-DD
    const partes = String(fechaStr).split('T')[0].split('-');
    if (partes.length === 3) {
      const [year, month, day] = partes;
      const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];
      return `${parseInt(day, 10)} ${meses[parseInt(month, 10) - 1]} ${year}`;
    }
    const date = new Date(fechaStr);
    return isNaN(date.getTime()) ? fechaStr : date.toLocaleDateString('es-PE');
  } catch {
    return fechaStr;
  }
}
