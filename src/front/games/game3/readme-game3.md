# Documentation Technique - Serpent Rush

## Concept et objectif

Serpent Rush est un jeu de labyrinthe où le joueur doit atteindre la sortie tout en évitant un serpent qui le poursuit en utilisant l'algorithme A* (pathfinding). La particularité du jeu est que le joueur se déplace en ligne droite jusqu'à rencontrer un mur, sans pouvoir changer de direction pendant le mouvement.

## Classes principales

### Game.js

Classe centrale qui contrôle l'ensemble du jeu :
- Initialise toutes les autres classes et composants
- Gère la boucle de jeu via `requestAnimationFrame`
- Traite les entrées utilisateur (clavier)
- Gère les collisions (murs, collectibles, serpent)
- Coordonne les interactions entre le joueur, la carte et le serpent
- Constants : `CELL_SIZE` définit la taille d'une cellule en pixels (40px)

### Player.js

Gère le joueur et ses mouvements :
- Mouvement en ligne droite jusqu'à rencontrer un obstacle
- `startLevel()` : initialise la position du joueur
- `update()` : met à jour la position du joueur selon sa vitesse
- `stopMoving()` : arrête le mouvement (collision avec un mur)
- `render()` : dessine le joueur à l'écran

### Snake.js

Implémente l'IA du serpent qui poursuit le joueur :
- Utilise l'algorithme A* (`findPath()`) pour calculer le chemin vers le joueur
- `startLevel()` : initialise la position du serpent
- `update()` : met à jour la position et l'état du serpent
- `moveToTargetNode()` : déplace le serpent vers le prochain nœud du chemin
- `checkCollision()` : vérifie si le serpent a attrapé le joueur
- Animation fluide avec des segments de corps qui suivent la tête

### Map.js

Gère la carte et les collectibles :
- `loadMap()` : charge une carte à partir des données de niveau
- `render()` : dessine la carte et les collectibles
- Optimisations : ne dessine que les éléments visibles à l'écran

### Camera.js

Suit le joueur dans les grandes cartes :
- `updateCameraPosition()` : met à jour la position de la caméra pour suivre le joueur avec un effet de lissage
- Permet le scroll dans les grands niveaux

### GameStateManager.js

Gère les différents états du jeu et la définition des niveaux :
- États : menu, jeu, pause
- Contient les données de tous les niveaux (grilles, collectibles)
- Gère les transitions entre les états

## Système de niveaux

Les niveaux sont définis dans `gameStateManager.js` avec :
- Une grille où chaque cellule est représentée par un nombre :
  - `0` : Mur
  - `1` : Chemin
  - `2` : Point de départ
  - `3` : Sortie
- Une liste de collectibles avec leurs positions et valeurs

## Algorithme A* pour le serpent

L'IA du serpent utilise l'algorithme A* pour trouver le chemin le plus court vers le joueur :
1. Initialisation des listes ouvertes et fermées
2. Calcul du coût pour chaque nœud (g : coût depuis le départ, h : estimation vers la cible)
3. Exploration des directions possibles (haut, droite, bas, gauche)
4. Reconstruction du chemin une fois la cible atteinte

## Optimisations

- Rendu conditionnel : seuls les éléments visibles sont dessinés
- Mise à jour basée sur le temps (`deltaTime`) pour une expérience cohérente à différents FPS
- Calcul efficace des collisions à l'aide de coordonnées de grille

## Contrôles

- Flèches directionnelles ou ZQSD : choisir une direction de déplacement
- Échap ou P : mettre le jeu en pause
- Espace : revenir au menu après avoir gagné ou perdu

## Mécaniques de jeu uniques

- Le joueur ne peut pas s'arrêter une fois en mouvement jusqu'à ce qu'il rencontre un mur
- Le serpent a un délai d'activation au début de chaque niveau (1 seconde)
- Le serpent est plus lent que le joueur mais peut prendre des raccourcis
- Des pièces d'or sont à collecter pour améliorer le score