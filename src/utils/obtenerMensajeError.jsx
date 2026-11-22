export function obtenerMensajeError(error, defaultMessage = 'Ha ocurrido un error inesperado') {
  if (!error) return defaultMessage;
  if (typeof error === 'string') return error;
  if (error.response?.data?.error) return error.response.data.error;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return defaultMessage;
}
