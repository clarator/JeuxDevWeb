// main.js - Point d'entrée du jeu
import { Game } from './game.js';

// Attendre que tout le contenu soit chargé
window.addEventListener('load', () => {
    // Créer et démarrer l'instance du jeu
    const game = new Game();
    game.init();
    game.start();
});
