/**
 * Error Handler Middleware
 * Centralized error handling
 */

function errorHandler(err, req, res, next) {
  console.error('\n❌ Error:', err);
  console.error('Stack:', err.stack);

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erreur serveur interne';

  // Database errors
  if (err.message?.includes('SQLITE_ERROR')) {
    statusCode = 500;
    message = 'Erreur de base de données';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Données invalides';
  }

  // Authentication errors
  if (err.name === 'AuthenticationError') {
    statusCode = 401;
    message = 'Authentification échouée';
  }

  // Authorization errors
  if (err.name === 'AuthorizationError') {
    statusCode = 403;
    message = 'Accès refusé';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * 404 Handler
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      message: 'Ressource non trouvée',
      statusCode: 404,
      path: req.url
    }
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
