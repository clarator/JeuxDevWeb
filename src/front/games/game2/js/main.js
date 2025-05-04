import Game from "./game.js";

// Point d'entrée du jeu
window.addEventListener('load', () => {
    // Créer et démarrer le jeu
    const game = new Game('gameCanvas');
    game.start();
});