import Game from './Game.js';;

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);
    game.start();
});