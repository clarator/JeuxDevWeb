// Point d'entrée principal du jeu
import { Game } from './game.js';

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Démarrage du jeu
    const game = new Game();
    game.start();
    
    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        // On pourrait ajouter un redimensionnement du canvas ici si nécessaire
    });
    
    // Ajout d'autres écouteurs d'événements globaux si nécessaire
    document.addEventListener('visibilitychange', function() {
        // Mettre le jeu en pause quand l'onglet n'est pas actif
        if (document.hidden) {
            game.pause();
        } else {
            // Optionnel : reprendre automatiquement
            // game.resume();
        }
    });
});