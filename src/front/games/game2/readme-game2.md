# Documentation Technique - Deep Space Survivor

## Architecture du jeu

Deep Space Survivor est un jeu de survie dans l'espace développé en JavaScript, utilisant Canvas pour le rendu. Le joueur contrôle un vaisseau spatial qui doit survivre face à des vagues d'ennemis de plus en plus difficiles.

## Classes principales

### Game.js
La classe centrale qui gère l'ensemble du jeu :
- Initialise tous les composants (joueur, ennemis, projectiles)
- Gère la boucle de jeu avec `requestAnimationFrame`
- Contrôle les collisions
- Gère le redimensionnement du canvas
- Coordonne les autres classes

### Player.js
Représente le vaisseau du joueur :
- Gestion des déplacements avec les touches WASD
- Système de tir (direction avec la souris)
- Système de santé et d'invulnérabilité
- Gestion des améliorations (bouclier, multi-tirs, etc.)

### Enemy.js et ses sous-classes
Définit le comportement des différents types d'ennemis :
- `Enemy.js` : Classe de base avec propriétés communes
- `WandererEnemy.js` : Ennemi qui se déplace aléatoirement
- `ChaserEnemy.js` : Ennemi qui poursuit le joueur
- `ShooterEnemy.js` : Ennemi qui reste à distance et tire sur le joueur

### ExperienceManager.js
Gère le système de progression du joueur :
- Gain d'expérience lorsque des ennemis sont tués
- Système de niveaux
- Menu d'améliorations lorsque le joueur monte de niveau
- Application des effets des améliorations

### WaveManager.js
Contrôle le flux du jeu :
- Génère les vagues d'ennemis
- Augmente progressivement la difficulté
- Gère les pauses entre les vagues
- Sauvegarde les scores

## Système d'améliorations

Le jeu propose plusieurs types d'améliorations que le joueur peut choisir en montant de niveau :

1. **Améliorations défensives**
   - Soin : Restaure 3 points de vie
   - Vie Maximum : Augmente la vie maximale
   - Bouclier : Ajoute une protection périodique

2. **Améliorations offensives**
   - Tir Rapide : Réduit le temps entre les tirs
   - Tir Puissant : Augmente les dégâts
   - Tir Multiple : Tire plusieurs projectiles à la fois
   - Pénétration : Les projectiles traversent plusieurs ennemis

3. **Améliorations de mobilité**
   - Vitesse : Augmente la vitesse de déplacement du joueur

## Performances et optimisations

Plusieurs optimisations ont été mises en place :
- Utilisation d'un système de scale ratio pour adapter le jeu à différentes résolutions d'écran
- Optimisation des collisions

## Contrôles du jeu

- **ZQSD** : Déplacement du vaisseau
- **Souris** : Viser
- **Clic gauche** : Tirer
- **Échap** : Pause