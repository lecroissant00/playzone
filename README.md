# PlayZone - Portail de Jeux HTML5 Moderne

![PlayZone](https://img.shields.io/badge/PlayZone-v1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node->=14.0.0-green)

PlayZone est un portail de jeux HTML5 moderne avec intégration GameDistribution et monétisation Google AdSense. Conçu avec une architecture moderne, design responsive et sécurité renforcée.

## 🎮 Fonctionnalités

### Frontend
- ✅ Design responsive (mobile, tablette, desktop)
- ✅ Thème sombre moderne et elegant
- ✅ Interface utilisateur intuitive
- ✅ Lazy loading des images
- ✅ Recherche et filtrage de jeux
- ✅ Catégorisation complète

### Backend
- ✅ API REST complète
- ✅ Authentification admin sécurisée
- ✅ Gestion des données avec SQLite
- ✅ Caching optimisé
- ✅ Protection XSS et injection SQL
- ✅ Rate limiting

### GameDistribution
- ✅ Intégration SDK officiel
- ✅ Chargement dynamique des jeux
- ✅ Lecteur intégré (iframe)
- ✅ Affichage des métadonnées
- ✅ Pages de jeu dédiées

### Monétisation
- ✅ Google AdSense intégré
- ✅ Placements stratégiques
- ✅ Configuration flexible
- ✅ Optimisation des revenus

### SEO & Performance
- ✅ Meta tags dynamiques
- ✅ Sitemap.xml automatique
- ✅ robots.txt
- ✅ Open Graph
- ✅ Optimisation Core Web Vitals

### Administration
- ✅ Tableau de bord complet
- ✅ Gestion des catégories
- ✅ Gestion des pages statiques
- ✅ Gestion des emplacements publicitaires
- ✅ Statistiques de visites

## 📋 Prérequis

- Node.js >= 14.0.0
- npm ou yarn
- Un navigateur moderne
- (Optionnel) Clés GameDistribution et Google AdSense

## 🚀 Installation

### 1. Cloner le dépôt
```bash
git clone https://github.com/lecroissant00/playzone.git
cd playzone
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'environnement
```bash
cp .env.example .env
```

Modifiez `.env` avec vos valeurs :
- `GAMEDISTRIBUTION_APP_ID` : Votre ID d'application GameDistribution
- `GOOGLE_ADSENSE_PUBLISHER_ID` : Votre ID Google AdSense
- `ADMIN_PASSWORD` : Mot de passe admin sécurisé

### 4. Initialiser la base de données
```bash
npm run init-db
```

### 5. Démarrer le serveur

**Mode développement :**
```bash
npm run dev
```

**Mode production :**
```bash
npm start
```

Le serveur démarrera sur `http://localhost:3000`

## 📁 Structure du Projet

```
playzone/
├── public/                      # Fichiers statiques
│   ├── css/                    # Feuilles de style
│   │   ├── styles.css         # Styles principaux
│   │   └── responsive.css     # Media queries
│   ├── js/                     # Scripts frontend
│   │   ├── main.js            # Script principal
│   │   ├── game-loader.js     # Chargeur de jeux
│   │   ├── ads.js             # Gestion AdSense
│   │   └── utils.js           # Utilitaires
│   ├── images/                 # Images
│   └── index.html              # Page d'accueil
├── server/                      # Code serveur
│   ├── server.js               # Serveur Express
│   ├── middleware/             # Middlewares
│   │   ├── auth.js            # Authentification
│   │   ├── security.js        # Sécurité
│   │   └── errorHandler.js    # Gestion erreurs
│   ├── routes/                 # Routes API
│   │   ├── games.js           # Routes jeux
│   │   ├── categories.js      # Routes catégories
│   │   ├── admin.js           # Routes admin
│   │   └── pages.js           # Routes pages statiques
│   ├── controllers/            # Logique métier
│   │   ├── gameController.js  # Contrôleur jeux
│   │   ├── adminController.js # Contrôleur admin
│   │   └── pageController.js  # Contrôleur pages
│   └── utils/                  # Utilitaires serveur
│       ├── database.js         # Connexion DB
│       ├── seo.js             # Génération SEO
│       └── cache.js           # Gestion cache
├── database/                    # Base de données
│   ├── init.js                 # Initialisation
│   ├── schema.sql             # Schéma DB
│   └── playzone.db            # Base de données
├── views/                       # Templates HTML
│   ├── base.html              # Template base
│   ├── home.html              # Page d'accueil
│   ├── game.html              # Page du jeu
│   ├── admin.html             # Page admin
│   ├── contact.html           # Contact
│   ├── privacy.html           # Politique de confidentialité
│   ├── terms.html             # Conditions d'utilisation
│   ├── about.html             # À propos
│   └── dmca.html              # DMCA
├── logs/                        # Fichiers de log
├── package.json                 # Dépendances
├── .env.example                 # Exemple d'env
├── .gitignore                   # Fichiers ignorés
├── README.md                    # Ce fichier
└── INSTALLATION.md              # Guide d'installation détaillé
```

## 🔐 Sécurité

### Headers de sécurité
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options (Protection contre le clickjacking)
- X-Content-Type-Options (MIME type sniffing)
- Content-Security-Policy (XSS protection)
- X-XSS-Protection

### Protection des données
- Validation des inputs
- Sanitization des données
- Preparation des requêtes SQL
- Rate limiting
- CORS configurable

### Authentification
- Hachage des mots de passe
- Sessions sécurisées
- Tokens JWT (optionnel)
- Protection CSRF

## 📊 Utilisation de l'API

### Récupérer les jeux populaires
```bash
GET /api/games/popular
```

### Récupérer les catégories
```bash
GET /api/categories
```

### Rechercher des jeux
```bash
GET /api/games/search?q=query&category=action
```

### Récupérer les détails d'un jeu
```bash
GET /api/games/:id
```

### Connexion admin
```bash
POST /api/admin/login
Body: { username: "admin", password: "password" }
```

### Ajouter une catégorie (Admin)
```bash
POST /api/admin/categories
Headers: { Authorization: "Bearer token" }
Body: { name: "Action", description: "Jeux d'action" }
```

## 🎨 Personnalisation

### Couleurs du thème
Modifiez les variables CSS dans `public/css/styles.css` :
```css
:root {
  --primary-color: #6200ea;
  --secondary-color: #03dac6;
  --background-dark: #121212;
  --surface-dark: #1e1e1e;
}
```

### Configuration des publicités
Dans `.env` :
```env
GOOGLE_ADSENSE_PUBLISHER_ID=ca-pub-xxxxxxxxxxxxxxxx
```

Ou via l'interface admin pour plus de flexibilité.

### Configuration GameDistribution
Dans `.env` :
```env
GAMEDISTRIBUTION_APP_ID=YOUR_APP_ID_HERE
```

## 📈 Performance

- Lazy loading des images
- Caching des réponses API
- Compression gzip
- Minification CSS/JS
- Optimisation des images
- CDN prêt (à configurer)

## 🛠️ Développement

### Démarrage en mode développement avec auto-reload
```bash
npm run dev
```

### Logs
Les logs sont stockés dans `logs/` avec rotation automatique.

### Debugging
Definissez `DEBUG=playzone:*` :
```bash
DEBUG=playzone:* npm run dev
```

## 📚 Documentation

- [INSTALLATION.md](./INSTALLATION.md) - Guide d'installation détaillé
- [API.md](./API.md) - Documentation API complète
- [ADMIN.md](./ADMIN.md) - Guide administrateur
- [CONFIGURATION.md](./CONFIGURATION.md) - Configuration avancée

## 🐛 Dépannage

### Le port 3000 est occupé
```bash
PORT=3001 npm start
```

### Erreur de base de données
```bash
npm run init-db
```

### Les images ne s'affichent pas
Vérifiez que le dossier `public/images/` existe et contient les images.

## 📝 Licences

- PlayZone : MIT
- GameDistribution SDK : Voir leurs conditions
- Google AdSense : Voir leurs conditions

## 🤝 Contribution

Les contributions sont bienvenues ! Veuillez :
1. Forker le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commiter vos changements (`git commit -m 'Add AmazingFeature'`)
4. Pousser vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📧 Support

Pour toute question ou problème, contactez : support@playzone.local

## 📅 Changelog

### v1.0.0 (2026-06-12)
- 🎉 Lancement initial
- ✅ Intégration GameDistribution
- ✅ Monétisation Google AdSense
- ✅ Tableau de bord admin complet
- ✅ SEO optimisé
- ✅ Design responsive

## ⭐ Remerciements

Merci à GameDistribution et Google pour leurs excellents SDK !

---

**PlayZone** - Votre portail de jeux préféré 🎮
