/**
 * Pages Routes
 * API endpoints for static pages
 */

const express = require('express');
const router = express.Router();

module.exports = (PageController) => {
  const pageController = new PageController();

  /**
   * GET /api/pages/:slug
   * Get page by slug
   */
  router.get('/:slug', async (req, res, next) => {
    try {
      const { slug } = req.params;
      const result = await pageController.getPageBySlug(slug);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/pages
   * Get all published pages
   */
  router.get('/', async (req, res, next) => {
    try {
      const result = await pageController.getAllPages();
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
