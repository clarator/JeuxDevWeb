import Game from './Game.js';

let game;

// Fonction d'initialisation du jeu et des améliorations
function init() {
    console.log("DOM chargé, lancement du jeu...");
    game = new Game();
}
document.addEventListener("DOMContentLoaded", init);
