/**
 * API Client
 * Handles all API calls to the backend
 */

class API {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
  }

  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('adminToken') && {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        })
      }
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur API');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Games
  getGames(page = 1, limit = 12) {
    return this.request(`/games?page=${page}&limit=${limit}`);
  }

  getPopularGames(limit = 8) {
    return this.request(`/games/popular?limit=${limit}`);
  }

  getFeaturedGames(limit = 5) {
    return this.request(`/games/featured?limit=${limit}`);
  }

  getNewGames(limit = 8) {
    return this.request(`/games/new?limit=${limit}`);
  }

  getGameBySlug(slug) {
    return this.request(`/games/${slug}`);
  }

  searchGames(query, page = 1, limit = 12) {
    return this.request(`/games/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  }

  getGamesByCategory(slug, page = 1, limit = 12) {
    return this.request(`/games/category/${slug}?page=${page}&limit=${limit}`);
  }

  // Categories
  getCategories() {
    return this.request('/categories');
  }

  getCategoryBySlug(slug) {
    return this.request(`/categories/${slug}`);
  }

  // Pages
  getPageBySlug(slug) {
    return this.request(`/pages/${slug}`);
  }

  getAllPages() {
    return this.request('/pages');
  }

  // Admin
  adminLogin(username, password) {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  }

  getDashboardStats() {
    return this.request('/admin/dashboard');
  }

  getAllCategories() {
    return this.request('/admin/categories');
  }

  createCategory(name, description, icon, color) {
    return this.request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify({ name, description, icon, color })
    });
  }

  updateCategory(id, name, description, icon, color) {
    return this.request(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, description, icon, color })
    });
  }

  deleteCategory(id) {
    return this.request(`/admin/categories/${id}`, {
      method: 'DELETE'
    });
  }

  getAllAds() {
    return this.request('/admin/ads');
  }

  updateAd(id, name, ad_code, is_active) {
    return this.request(`/admin/ads/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, ad_code, is_active })
    });
  }

  getAllPages() {
    return this.request('/admin/pages');
  }

  updatePage(id, title, content, is_published) {
    return this.request(`/admin/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content, is_published })
    });
  }

  getAnalytics(days = 30) {
    return this.request(`/admin/analytics?days=${days}`);
  }
}

// Global API instance
const api = new API();
