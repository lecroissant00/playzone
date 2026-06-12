/**
 * Games Routes
 * API endpoints for game-related operations
 */

const express = require('express');
const router = express.Router();

module.exports = (GameController) => {
  const gameController = new GameController();

  /**
   * GET /api/games
   * Get all games with pagination
   */
  router.get('/', async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;

      const result = await gameController.getAllGames(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/games/popular
   * Get popular games
   */
  router.get('/popular', async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 8;
      const result = await gameController.getPopularGames(limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/games/featured
   * Get featured games
   */
  router.get('/featured', async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const result = await gameController.getFeaturedGames(limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/games/new
   * Get new games
   */
  router.get('/new', async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 8;
      const result = await gameController.getNewGames(limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/games/search
   * Search games
   */
  router.get('/search', async (req, res, next) => {
    try {
      const query = req.query.q || '';
      const categoryId = req.query.category || null;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Paramètre de recherche requis'
        });
      }

      const result = await gameController.searchGames(query, categoryId, page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/games/category/:slug
   * Get games by category
   */
  router.get('/category/:slug', async (req, res, next) => {
    try {
      const { slug } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;

      const result = await gameController.getGamesByCategory(slug, page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/games/:slug
   * Get game by slug
   */
  router.get('/:slug', async (req, res, next) => {
    try {
      const { slug } = req.params;
      const result = await gameController.getGameBySlug(slug);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
