/**
 * Categories Routes
 * API endpoints for category-related operations
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  /**
   * GET /api/categories
   * Get all active categories
   */
  router.get('/', async (req, res, next) => {
    try {
      const categories = await db.all(
        `SELECT id, name, slug, icon, color, description FROM categories WHERE is_active = 1 ORDER BY display_order ASC`
      );

      res.json({
        success: true,
        categories
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/categories/:slug
   * Get category by slug
   */
  router.get('/:slug', async (req, res, next) => {
    try {
      const { slug } = req.params;
      const category = await db.get(
        `SELECT * FROM categories WHERE slug = ? AND is_active = 1`,
        [slug]
      );

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Catégorie non trouvée'
        });
      }

      res.json({
        success: true,
        category
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
