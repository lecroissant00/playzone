/**
 * Game Controller
 * Handles game-related operations
 */

const cache = require('../utils/cache');
const SEOUtil = require('../utils/seo');

class GameController {
  constructor(db) {
    this.db = db;
  }

  /**
   * Get all games with pagination
   */
  async getAllGames(page = 1, limit = 12) {
    const offset = (page - 1) * limit;
    const cacheKey = `games_page_${page}_limit_${limit}`;

    try {
      // Check cache
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const games = await this.db.all(
        `SELECT * FROM games WHERE is_active = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      const totalResult = await this.db.get(
        `SELECT COUNT(*) as total FROM games WHERE is_active = 1`
      );

      const result = {
        success: true,
        games,
        pagination: {
          page,
          limit,
          total: totalResult.total,
          totalPages: Math.ceil(totalResult.total / limit)
        }
      };

      // Cache for 1 hour
      cache.set(cacheKey, result, 3600);
      return result;
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  }

  /**
   * Get popular games
   */
  async getPopularGames(limit = 8) {
    const cacheKey = 'games_popular';

    try {
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const games = await this.db.all(
        `SELECT * FROM games WHERE is_active = 1 AND is_popular = 1 ORDER BY total_plays DESC LIMIT ?`,
        [limit]
      );

      const result = {
        success: true,
        games
      };

      cache.set(cacheKey, result, 3600);
      return result;
    } catch (error) {
      console.error('Error fetching popular games:', error);
      throw error;
    }
  }

  /**
   * Get featured games
   */
  async getFeaturedGames(limit = 5) {
    const cacheKey = 'games_featured';

    try {
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const games = await this.db.all(
        `SELECT * FROM games WHERE is_active = 1 AND is_featured = 1 ORDER BY created_at DESC LIMIT ?`,
        [limit]
      );

      const result = {
        success: true,
        games
      };

      cache.set(cacheKey, result, 3600);
      return result;
    } catch (error) {
      console.error('Error fetching featured games:', error);
      throw error;
    }
  }

  /**
   * Get new games
   */
  async getNewGames(limit = 8) {
    const cacheKey = 'games_new';

    try {
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const games = await this.db.all(
        `SELECT * FROM games WHERE is_active = 1 AND is_new = 1 ORDER BY created_at DESC LIMIT ?`,
        [limit]
      );

      const result = {
        success: true,
        games
      };

      cache.set(cacheKey, result, 3600);
      return result;
    } catch (error) {
      console.error('Error fetching new games:', error);
      throw error;
    }
  }

  /**
   * Get game by slug
   */
  async getGameBySlug(slug) {
    const cacheKey = `game_${slug}`;

    try {
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const game = await this.db.get(
        `SELECT * FROM games WHERE slug = ? AND is_active = 1`,
        [slug]
      );

      if (!game) {
        return { success: false, message: 'Jeu non trouvé' };
      }

      // Increment play count
      await this.db.run(
        `UPDATE games SET total_plays = total_plays + 1 WHERE id = ?`,
        [game.id]
      );

      // Clear cache
      cache.delete('games_popular');

      const result = {
        success: true,
        game
      };

      cache.set(cacheKey, result, 1800);
      return result;
    } catch (error) {
      console.error('Error fetching game:', error);
      throw error;
    }
  }

  /**
   * Search games
   */
  async searchGames(query, categoryId = null, page = 1, limit = 12) {
    const offset = (page - 1) * limit;
    const searchTerm = `%${query}%`;

    try {
      let sql = `SELECT * FROM games WHERE is_active = 1 AND (title LIKE ? OR description LIKE ? OR developer LIKE ?)`;
      let params = [searchTerm, searchTerm, searchTerm];

      if (categoryId) {
        sql += ` AND category_id = ?`;
        params.push(categoryId);
      }

      sql += ` ORDER BY title ASC LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const games = await this.db.all(sql, params);

      // Get total count
      let countSql = `SELECT COUNT(*) as total FROM games WHERE is_active = 1 AND (title LIKE ? OR description LIKE ? OR developer LIKE ?)`;
      let countParams = [searchTerm, searchTerm, searchTerm];

      if (categoryId) {
        countSql += ` AND category_id = ?`;
        countParams.push(categoryId);
      }

      const totalResult = await this.db.get(countSql, countParams);

      return {
        success: true,
        games,
        pagination: {
          page,
          limit,
          total: totalResult.total,
          totalPages: Math.ceil(totalResult.total / limit)
        }
      };
    } catch (error) {
      console.error('Error searching games:', error);
      throw error;
    }
  }

  /**
   * Get games by category
   */
  async getGamesByCategory(categorySlug, page = 1, limit = 12) {
    const offset = (page - 1) * limit;

    try {
      const category = await this.db.get(
        `SELECT id FROM categories WHERE slug = ? AND is_active = 1`,
        [categorySlug]
      );

      if (!category) {
        return { success: false, message: 'Catégorie non trouvée' };
      }

      const games = await this.db.all(
        `SELECT * FROM games WHERE category_id = ? AND is_active = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [category.id, limit, offset]
      );

      const totalResult = await this.db.get(
        `SELECT COUNT(*) as total FROM games WHERE category_id = ? AND is_active = 1`,
        [category.id]
      );

      return {
        success: true,
        games,
        category,
        pagination: {
          page,
          limit,
          total: totalResult.total,
          totalPages: Math.ceil(totalResult.total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching games by category:', error);
      throw error;
    }
  }
}

module.exports = GameController;
