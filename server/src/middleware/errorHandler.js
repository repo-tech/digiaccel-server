export function notFound(req, res) { res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` }); }
export function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  if (error.name === 'ZodError') return res.status(400).json({ success: false, message: 'Validation failed', errors: error.flatten().fieldErrors });
  if (error.name === 'CastError') return res.status(404).json({ success: false, message: 'Task not found' });
  console.error(error);
  return res.status(500).json({ success: false, message: 'An unexpected server error occurred' });
}
