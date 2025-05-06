import { getCookie } from '../../../../../public/front/games/common/cookie.js';
import WaveManager from './WaveManager.js';

export default class GameStateManager {
    constructor(game) {
        this.game = game;
        this.currentState = null; // 'game', 'menu' ou 'pause'
        this.menuElement = document.getElementById('menu');
        this.pauseMenuElement = document.getElementById('pauseMenu');
        
        /*
        // Fonctionnalité désactivée pour récupérer le pseudo
        this.pseudo = getCookie("user");
        console.log("Pseudo:", this.pseudo);
        this.waveManager = new WaveManager(game, this.pseudo);
        */
        
        // Configuration des boutons d'interface
        this.setupButtons();
    }
    
    // Initialise les écouteurs d'événements pour les boutons
    setupButtons() {
        const playButton = document.getElementById('playButton');
        const resumeButton = document.getElementById('resumeButton');
        const returnToMenuButton = document.getElementById('returnToMenuButton');
        
        playButton.addEventListener('click', () => {
            this.game.reset();
            this.switchToGame();
        });
        
        resumeButton.addEventListener('click', () => {
            this.switchToGame();
        });
        
        returnToMenuButton.addEventListener('click', () => {
            this.switchToMenu();
        });
    }
    
    // Affiche le menu principal
    switchToMenu() {
        this.currentState = 'menu';
        this.game.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        this.game.canvas.style.display = 'none';
        this.menuElement.style.display = 'flex';
        this.pauseMenuElement.style.display = 'none';
    }
    
    // Passe au mode jeu (reprise ou démarrage)
    switchToGame() {
        this.currentState = 'game';
        this.game.canvas.style.display = 'block';
        this.menuElement.style.display = 'none';
        this.pauseMenuElement.style.display = 'none';
        this.game.isPaused = false;
    }
    
    // Affiche le menu de pause
    switchToPause() {
        this.currentState = 'pause';
        this.pauseMenuElement.style.display = 'flex';
        this.game.isPaused = true;
    }
    
    // Affiche l'écran de fin de jeu
    endGame() {
        this.currentState = 'menu';
        this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        
        const scaleRatio = this.game.getScaleRatio();
        
        // Texte Game Over
        this.game.ctx.fillStyle = '#FF5555';
        this.game.ctx.font = `${Math.floor(48 * scaleRatio)}px Arial`;
        this.game.ctx.textAlign = 'center';
        this.game.ctx.fillText('GAME OVER', this.game.canvas.width / 2, this.game.canvas.height / 2 - 30 * scaleRatio);
        
        // Informations sur le score et la vague
        this.game.ctx.fillStyle = 'white';
        this.game.ctx.font = `${Math.floor(24 * scaleRatio)}px Arial`;
        this.game.ctx.fillText(
            `Niveau atteint: ${this.game.experienceManager.level} | Vague: ${this.game.waveManager.currentWave}`, 
            this.game.canvas.width / 2, 
            this.game.canvas.height / 2 + 20 * scaleRatio
        );
        
        // Retour au menu après 3 secondes
        setTimeout(() => this.switchToMenu(), 3000);
    }
}