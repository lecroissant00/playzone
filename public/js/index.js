/**
 * Index Page Script
 * Handles home page functionality
 */

const api = new API();

/**
 * Initialize page
 */
async function init() {
  try {
    await loadFeaturedGames();
    await loadPopularGames();
    await loadNewGames();
    await loadCategories();
  } catch (error) {
    console.error('Error loading page:', error);
  }
}

/**
 * Load featured games
 */
async function loadFeaturedGames() {
  try {
    const result = await api.getFeaturedGames(5);
    const container = document.getElementById('featuredGames');
    container.innerHTML = result.games.map(game => createGameCard(game)).join('');
  } catch (error) {
    console.error('Error loading featured games:', error);
  }
}

/**
 * Load popular games
 */
async function loadPopularGames() {
  try {
    const result = await api.getPopularGames(8);
    const container = document.getElementById('popularGames');
    container.innerHTML = result.games.map(game => createGameCard(game)).join('');
  } catch (error) {
    console.error('Error loading popular games:', error);
  }
}

/**
 * Load new games
 */
async function loadNewGames() {
  try {
    const result = await api.getNewGames(8);
    const container = document.getElementById('newGames');
    container.innerHTML = result.games.map(game => createGameCard(game)).join('');
  } catch (error) {
    console.error('Error loading new games:', error);
  }
}

/**
 * Load categories
 */
async function loadCategories() {
  try {
    const result = await api.getCategories();
    const container = document.getElementById('categoriesList');
    container.innerHTML = result.categories.map(cat => `
      <div class="col-3">
        <div class="card text-center" onclick="location.href='/category/${cat.slug}'">
          <div style="font-size: 3rem; padding: 2rem;">${cat.icon}</div>
          <div class="card-body">
            <h4 class="card-title">${cat.name}</h4>
            <p class="card-text">${cat.description || ''}</p>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

/**
 * Create game card HTML
 */
function createGameCard(game) {
  return `
    <div class="game-card" onclick="location.href='/game/${game.slug}'">
      <img src="${game.thumbnail || '/images/placeholder.jpg'}" alt="${game.title}" class="game-card-img">
      ${game.is_featured ? '<span class="game-card-badge">⭐ En Vedette</span>' : ''}
      ${game.is_new ? '<span class="game-card-badge">✨ Nouveau</span>' : ''}
      <div class="game-card-body">
        <div class="game-card-title">${game.title}</div>
        <div class="game-card-rating">
          <span class="stars">★★★★★</span>
          <span>${game.total_plays || 0} jouées</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Search games
 */
document.getElementById('searchBtn')?.addEventListener('click', async () => {
  const query = document.getElementById('searchInput').value;
  if (!query.trim()) return;

  try {
    const result = await api.searchGames(query);
    // Redirect to search results page or display results
    console.log('Search results:', result);
  } catch (error) {
    console.error('Search error:', error);
  }
});

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
