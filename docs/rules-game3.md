# Règles de Serpent Rush

## Objectif du jeu
Le but du jeu est de parcourir le labyrinthe jusqu'à atteindre la sortie sans se faire rattraper par le serpent, tout en collectant des pièces d'or pour augmenter votre score.

## Comment jouer
- Déplacez-vous avec les **flèches directionnelles** ou les touches **ZQSD**
- Lorsque vous choisissez une direction, votre personnage se déplace en ligne droite jusqu'à rencontrer un mur
- Vous ne pouvez pas changer de direction pendant un déplacement
- Collectez les pièces d'or pour augmenter votre score
- Atteignez la sortie pour compléter le niveau
- Appuyez sur **Échap** ou **P** pour mettre le jeu en pause

## Éléments du jeu
- **Chemin** (blanc) : Les espaces où vous pouvez vous déplacer
- **Point de départ** (vert) : Votre position initiale dans le niveau
- **Sortie** (violet) : L'objectif à atteindre pour compléter le niveau
- **Pièces d'or** (jaune) : Collectionnez-les pour augmenter votre score
- **Serpent** (rouge) : Votre adversaire qui vous poursuit

## Le Serpent
- Le serpent commence à vous poursuivre après un court délai (1 seconde)
- Il est plus lent que vous, mais n'a pas la contrainte de devoir aller en ligne droite
- Le serpent utilise l'algorithme A* pour trouver le chemin le plus court vers vous
- Il peut emprunter des chemins qui vous sont inaccessibles à cause de votre contrainte de déplacement
- Si le serpent vous touche, vous perdez la partie

## Astuces
- Planifiez vos déplacements à l'avance - une fois lancé, vous ne pourrez pas changer de direction
- Parfois, il vaut mieux ignorer certaines pièces d'or situées dans des zones dangereuses
- Attirez le serpent dans une direction puis changez rapidement de trajectoire pour le distancer
- Observez le comportement du serpent pour anticiper ses mouvements

## Score
Votre score est calculé en fonction du nombre de pièces d'or collectées. Chaque pièce vaut 2 points.

## Fin du jeu
Le jeu se termine lorsque vous atteignez la sortie ou que le serpent vous rattrape. Vous pouvez ensuite revenir au menu pour essayer un autre niveau ou améliorer votre score.

Bonne chance !
