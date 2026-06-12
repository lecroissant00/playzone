-- PlayZone Database Schema
-- SQLite3 Database for PlayZone Gaming Portal

-- Table: users
-- Stores user account information
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK(role IN ('user', 'moderator', 'admin')),
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- Table: categories
-- Game categories and classifications
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: games
-- Game information and metadata
CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  category_id INTEGER NOT NULL,
  thumbnail_url TEXT,
  banner_url TEXT,
  iframe_url TEXT,
  game_url TEXT,
  gd_game_id TEXT UNIQUE,
  developer TEXT,
  publisher TEXT,
  release_date DATE,
  rating REAL DEFAULT 0,
  total_plays INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT 0,
  is_popular BOOLEAN DEFAULT 0,
  is_new BOOLEAN DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  meta_keywords TEXT,
  meta_description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Table: advertisements
-- Ad placement configuration and management
CREATE TABLE IF NOT EXISTS advertisements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  ad_type TEXT NOT NULL CHECK(ad_type IN ('banner_top', 'banner_sidebar', 'banner_between_games', 'banner_under_player', 'interstitial', 'custom')),
  position TEXT,
  ad_code TEXT,
  google_ad_slot TEXT,
  is_active BOOLEAN DEFAULT 1,
  enable_refresh BOOLEAN DEFAULT 1,
  refresh_interval INTEGER DEFAULT 30,
  start_date DATETIME,
  end_date DATETIME,
  priority INTEGER DEFAULT 0,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: page_views
-- Analytics and visitor tracking
CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  game_id INTEGER,
  page_type TEXT,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  page_url TEXT,
  session_id TEXT,
  view_duration INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (game_id) REFERENCES games(id)
);

-- Table: pages
-- Static pages management
CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT,
  is_published BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: game_ratings
-- User ratings and reviews
CREATE TABLE IF NOT EXISTS game_ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  game_id INTEGER NOT NULL,
  rating INTEGER CHECK(rating BETWEEN 1 AND 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (game_id) REFERENCES games(id)
);

-- Table: game_plays
-- Track individual game plays
CREATE TABLE IF NOT EXISTS game_plays (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  game_id INTEGER NOT NULL,
  session_id TEXT,
  play_duration INTEGER,
  completed BOOLEAN DEFAULT 0,
  score INTEGER,
  ip_address TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (game_id) REFERENCES games(id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_games_category ON games(category_id);
CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug);
CREATE INDEX IF NOT EXISTS idx_games_gd_id ON games(gd_game_id);
CREATE INDEX IF NOT EXISTS idx_games_featured ON games(is_featured);
CREATE INDEX IF NOT EXISTS idx_games_popular ON games(is_popular);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_page_views_timestamp ON page_views(timestamp);
CREATE INDEX IF NOT EXISTS idx_page_views_game ON page_views(game_id);
CREATE INDEX IF NOT EXISTS idx_page_views_user ON page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_game_plays_game ON game_plays(game_id);
CREATE INDEX IF NOT EXISTS idx_game_plays_user ON game_plays(user_id);
CREATE INDEX IF NOT EXISTS idx_game_plays_timestamp ON game_plays(timestamp);
CREATE INDEX IF NOT EXISTS idx_game_ratings_game ON game_ratings(game_id);
CREATE INDEX IF NOT EXISTS idx_advertisements_type ON advertisements(ad_type);
