# Guide d'Installation - PlayZone

## Prérequis

### Système
- Windows, macOS ou Linux
- Node.js 14.0.0 ou supérieur
- npm 6.0.0 ou supérieur
- 500 MB d'espace disque disponible

### Vérification de Node.js
```bash
node --version  # Devrait afficher v14.0.0 ou supérieur
npm --version   # Devrait afficher 6.0.0 ou supérieur
```

## Installation Pas à Pas

### 1. Cloner le dépôt

```bash
git clone https://github.com/lecroissant00/playzone.git
cd playzone
```

### 2. Installer les dépendances

```bash
npm install
```

Cela installera :
- **express** : Framework web
- **sqlite3** : Base de données
- **dotenv** : Gestion des variables d'environnement
- **helmet** : Sécurité HTTP
- **cors** : Cross-Origin Resource Sharing
- **body-parser** : Parsing des requêtes
- **express-rate-limit** : Limitation de débit
- **nodemon** : Auto-reload en développement

### 3. Configuration de l'environnement

#### Créer le fichier .env
```bash
cp .env.example .env
```

#### Éditer .env avec vos paramètres
```env
# Configuration du serveur
PORT=3000
NODE_ENV=development

# Configuration GameDistribution
GAMEDISTRIBUTION_APP_ID=YOUR_APP_ID_HERE

# Configuration Google AdSense
GOOGLE_ADSENSE_PUBLISHER_ID=ca-pub-xxxxxxxxxxxxxxxx

# Configuration Admin (à changer en production !)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_SECRET_KEY=your_secret_key_here_min_32_chars

# Configuration Database
DATABASE_PATH=./database/playzone.db

# Configuration CORS
CORS_ORIGIN=http://localhost:3000
```

### 4. Initialiser la base de données

```bash
npm run init-db
```

Ce script :
- Crée le dossier `database/`
- Crée le fichier `playzone.db`
- Initialise toutes les tables
- Ajoute des données de test

### 5. Vérifier l'installation

Vérifiez que le fichier de base de données a été créé :
```bash
ls -la database/
# Devrait afficher playzone.db
```

## Démarrage

### Mode Développement

```bash
npm run dev
```

Le serveur démarrera avec :
- Auto-reload lors des changements de fichiers
- Messages de log détaillés
- Mode debug activé

### Mode Production

```bash
NODE_ENV=production npm start
```

## Vérifier que tout fonctionne

### 1. Accéder à la page d'accueil
```
http://localhost:3000
```

Vous devriez voir la page d'accueil PlayZone avec :
- Hero section
- Jeux populaires
- Catégories
- Barre de recherche

### 2. Vérifier l'API
```bash
curl http://localhost:3000/api/games
```

Devrait retourner une réponse JSON avec les jeux.

### 3. Accéder au panel admin
```
http://localhost:3000/admin
```

Identifiants par défaut :
- Username: `admin`
- Password: `admin` (à changer !)

## Configuration GameDistribution

### Obtenir votre App ID

1. Allez sur [GameDistribution.com](https://gamedistribution.com)
2. Créez un compte développeur
3. Créez une nouvelle application
4. Récupérez votre **App ID**
5. Mettez à jour votre `.env` :
```env
GAMEDISTRIBUTION_APP_ID=YOUR_APP_ID_HERE
```

### Configuration dans le code

Le SDK GameDistribution est chargé dans `public/js/game-loader.js` :

```javascript
const gd = window.gd || {};
gd.appId = process.env.GAMEDISTRIBUTION_APP_ID;
```

## Configuration Google AdSense

### Obtenir votre Publisher ID

1. Allez sur [Google AdSense](https://adsense.google.com)
2. Connectez-vous ou créez un compte
3. Vérifiez votre site
4. Récupérez votre **Publisher ID** (format: `ca-pub-xxxxxxxxxxxxxxxx`)
5. Mettez à jour votre `.env` :
```env
GOOGLE_ADSENSE_PUBLISHER_ID=ca-pub-xxxxxxxxxxxxxxxx
```

### Emplacements publicitaires

Les emplacements sont configurables via le panel admin :
- Bannière en haut du site
- Bannière latérale
- Bannière entre les listes de jeux
- Bannière sous le lecteur du jeu

## Troubleshooting

### Erreur : "Port 3000 already in use"

```bash
# Utilisez un autre port
PORT=3001 npm start
```

Ou fermez l'application qui utilise le port 3000.

### Erreur : "Module not found"

```bash
# Réinstallez les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur : "Database locked"

```bash
# Supprimez et réinitialisez la base de données
rm database/playzone.db
npm run init-db
```

### Les styles CSS ne s'appliquent pas

1. Vérifiez que `public/css/` existe
2. Videz le cache du navigateur (Ctrl+Shift+Del)
3. Redémarrez le serveur

## Configuration Avancée

### Variables d'environnement

| Variable | Description | Par défaut |
|----------|-------------|------------|
| PORT | Port du serveur | 3000 |
| NODE_ENV | Mode (development/production) | development |
| GAMEDISTRIBUTION_APP_ID | App ID GameDistribution | (vide) |
| GOOGLE_ADSENSE_PUBLISHER_ID | Publisher ID Google AdSense | (vide) |
| ADMIN_USERNAME | Nom d'utilisateur admin | admin |
| ADMIN_PASSWORD | Mot de passe admin | admin |
| ADMIN_SECRET_KEY | Clé secrète pour JWT | (vide) |
| DATABASE_PATH | Chemin de la base de données | ./database/playzone.db |
| CORS_ORIGIN | Origine CORS autorisée | http://localhost:3000 |

### Activer HTTPS en développement

1. Générez un certificat auto-signé :
```bash
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
```

2. Modifiez `server/server.js` :
```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(PORT);
```

## Déploiement

### Déploiement sur Heroku

1. Installez Heroku CLI
2. Connectez-vous : `heroku login`
3. Créez l'app : `heroku create playzone`
4. Configurez les variables :
```bash
heroku config:set GAMEDISTRIBUTION_APP_ID=YOUR_ID
heroku config:set GOOGLE_ADSENSE_PUBLISHER_ID=ca-pub-xxx
heroku config:set NODE_ENV=production
```
5. Déployez : `git push heroku main`

### Déploiement sur DigitalOcean

1. Créez un Droplet (Ubuntu 20.04, 2GB RAM)
2. SSH dans le serveur
3. Installez Node.js :
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```
4. Clonez le dépôt et suivez les étapes ci-dessus
5. Utilisez PM2 pour la gestion des processus :
```bash
npm install -g pm2
pm2 start server.js --name "playzone"
pm2 startup
pm2 save
```

## Maintenance

### Sauvegardes de la base de données

```bash
# Sauvegarde manuelle
cp database/playzone.db database/playzone.db.backup

# Script de sauvegarde automatique
# Ajoutez dans crontab (toutes les 24h)
0 0 * * * cp /path/to/playzone/database/playzone.db /path/to/backup/playzone.db.$(date +\%Y\%m\%d)
```

### Mises à jour des dépendances

```bash
# Vérifier les mises à jour
npm outdated

# Mettre à jour
npm update

# Mise à jour majeure
npm install express@latest
```

## Support

Pour toute question ou problème :
1. Consultez le [README.md](./README.md)
2. Vérifiez les logs : `logs/playzone.log`
3. Ouvrez une issue sur GitHub

---

**PlayZone** est maintenant installé et prêt à l'emploi ! 🎮
