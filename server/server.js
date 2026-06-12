/**
 * PlayZone Server
 * Express.js server for gaming portal
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Database = require('./utils/database');
const GameController = require('./controllers/gameController');
const AdminController = require('./controllers/adminController');
const PageController = require('./controllers/pageController');
const SecurityUtil = require('./utils/security');
const SEOUtil = require('./utils/seo');

// Middleware
const {
  securityHeaders,
  apiLimiter,
  validateInput,
  corsMiddleware,
  requestLogger
} = require('./middleware/security');
const { initSession } = require('./middleware/auth');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Routes
const gamesRoutes = require('./routes/games');
const categoriesRoutes = require('./routes/categories');
const adminRoutes = require('./routes/admin');
const pagesRoutes = require('./routes/pages');

const PORT = process.env.PORT || 3000;
const app = express();
let db;

// Middleware setup
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(requestLogger);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(validateInput);
app.use(initSession);

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// API rate limiting
app.use('/api/', apiLimiter);

/**
 * Initialize Database and Routes
 */
async function initializeServer() {
  try {
    console.log('\n🚀 PlayZone Server Starting...');
    console.log('=' .repeat(50));

    // Initialize database
    db = new Database(path.join(__dirname, '../database/playzone.db'));
    await db.initialize();

    // Register routes
    app.use('/api/games', gamesRoutes(GameController));
    app.use('/api/categories', categoriesRoutes(db));
    app.use('/api/pages', pagesRoutes(PageController));
    app.use('/api/admin', adminRoutes(db, AdminController));

    // SEO Routes
    app.get('/sitemap.xml', async (req, res) => {
      try {
        const games = await db.all('SELECT slug FROM games WHERE is_active = 1');
        const categories = await db.all('SELECT slug FROM categories WHERE is_active = 1');
        const pages = await db.all('SELECT slug FROM pages WHERE is_published = 1');

        const sitemap = SEOUtil.generateSitemap(games, categories, pages);
        res.header('Content-Type', 'application/xml');
        res.send(sitemap);
      } catch (error) {
        res.status(500).send('Error generating sitemap');
      }
    });

    app.get('/robots.txt', (req, res) => {
      res.header('Content-Type', 'text/plain');
      res.send(SEOUtil.generateRobotsTxt());
    });

    // Home page
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    // Game page (for SEO)
    app.get('/game/:slug', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/game.html'));
    });

    // Category page
    app.get('/category/:slug', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    // Static pages
    app.get('/page/:slug', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/page.html'));
    });

    // Admin page
    app.get('/admin', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/admin.html'));
    });

    // Health check
    app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // API info
    app.get('/api', (req, res) => {
      res.json({
        name: 'PlayZone API',
        version: '1.0.0',
        endpoints: {
          games: '/api/games',
          categories: '/api/categories',
          pages: '/api/pages',
          admin: '/api/admin'
        }
      });
    });

    // Error handling
    app.use(notFoundHandler);
    app.use(errorHandler);

    // Start server
    app.listen(PORT, () => {
      console.log('\n✅ PlayZone Server Running!');
      console.log('=' .repeat(50));
      console.log(`📍 Server: http://localhost:${PORT}`);
      console.log(`🎮 Frontend: http://localhost:${PORT}/`);
      console.log(`🔧 Admin: http://localhost:${PORT}/admin`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
      console.log('=' .repeat(50));
      console.log('\n💡 Environment:', process.env.NODE_ENV || 'development');
      console.log('📊 Database:', path.join(__dirname, '../database/playzone.db'));
      console.log('\n🎯 Press Ctrl+C to stop the server');
    });

  } catch (error) {
    console.error('\n❌ Server Initialization Error:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down PlayZone Server...');
  if (db) {
    await db.close();
  }
  process.exit(0);
});

// Start the server
initializeServer();

module.exports = app;
