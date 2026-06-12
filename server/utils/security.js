/**
 * Security Utilities
 * XSS protection, input sanitization, and security helpers
 */

const crypto = require('crypto');

class SecurityUtil {
  /**
   * Sanitize HTML and prevent XSS attacks
   */
  static sanitizeHtml(text) {
    if (typeof text !== 'string') return text;
    
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Escape string for SQL queries (used with parameterized queries)
   */
  static escapeSql(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/'/g, "''");
  }

  /**
   * Validate email address
   */
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL
   */
  static validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Hash password using SHA-256
   */
  static hashPassword(password) {
    return crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
  }

  /**
   * Compare password with hash
   */
  static verifyPassword(password, hash) {
    return this.hashPassword(password) === hash;
  }

  /**
   * Generate random token
   */
  static generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    return {
      isStrong: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
      errors: {
        minLength: password.length < minLength,
        upperCase: !hasUpperCase,
        lowerCase: !hasLowerCase,
        numbers: !hasNumbers,
        specialChar: !hasSpecialChar
      }
    };
  }

  /**
   * Rate limit helper
   */
  static isRateLimited(key, maxAttempts = 5, windowMs = 900000) {
    // This is a simple implementation
    // In production, use redis or similar
    if (!this.attempts) {
      this.attempts = new Map();
    }

    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    
    // Remove old attempts
    const recentAttempts = userAttempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return true;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return false;
  }

  /**
   * Generate CSRF token
   */
  static generateCsrfToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Validate CSRF token
   */
  static validateCsrfToken(token, sessionToken) {
    return crypto.timingSafeEqual(
      Buffer.from(token),
      Buffer.from(sessionToken)
    );
  }
}

module.exports = SecurityUtil;
