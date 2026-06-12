/**
 * Cache Management Utility
 * Simple in-memory cache with TTL support
 */

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  /**
   * Set cache value with optional TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (0 = no expiry)
   */
  set(key, value, ttl = 300) {
    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    this.cache.set(key, value);

    // Set auto-expiry if TTL is specified
    if (ttl > 0) {
      const timer = setTimeout(() => {
        this.cache.delete(key);
        this.timers.delete(key);
      }, ttl * 1000);
      this.timers.set(key, timer);
    }
  }

  /**
   * Get cache value
   * @param {string} key - Cache key
   */
  get(key) {
    return this.cache.get(key);
  }

  /**
   * Check if key exists in cache
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Delete cache value
   */
  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.cache.clear();
    this.timers.clear();
  }

  /**
   * Get cache size
   */
  size() {
    return this.cache.size;
  }

  /**
   * Get all cache keys
   */
  keys() {
    return Array.from(this.cache.keys());
  }

  /**
   * Cache wrapper for functions
   */
  async wrap(key, fn, ttl = 300) {
    if (this.has(key)) {
      return this.get(key);
    }

    const result = await fn();
    this.set(key, result, ttl);
    return result;
  }
}

module.exports = new CacheManager();
