# JeuxDevWeb
## Projet réaliser en HTML, CSS, JS

## Membre du groupe 

- Romain STEFANI
- Clara TORRI 


# Site
Réalisé par Clara

### Front

- header.html utiliser par toutes les pages du site ce qui permet d'éviter la répétition dans le code 

- Page Principal : 
    index.html ==> site permettant d'accéder aux jeux ainsi qu'à leurs règles des jeux et l'historique des scores 
    website.js ==> utiliser pour faire les redirections sur les jeux, les règles des jeux et les scores des joueurs
    website.css

- Page Secondaire : 
    + Profil :
        profile.html ==> affiche le pseudo du joueur, lui permettant de modifier son pseudo et/ou son mot de passe et de supprimer son compte s'il le souhaite
        profile.js ==> recupère le pseudo du joueur grâce au cookie, envoie au serveur les nouvelles données ou la suppresion du compte
        profile.css ==> style

    + Contact : 
        contact.html ==> pour afficher les informations des développeurs
        contact.css ==> style

    + Connection : 
        login.html ==> pour se connecter et sauvegarder ses scores dans les jeux 
        login.js ==> gère le changement entre Inscription et Connexion + l'envoie des informations d'inscription et de connexion au serveur
        login.css ==> style

### Back

- server.js ==> fichier principal du serveur

- db.js ==> fichier pour se connecter à la base de donnée (MySQL) hébergé chez Railway

(mettre schema BD)

- request.js ==> fichier avec toute les requêtes d'insertion, modification, recherche et suppresion


## DOM : Minor clicker
Réalisé par Clara

- Site : index.html
- Code du jeu :
    + script.js ==> fichier avec la fonction d'initialisation du jeu

    + Game.js   ==> classe principal du jeu
                ==> contructor() permettant l'initialisation des variables, du header, la mise à jour du score, la gestion du score, des notifications, des améliorations et des automatisations
                ==> fonction mineClick() qui gère le clic sur l'image de la pépite d'or, avec le sons, l'explosion, la vibration et l'ajout d'argent dans le porte-monnaie
                ==> fonction update() pour mettre à jour l'affichage de l'or et du score 
                ==> fonction addGoldWallet() pour gérer le porte-monnaie
                ==> fontion addSound() pour ajouter le son lors de l'ajout d'or dans le porte-monnaie
                ==> fonction triggerExplosion() pour gérer l'explosion à partir de l'image de la pépite d'or
                ==> fonction saveScoreFinal() pour gérer la sauvegarde du score

    + animation.js  ==> fichier qui gère l'animation de la pépite 
                    ==> la vibration lorsqu'on clique avec vibrateGold() ==> l'explosion de mini pépite avec explodeGoldPicture()

    + automation.js ==> fichier qui gère les automatisations du jeu
                    ==> variable automation pour initialisé les automatisations
                    ==> fonction buyAutomation() pour l'achat d'une automatisation
                    ==> fonction startAutomation() pour démarrer l'automatisation
                
    + upgrade.js    ==> fichier qui gère les améliorations du jeu
                    ==> fonction buyUpgrade() pour l'achat d'une amélioration
                    ==> fonction applyUpgrade() pour appliquer l'effet de l'amélioration 
                    ==> fonction startUpgrade() pour lancer les améliorations

    + notification.js   ==> fonction checkNotifications() pour afficher la liste des notifications

    + header.js ==> gère le fichier du jeu
                ==> fonction setupHeader() qui gère le bouton quitter, l'activation et la désactivation du son, l'affichage du meilleur score

                
    
## Canvas : 
Réalisé par Romain

## Canvas :
Réalisé par Romain 

