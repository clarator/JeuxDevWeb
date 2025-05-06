//fichier d'entrée pour le jeu
import Game from './Game.js';

let game;

//fonction d'initialisation du jeu
function init() {
    console.log("DOM chargé, lancement du jeu...");
    game = new Game();
}
init()


//pour lancer le serveur de dev
//npm run server:dev
