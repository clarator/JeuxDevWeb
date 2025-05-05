# JeuxDevWeb

## Projet réalisé en HTML, CSS et JavaScript

## Membres du groupe

- Romain STEFANI  
- Clara TORRI  

---

# Site Web

**Développé par Clara**

## Frontend

- `header.html`  
  Utilisé par toutes les pages du site pour éviter la répétition de code.

### Page principale

- `index.html`  
  Page d'accueil permettant d'accéder aux jeux, à leurs règles et à l'historique des scores.
- `website.js`  
  Fichier JavaScript pour gérer les redirections vers les jeux, les règles et les scores.
- `website.css`  
  Feuille de style principale du site.

### Pages secondaires

#### Profil
- `profile.html`  
  Affiche le pseudo du joueur, permet de modifier les informations ou de supprimer le compte.
- `profile.js`  
  Récupère le pseudo depuis les cookies, envoie les modifications ou la suppression au serveur.
- `profile.css`  
  Feuille de style de la page profil.

#### Contact
- `contact.html`  
  Affiche les informations des développeurs.
- `contact.css`  
  Style de la page contact.

#### Connexion / Inscription
- `login.html`  
  Permet à l'utilisateur de se connecter ou de créer un compte.
- `login.js`  
  Gère l'alternance entre inscription et connexion, envoie les données au serveur.
- `login.css`  
  Feuille de style pour la page de connexion.

## Backend

- `server.js`  
  Fichier principal du serveur Node.js.

- `db.js`  
  Connexion à la base de données MySQL (hébergée sur Railway).

- `request.js`  
  Contient toutes les requêtes SQL : insertion, modification, suppression, recherche.

**À faire : ajouter le schéma de la base de données**

---

# Jeu DOM : Minor Clicker

**Développé par Clara**

## Fichiers du jeu

- `index.html`  
  Point d'entrée du jeu Minor Clicker.

### `script.js`
- Initialise le jeu.

### `Game.js`
- Classe principale du jeu.
- `constructor()` : initialise les variables, le header, les scores, notifications, améliorations et automatisations.  
- `mineClick()` : gère le clic sur la pépite d’or (son, explosion, vibration, gain d’or).  
- `update()` : met à jour l’affichage de l’or et du score.  
- `addGoldWallet()` : ajoute de l’or au porte-monnaie.  
- `addSound()` : joue le son de gain.  
- `triggerExplosion()` : déclenche une animation d’explosion.  
- `saveScoreFinal()` : sauvegarde le score (si différent de 0).

### `animation.js`
- Gère les animations liées à la pépite.
- `vibrateGold()` : animation de vibration.  
- `explodeGoldPicture()` : explosion en mini pépites.

### `automation.js`
- Gère les automatisations.
- `automations[]` : tableau contenant les objets d'automatisation.  
- `buyAutomation()` : permet l'achat d'une automatisation.  
- `startAutomation()` : démarre le gain passif toutes les secondes.

### `upgrade.js`
- Gère les améliorations.
- `buyUpgrade()` : achat d’une amélioration.  
- `applyUpgrade()` : applique les effets.  
- `startUpgrade()` : initialise les améliorations.

### `notification.js`
- `checkNotifications()` : affiche les notifications.

### `header.js`
- Gère l’en-tête du jeu.
- `setupHeader()` : initialise les boutons (quitter, son, meilleur score).

---

# Jeu Canvas


**Développé par Romain**


