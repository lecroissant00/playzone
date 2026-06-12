/**
 * Database Initialization Script
 * Creates all tables and inserts initial data
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'playzone.db');

// Check if database already exists
const dbExists = fs.existsSync(dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
});

// Read and execute schema
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, (err) => {
  if (err) {
    console.error('Error executing schema:', err);
    process.exit(1);
  }
  console.log('✅ Database schema created successfully');

  // Insert initial data
  insertInitialData();
});

/**
 * Insert initial data into the database
 */
function insertInitialData() {
  db.serialize(() => {
    // Check if categories already exist
    db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
      if (row.count === 0) {
        console.log('Inserting initial categories...');
        const categories = [
          { name: 'Action', slug: 'action', description: 'Jeux d\'action rapides et dynamiques', icon: '⚔️', color: '#FF6B6B' },
          { name: 'Puzzle', slug: 'puzzle', description: 'Jeux de réflexion et d\'énigmes', icon: '🧩', color: '#4ECDC4' },
          { name: 'Aventure', slug: 'aventure', description: 'Jeux d\'aventure et exploration', icon: '🗺️', color: '#45B7D1' },
          { name: 'Casual', slug: 'casual', description: 'Jeux décontractés et relaxants', icon: '☺️', color: '#96CEB4' },
          { name: 'Sports', slug: 'sports', description: 'Jeux de sport et compétition', icon: '⚽', color: '#FFEAA7' },
          { name: 'Stratégie', slug: 'strategie', description: 'Jeux de stratégie et tactique', icon: '♟️', color: '#DFE6E9' },
          { name: 'Arcade', slug: 'arcade', description: 'Jeux arcade classiques', icon: '👾', color: '#A29BFE' },
          { name: 'Educatif', slug: 'educatif', description: 'Jeux éducatifs et instructifs', icon: '📚', color: '#FAB1A0' }
        ];

        categories.forEach((cat, index) => {
          db.run(
            'INSERT INTO categories (name, slug, description, icon, color, display_order) VALUES (?, ?, ?, ?, ?, ?)',
            [cat.name, cat.slug, cat.description, cat.icon, cat.color, index],
            (err) => {
              if (err) console.error('Error inserting category:', err);
            }
          );
        });
      }
    });

    // Check if games already exist
    db.get('SELECT COUNT(*) as count FROM games', (err, row) => {
      if (row.count === 0) {
        console.log('Inserting initial games...');
        const games = [
          {
            title: 'Flappy Bird',
            slug: 'flappy-bird',
            description: 'Le jeu arcade classique',
            category_id: 7,
            is_popular: true,
            rating: 4.5,
            developer: 'Game Developer',
            thumbnail_url: '/images/games/flappy-bird.jpg'
          },
          {
            title: 'Tetris Master',
            slug: 'tetris-master',
            description: 'Variante moderne de Tetris',
            category_id: 2,
            is_popular: true,
            rating: 4.7,
            developer: 'Game Developer',
            thumbnail_url: '/images/games/tetris.jpg'
          },
          {
            title: 'Spider Solitaire',
            slug: 'spider-solitaire',
            description: 'Jeu de cartes classique',
            category_id: 4,
            is_featured: true,
            rating: 4.3,
            developer: 'Card Game Studio',
            thumbnail_url: '/images/games/spider-solitaire.jpg'
          },
          {
            title: 'Chess Pro',
            slug: 'chess-pro',
            description: 'Jeu d\'échecs avec IA',
            category_id: 6,
            is_featured: true,
            rating: 4.6,
            developer: 'Strategy Games Inc',
            thumbnail_url: '/images/games/chess.jpg'
          },
          {
            title: 'Space Shooter',
            slug: 'space-shooter',
            description: 'Jeu de tir spatial',
            category_id: 1,
            is_new: true,
            rating: 4.4,
            developer: 'Action Games',
            thumbnail_url: '/images/games/space-shooter.jpg'
          },
          {
            title: 'Memory Match',
            slug: 'memory-match',
            description: 'Jeu de mémoire classique',
            category_id: 2,
            rating: 4.2,
            developer: 'Puzzle Games',
            thumbnail_url: '/images/games/memory.jpg'
          }
        ];

        games.forEach((game) => {
          db.run(
            `INSERT INTO games (
              title, slug, description, category_id, is_popular, is_featured,
              is_new, rating, developer, thumbnail_url, total_plays
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              game.title,
              game.slug,
              game.description,
              game.category_id,
              game.is_popular ? 1 : 0,
              game.is_featured ? 1 : 0,
              game.is_new ? 1 : 0,
              game.rating,
              game.developer,
              game.thumbnail_url,
              Math.floor(Math.random() * 1000) + 100
            ],
            (err) => {
              if (err) console.error('Error inserting game:', err);
            }
          );
        });
      }
    });

    // Check if pages already exist
    db.get('SELECT COUNT(*) as count FROM pages', (err, row) => {
      if (row.count === 0) {
        console.log('Inserting initial pages...');
        const pages = [
          {
            title: 'À Propos',
            slug: 'about',
            content: '<h2>À Propos de PlayZone</h2><p>PlayZone est votre destination ultime pour les jeux HTML5 gratuits. Nous rassemblons les meilleurs jeux de partout dans le monde.</p>'
          },
          {
            title: 'Politique de Confidentialité',
            slug: 'privacy',
            content: '<h2>Politique de Confidentialité</h2><p>Nous respectons votre vie privée et protégeons vos données personnelles conformément aux lois applicables.</p>'
          },
          {
            title: 'Conditions d\'Utilisation',
            slug: 'terms',
            content: '<h2>Conditions d\'Utilisation</h2><p>En utilisant PlayZone, vous acceptez nos conditions d\'utilisation. Veuillez les lire attentivement.</p>'
          },
          {
            title: 'Contact',
            slug: 'contact',
            content: '<h2>Nous Contacter</h2><p>Pour toute question, veuillez nous contacter à support@playzone.local</p>'
          },
          {
            title: 'DMCA',
            slug: 'dmca',
            content: '<h2>Politique DMCA</h2><p>Si vous pensez que votre contenu protégé par le droit d\'auteur a été utilisé sans autorisation, veuillez nous le signaler.</p>'
          }
        ];

        pages.forEach((page) => {
          db.run(
            'INSERT INTO pages (title, slug, content, is_published) VALUES (?, ?, ?, ?)',
            [page.title, page.slug, page.content, 1],
            (err) => {
              if (err) console.error('Error inserting page:', err);
            }
          );
        });
      }
    });

    // Insert initial advertisements
    db.get('SELECT COUNT(*) as count FROM advertisements', (err, row) => {
      if (row.count === 0) {
        console.log('Inserting initial advertisements...');
        const ads = [
          {
            name: 'Top Banner',
            ad_type: 'banner_top',
            position: 'top',
            is_active: true
          },
          {
            name: 'Sidebar Ad',
            ad_type: 'banner_sidebar',
            position: 'right',
            is_active: true
          },
          {
            name: 'Between Games',
            ad_type: 'banner_between_games',
            position: 'center',
            is_active: true
          },
          {
            name: 'Under Player',
            ad_type: 'banner_under_player',
            position: 'under-iframe',
            is_active: true
          }
        ];

        ads.forEach((ad) => {
          db.run(
            'INSERT INTO advertisements (name, ad_type, position, is_active) VALUES (?, ?, ?, ?)',
            [ad.name, ad.ad_type, ad.position, ad.is_active ? 1 : 0],
            (err) => {
              if (err) console.error('Error inserting ad:', err);
            }
          );
        });
      }
    });
  });

  // Close database after a short delay to ensure all inserts complete
  setTimeout(() => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
        process.exit(1);
      }
      console.log('✅ Database initialized successfully');
      console.log('📁 Database path:', dbPath);
      console.log('\n🎮 PlayZone database is ready!');
      process.exit(0);
    });
  }, 1000);
}
