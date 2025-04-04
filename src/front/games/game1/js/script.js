import Game from './Game.js';

let game;

// Fonction d'initialisation du jeu et des améliorations
function init() {
    console.log("DOM chargé, lancement du jeu...");
    game = new Game();
}
init()

//npm run server:dev
//sudo /opt/lampp/lampp start