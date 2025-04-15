import Game from "./game.js";

// Attendre que la page soit chargée
window.addEventListener('load', () => {
    // Créer une instance du jeu
    const game = new Game('gameCanvas');
    
    // Démarrer le jeu
    game.start();
    
    // Informations de débogage
    console.log("Tower Defense initialisé");
    console.log(`Taille du monde: ${game.worldWidth}x${game.worldHeight}`);
    console.log(`Taille visible: ${game.canvas.width}x${game.canvas.height}`);
    console.log("Utilisez les flèches du clavier pour naviguer dans la carte");
});