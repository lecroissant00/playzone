/**
 * Admin Routes
 * API endpoints for administrative operations
 */

const express = require('express');
const router = express.Router();
const { requireAdmin, loginLimiter } = require('../middleware/security');

module.exports = (db, AdminController) => {
  const adminController = new AdminController(db);

  /**
   * POST /api/admin/login
   * Admin login
   */
  router.post('/login', loginLimiter, async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username et password requis'
        });
      }

      const result = await adminController.login(username, password);
      
      if (result.success) {
        // Set admin session
        req.session.isAdmin = true;
        req.session.adminId = 1; // In production, use actual admin ID
        req.session.adminToken = result.token;
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/admin/dashboard
   * Get dashboard statistics
   */
  router.get('/dashboard', requireAdmin, async (req, res, next) => {
    try {
      const result = await adminController.getDashboardStats();
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/admin/categories
   * Get all categories
   */
  router.get('/categories', requireAdmin, async (req, res, next) => {
    try {
      const result = await adminController.getAllCategories();
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  /**
   * POST /api/admin/categories
   * Create category
   */
  router.post('/categories', requireAdmin, async (req, res, next) => {
    try {
      const { name, description, icon, color } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Nom de catégorie requis'
        });
      }

      const result = await adminController.createCategory(name, description, icon, color);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  /**
   * PUT /api/admin/categories/:id
   * Update category
   */
  router.put('/categories/:id', requireAdmin, async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description, icon, color } = req.body;

      const result = await adminController.updateCategory(id, name, description, icon, color);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  /**
   * DELETE /api/admin/categories/:id
   * Delete category
   */
  router.delete('/categories/:id', requireAdmin, async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await adminController.deleteCategory(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/admin/ads
   * Get all advertisements
   */
  router.get('/ads', requireAdmin, async (req, res, next) => {
    try {
      const result = await adminController.getAllAds();
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  /**
   * PUT /api/admin/ads/:id
   * Update advertisement
   */
  router.put('/ads/:id', requireAdmin, async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, ad_code, is_active } = req.body;

      const result = await adminController.updateAd(id, name, ad_code, is_active);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/admin/pages
   * Get all pages
   */
  router.get('/pages', requireAdmin, async (req, res, next) => {
    try {
      const result = await adminController.getAllPages();
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  /**
   * PUT /api/admin/pages/:id
   * Update page
   */
  router.put('/pages/:id', requireAdmin, async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, content, is_published } = req.body;

      const result = await adminController.updatePage(id, title, content, is_published);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/admin/analytics
   * Get analytics
   */
  router.get('/analytics', requireAdmin, async (req, res, next) => {
    try {
      const days = parseInt(req.query.days) || 30;
      const result = await adminController.getAnalytics(days);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
