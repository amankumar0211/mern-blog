// 404 for any unmatched route
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

// Centralized error handler: always responds with JSON
const errorHandler = (err, req, res, next) => {
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Malformed JSON in request body
  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Malformed JSON in request body';
  }

  // Invalid ObjectId or bad data type
  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid value for ${err.path}: ${err.value}`;
  }

  // Mongoose schema validation failures
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  if (status === 500) {
    console.error('Unhandled error:', err);
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && status === 500 && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
