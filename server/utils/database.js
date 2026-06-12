/**
 * Database Connection Module
 * Handles SQLite3 database operations with connection pooling
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
  constructor(dbPath = null) {
    this.dbPath = dbPath || path.join(__dirname, 'playzone.db');
    this.db = null;
    this.isReady = false;
  }

  /**
   * Initialize database connection
   */
  initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('❌ Database connection error:', err);
          reject(err);
        } else {
          console.log('✅ Database connected:', this.dbPath);
          this.isReady = true;
          // Enable foreign keys
          this.db.run('PRAGMA foreign_keys = ON');
          resolve(this);
        }
      });
    });
  }

  /**
   * Run a query and return results
   */
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Run a query and return single result
   */
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  /**
   * Run an insert/update/delete query
   */
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({
          lastID: this.lastID,
          changes: this.changes
        });
      });
    });
  }

  /**
   * Close database connection
   */
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) reject(err);
          else {
            console.log('✅ Database closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = Database;
