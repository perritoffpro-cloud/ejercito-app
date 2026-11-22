export function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.url} ->`, err.message);

  const isDuplicate = err.code === 'ER_DUP_ENTRY';
  const isDbError = err.code && String(err.code).startsWith('ER_');

  let statusCode = err.status || 500;
  if (isDuplicate || isDbError) {
    statusCode = 400;
  }

  res.status(statusCode).json({
    error: isDuplicate 
      ? 'Ya existe un registro con ese DNI o identificador único' 
      : (err.message || 'Error interno del servidor'),
    code: err.code || 'INTERNAL_ERROR',
  });
}
