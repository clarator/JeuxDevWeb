# Documentation Technique - Minor Clicker

## Structure du jeu

Minor Clicker est un jeu de type "clicker" développé en JavaScript vanilla. Le joueur clique sur une pépite d'or pour gagner des points et de l'or, qu'il peut ensuite utiliser pour acheter des améliorations et des automatisations.

## Classes et modules principaux

### Game.js
Classe centrale qui contrôle l'ensemble du jeu :
- `constructor()` : initialise les variables, le header, les scores, notifications, améliorations et automatisations
- `mineClick()` : gère le clic sur la pépite d'or (son, explosion, vibration, gain d'or)
- `update()` : met à jour l'affichage de l'or et du score
- `addGoldWallet()` : ajoute de l'or au porte-monnaie
- `addSound()` : joue le son de gain
- `triggerExplosion()` : déclenche une animation d'explosion
- `saveScoreFinal()` : sauvegarde le score (si différent de 0)

### animation.js
Gère les animations liées à la pépite :
- `vibrateGold()` : crée une animation de vibration lorsque la pépite est cliquée
- `explodeGoldPicture()` : génère une explosion de mini-pépites lorsque le score atteint certains seuils

### automation.js
Gère les automatisations qui génèrent des points passivement :
- Définit un tableau `automations[]` contenant les objets d'automatisation
- `buyAutomation()` : permet l'achat d'une automatisation (mineur, excavateur, foreuse)
- `startAutomation()` : active le gain passif de points et d'or toutes les secondes

### upgrade.js
Gère les améliorations qui augmentent les points gagnés par clic :
- Définit un tableau `upgrades[]` contenant les objets d'amélioration
- `buyUpgrade()` : gère l'achat d'une amélioration
- `applyUpgrade()` : applique les effets de l'amélioration
- `startUpgrade()` : initialise les améliorations disponibles

### notification.js
Gère l'affichage des notifications pour guider le joueur :
- `checkNotifications()` : vérifie quelles améliorations ou automatisations sont disponibles à l'achat et affiche les notifications correspondantes

### header.js
Gère l'en-tête du jeu avec les fonctionnalités suivantes :
- Bouton pour quitter le jeu
- Bouton pour activer/désactiver le son
- Affichage du meilleur score du joueur

### scores.js
Gère la sauvegarde et la récupération des scores :
- `saveScore()` : sauvegarde le score du joueur dans la base de données
- `getBestScore()` : récupère le meilleur score du joueur
- `getAllScoresGame1()` : récupère tous les scores pour les afficher dans le tableau des scores

## Système de progression

### Points et or
- Chaque clic sur la pépite d'or rapporte un nombre de points déterminé par `scorePerClick`
- Tous les 5 points gagnés, le joueur reçoit 5 pièces d'or
- Les améliorations actives génèrent également de l'or passivement

### Améliorations
Les améliorations augmentent les points gagnés par clic :
- Marteau : +2 points/clic (50 or)
- Pioche en fer : +5 points/clic (100 or)
- Pioche en diamant : +10 points/clic (150 or)
- Dynamite : +20 points/clic (200 or)
- TNT : +50 points/clic (500 or)
- Foreuse : +100 points/clic (1000 or)

### Automatisations
Les automatisations génèrent des points automatiquement :
- Mineur : +10 points/seconde (200 or)
- Excavateur : +50 points/seconde (300 or)
- Foreuse automatisée : +100 points/seconde (500 or)

## Éléments graphiques et sonores

### Animations
- Vibration de la pépite lors d'un clic
- Explosion de mini-pépites lors d'atteinte de certains seuils de score
- Intensité de vibration qui augmente tous les 10 clics

### Sons
- Son de pioche lors d'un clic sur la pépite
- Son d'explosion lors d'une animation d'explosion
- Son de pièces lorsque de l'or est ajouté au porte-monnaie

## Interface utilisateur

- Section centrale avec la pépite d'or cliquable
- Affichage du score et de l'or en haut
- Section de notifications à gauche
- Magasin d'améliorations et d'automatisations à droite
- En-tête avec boutons fonctionnels (quitter, son, meilleur score)