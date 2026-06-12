/**
 * Game Page Script
 * Handles individual game page functionality
 */

const api = new API();
const slug = window.location.pathname.split('/').pop();

/**
 * Initialize page
 */
async function init() {
  try {
    await loadGameDetails();
  } catch (error) {
    console.error('Error loading game:', error);
  }
}

/**
 * Load game details
 */
async function loadGameDetails() {
  try {
    const result = await api.getGameBySlug(slug);

    if (!result.success) {
      document.getElementById('gameContent').innerHTML = '<p>Jeu non trouvé</p>';
      return;
    }

    const game = result.game;

    // Update page title and meta
    document.title = `${game.title} - PlayZone`;
    document.getElementById('pageTitle').textContent = `${game.title} - PlayZone`;
    document.getElementById('pageDescription').content = game.description;

    // Display game
    document.getElementById('gameContent').innerHTML = `
      <div style="margin: 2rem 0;">
        <h1>${game.title}</h1>
        <div style="margin-bottom: 1rem;">
          <span>Par ${game.developer}</span> | 
          <span>${game.total_plays} jouées</span>
        </div>
        <div style="background-color: var(--surface-light); border-radius: var(--radius-lg); min-height: 400px; display: flex; align-items: center; justify-content: center;">
          <iframe 
            src="${game.game_url}" 
            style="width: 100%; height: 100%; border: none; border-radius: var(--radius-lg);"
            title="${game.title}"
          ></iframe>
        </div>
      </div>
    `;

    // Display details
    document.getElementById('gameDetails').innerHTML = `
      <div class="card">
        <div class="card-body">
          <h2>À Propos</h2>
          <p>${game.description}</p>
          <h3>Détails</h3>
          <ul>
            <li><strong>Développeur:</strong> ${game.developer}</li>
            <li><strong>Catégorie:</strong> ${game.category_name}</li>
            <li><strong>Date de Publication:</strong> ${new Date(game.created_at).toLocaleDateString('fr-FR')}</li>
          </ul>
        </div>
      </div>
    `;

    // Load related games
    await loadRelatedGames(game.category_id);
  } catch (error) {
    console.error('Error loading game details:', error);
    document.getElementById('gameContent').innerHTML = '<p>Erreur lors du chargement du jeu</p>';
  }
}

/**
 * Load related games
 */
async function loadRelatedGames(categoryId) {
  try {
    // Get all games in category
    const result = await api.getGamesByCategory(categoryId);
    const container = document.getElementById('relatedGames');
    
    if (result.games && result.games.length > 0) {
      container.innerHTML = result.games
        .filter(g => g.slug !== slug)
        .slice(0, 4)
        .map(game => createGameCard(game))
        .join('');
    }
  } catch (error) {
    console.error('Error loading related games:', error);
  }
}

/**
 * Create game card
 */
function createGameCard(game) {
  return `
    <div class="game-card" onclick="location.href='/game/${game.slug}'">
      <img src="${game.thumbnail || '/images/placeholder.jpg'}" alt="${game.title}" class="game-card-img">
      <div class="game-card-body">
        <div class="game-card-title">${game.title}</div>
      </div>
    </div>
  `;
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
