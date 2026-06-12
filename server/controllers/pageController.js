/**
 * Page Controller
 * Handles static pages and content
 */

const cache = require('../utils/cache');

class PageController {
  constructor(db) {
    this.db = db;
  }

  /**
   * Get page by slug
   */
  async getPageBySlug(slug) {
    const cacheKey = `page_${slug}`;

    try {
      // Check cache
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const page = await this.db.get(
        `SELECT * FROM pages WHERE slug = ? AND is_published = 1`,
        [slug]
      );

      if (!page) {
        return { success: false, message: 'Page non trouvée' };
      }

      const result = {
        success: true,
        page
      };

      // Cache for 1 week
      cache.set(cacheKey, result, 604800);
      return result;
    } catch (error) {
      console.error('Error fetching page:', error);
      throw error;
    }
  }

  /**
   * Get all published pages
   */
  async getAllPages() {
    const cacheKey = 'all_pages';

    try {
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const pages = await this.db.all(
        `SELECT id, title, slug FROM pages WHERE is_published = 1 ORDER BY created_at DESC`
      );

      const result = {
        success: true,
        pages
      };

      cache.set(cacheKey, result, 604800);
      return result;
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
  }
}

module.exports = PageController;
