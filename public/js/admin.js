/**
 * Admin Page Script
 * Handles admin dashboard functionality
 */

const api = new API();

/**
 * Initialize page
 */
async function init() {
  // Check if already logged in
  const token = localStorage.getItem('adminToken');
  if (token) {
    showAdminPanel();
  } else {
    showLoginForm();
  }
}

/**
 * Show login form
 */
function showLoginForm() {
  document.getElementById('loginSection').classList.remove('hidden');
  document.getElementById('dashboardSection').classList.add('hidden');
  document.querySelector('.admin-layout').style.display = 'none';

  document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
}

/**
 * Show admin panel
 */
function showAdminPanel() {
  document.getElementById('loginSection').classList.add('hidden');
  document.querySelector('.admin-layout').style.display = 'flex';
  showSection('dashboard');
}

/**
 * Handle login
 */
async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const result = await api.adminLogin(username, password);
    if (result.success) {
      localStorage.setItem('adminToken', result.token);
      showAdminPanel();
    } else {
      alert('Erreur de connexion: ' + result.message);
    }
  } catch (error) {
    alert('Erreur: ' + error.message);
  }
}

/**
 * Show section
 */
function showSection(section) {
  // Hide all sections
  document.querySelectorAll('[id$="Section"]').forEach(el => {
    el.classList.add('hidden');
  });

  // Remove active class
  document.querySelectorAll('.admin-nav-item').forEach(el => {
    el.classList.remove('active');
  });

  // Show selected section
  const sectionId = section + 'Section';
  const sectionEl = document.getElementById(sectionId);
  if (sectionEl) {
    sectionEl.classList.remove('hidden');
  }

  // Add active class to clicked nav item
  event.target.classList.add('active');

  // Load section data
  switch (section) {
    case 'dashboard':
      loadDashboard();
      break;
    case 'categories':
      loadCategories();
      break;
    case 'ads':
      loadAds();
      break;
    case 'pages':
      loadPages();
      break;
    case 'analytics':
      loadAnalytics();
      break;
  }
}

/**
 * Load dashboard
 */
async function loadDashboard() {
  try {
    const result = await api.getDashboardStats();
    const stats = result.stats;

    document.getElementById('statsGrid').innerHTML = `
      <div class="stat-box">
        <div class="number">${stats.totalGames}</div>
        <div class="label">Jeux Actifs</div>
      </div>
      <div class="stat-box">
        <div class="number">${stats.totalCategories}</div>
        <div class="label">Catégories</div>
      </div>
      <div class="stat-box">
        <div class="number">${stats.totalPageViews}</div>
        <div class="label">Vues Totales</div>
      </div>
      <div class="stat-box">
        <div class="number">${stats.viewsLast24h}</div>
        <div class="label">Vues (24h)</div>
      </div>
    `;
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

/**
 * Load categories
 */
async function loadCategories() {
  try {
    const result = await api.getAllCategories();
    const list = document.getElementById('categoriesList');

    list.innerHTML = result.categories.map(cat => `
      <tr>
        <td>${cat.name}</td>
        <td>${cat.icon}</td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="editCategory(${cat.id})">Éditer</button>
          <button class="btn btn-sm btn-outline" onclick="deleteCategory(${cat.id})">Supprimer</button>
        </td>
      </tr>
    `).join('');

    document.getElementById('categoryForm')?.addEventListener('submit', handleCategorySubmit);
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

/**
 * Handle category form submit
 */
async function handleCategorySubmit(e) {
  e.preventDefault();

  const name = document.getElementById('catName').value;
  const description = document.getElementById('catDesc').value;
  const icon = document.getElementById('catIcon').value;

  try {
    const result = await api.createCategory(name, description, icon, '#6200ea');
    if (result.success) {
      alert('Catégorie créée avec succès!');
      document.getElementById('categoryForm').reset();
      loadCategories();
    }
  } catch (error) {
    alert('Erreur: ' + error.message);
  }
}

/**
 * Load ads
 */
async function loadAds() {
  try {
    const result = await api.getAllAds();
    const list = document.getElementById('adsList');

    list.innerHTML = result.ads.map(ad => `
      <tr>
        <td>${ad.name}</td>
        <td>${ad.is_active ? '✓ Actif' : '✗ Inactif'}</td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="editAd(${ad.id})">Éditer</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading ads:', error);
  }
}

/**
 * Load pages
 */
async function loadPages() {
  try {
    const result = await api.getAllPages();
    const list = document.getElementById('pagesList');

    list.innerHTML = result.pages.map(page => `
      <tr>
        <td>${page.title}</td>
        <td>${page.slug}</td>
        <td>${page.is_published ? '✓ Publié' : '✗ Brouillon'}</td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="editPage(${page.id})">Éditer</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading pages:', error);
  }
}

/**
 * Load analytics
 */
async function loadAnalytics() {
  try {
    const result = await api.getAnalytics(30);
    console.log('Analytics:', result);
    // In production, use a charting library like Chart.js
  } catch (error) {
    console.error('Error loading analytics:', error);
  }
}

/**
 * Logout
 */
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem('adminToken');
  location.reload();
});

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
