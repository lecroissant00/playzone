/**
 * Authentication Middleware
 * Handles user authentication and authorization
 */

const SecurityUtil = require('../utils/security');

/**
 * Middleware pour vérifier l'authentification admin
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Authentication requise'
    });
  }

  const token = authHeader.replace('Bearer ', '');
  
  // Simple token verification (en production, utiliser JWT)
  if (token !== req.session?.adminToken) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré'
    });
  }

  req.user = {
    role: 'admin',
    id: req.session?.adminId
  };

  next();
}

/**
 * Middleware pour vérifier si l'utilisateur est admin
 */
function requireAdmin(req, res, next) {
  if (!req.session?.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Accès administrateur requis'
    });
  }
  next();
}

/**
 * Middleware pour initialiser la session
 */
function initSession(req, res, next) {
  if (!req.session) {
    req.session = {
      id: SecurityUtil.generateToken(16),
      createdAt: new Date(),
      isAdmin: false
    };
  }
  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
  initSession
};
