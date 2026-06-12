/**
 * Admin Controller
 * Handles administrative operations
 */

const SecurityUtil = require('../utils/security');
const SEOUtil = require('../utils/seo');

class AdminController {
  constructor(db) {
    this.db = db;
  }

  /**
   * Admin login
   */
  async login(username, password) {
    try {
      // Simple authentication (in production, use proper hashing)
      if (username !== process.env.ADMIN_USERNAME || 
          !SecurityUtil.verifyPassword(password, process.env.ADMIN_PASSWORD)) {
        return {
          success: false,
          message: 'Identifiants invalides'
        };
      }

      const token = SecurityUtil.generateToken(32);

      return {
        success: true,
        message: 'Connexion réussie',
        token,
        user: {
          username: process.env.ADMIN_USERNAME,
          role: 'admin'
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    try {
      const totalGames = await this.db.get(`SELECT COUNT(*) as count FROM games WHERE is_active = 1`);
      const totalCategories = await this.db.get(`SELECT COUNT(*) as count FROM categories WHERE is_active = 1`);
      const totalPageViews = await this.db.get(`SELECT COUNT(*) as count FROM page_views`);
      const recentViews = await this.db.get(
        `SELECT COUNT(*) as count FROM page_views WHERE timestamp > datetime('now', '-1 day')`
      );

      return {
        success: true,
        stats: {
          totalGames: totalGames.count,
          totalCategories: totalCategories.count,
          totalPageViews: totalPageViews.count,
          viewsLast24h: recentViews.count
        }
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Get all categories
   */
  async getAllCategories() {
    try {
      const categories = await this.db.all(
        `SELECT * FROM categories ORDER BY display_order ASC`
      );

      return {
        success: true,
        categories
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Create category
   */
  async createCategory(name, description, icon, color) {
    try {
      const slug = SEOUtil.createSlug(name);

      const result = await this.db.run(
        `INSERT INTO categories (name, slug, description, icon, color) VALUES (?, ?, ?, ?, ?)`,
        [name, slug, description, icon, color]
      );

      return {
        success: true,
        message: 'Catégorie créée avec succès',
        id: result.lastID
      };
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  /**
   * Update category
   */
  async updateCategory(id, name, description, icon, color) {
    try {
      await this.db.run(
        `UPDATE categories SET name = ?, description = ?, icon = ?, color = ? WHERE id = ?`,
        [name, description, icon, color, id]
      );

      return {
        success: true,
        message: 'Catégorie mise à jour avec succès'
      };
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  /**
   * Delete category
   */
  async deleteCategory(id) {
    try {
      await this.db.run(
        `UPDATE categories SET is_active = 0 WHERE id = ?`,
        [id]
      );

      return {
        success: true,
        message: 'Catégorie supprimée avec succès'
      };
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  /**
   * Get all advertisements
   */
  async getAllAds() {
    try {
      const ads = await this.db.all(
        `SELECT * FROM advertisements ORDER BY created_at DESC`
      );

      return {
        success: true,
        ads
      };
    } catch (error) {
      console.error('Error fetching ads:', error);
      throw error;
    }
  }

  /**
   * Update advertisement
   */
  async updateAd(id, name, ad_code, is_active) {
    try {
      await this.db.run(
        `UPDATE advertisements SET name = ?, ad_code = ?, is_active = ? WHERE id = ?`,
        [name, ad_code, is_active ? 1 : 0, id]
      );

      return {
        success: true,
        message: 'Publicité mise à jour avec succès'
      };
    } catch (error) {
      console.error('Error updating ad:', error);
      throw error;
    }
  }

  /**
   * Get all static pages
   */
  async getAllPages() {
    try {
      const pages = await this.db.all(
        `SELECT * FROM pages ORDER BY created_at DESC`
      );

      return {
        success: true,
        pages
      };
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
  }

  /**
   * Update static page
   */
  async updatePage(id, title, content, is_published) {
    try {
      await this.db.run(
        `UPDATE pages SET title = ?, content = ?, is_published = ? WHERE id = ?`,
        [title, content, is_published ? 1 : 0, id]
      );

      return {
        success: true,
        message: 'Page mise à jour avec succès'
      };
    } catch (error) {
      console.error('Error updating page:', error);
      throw error;
    }
  }

  /**
   * Get page views analytics
   */
  async getAnalytics(days = 30) {
    try {
      const views = await this.db.all(
        `SELECT DATE(timestamp) as date, COUNT(*) as count FROM page_views 
         WHERE timestamp > datetime('now', '-' || ? || ' days')
         GROUP BY DATE(timestamp) ORDER BY date DESC`,
        [days]
      );

      return {
        success: true,
        analytics: views
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }
}

module.exports = AdminController;
