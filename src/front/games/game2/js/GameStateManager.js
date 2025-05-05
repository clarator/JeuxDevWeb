export default class GameStateManager {
    constructor(game) {
        this.game = game;
        this.currentState = null; // 'game', 'menu' ou 'pause'
        this.menuElement = document.getElementById('menu');
        
        // Configuration des boutons du menu
        this.setupMenuButtons();
    }
    
    setupMenuButtons() {
        const startButton = document.getElementById('startButton');
        const quitButton = document.getElementById('quitButton');
        
        startButton.addEventListener('click', () => {
            this.game.reset();
            this.switchToGame();
        });
        
        quitButton.addEventListener('click', () => {
            window.location.href = '../../index.html';
        });
    }
    
    switchToMenu() {
        this.currentState = 'menu';
        this.game.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        this.game.canvas.style.display = 'none';
        this.menuElement.style.display = 'flex';
    }
    
    switchToGame() {
        this.currentState = 'game';
        this.game.canvas.style.display = 'block';
        this.menuElement.style.display = 'none';
        // Assurer que le jeu n'est pas en pause
        this.game.isPaused = false;
    }
    
    pauseGame() {
        if (this.currentState === 'game') {
            this.currentState = 'pause';
            this.game.isPaused = true;
            
            // Afficher l'écran de pause
            this.renderPauseScreen();
        }
    }
    
    resumeGame() {
        if (this.currentState === 'pause') {
            this.currentState = 'game';
            this.game.isPaused = false;
        }
    }
    
    renderPauseScreen() {
        const ctx = this.game.ctx;
        const scaleRatio = this.game.getScaleRatio();
        
        // Fond semi-transparent
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Titre
        ctx.fillStyle = '#4CAF50';
        ctx.font = `${Math.floor(48 * scaleRatio)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('PAUSE', ctx.canvas.width / 2, ctx.canvas.height / 3);
        
        // Instructions
        ctx.fillStyle = 'white';
        ctx.font = `${Math.floor(24 * scaleRatio)}px Arial`;
        ctx.fillText('Appuyez sur ECHAP pour reprendre', ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.fillText('Appuyez sur M pour retourner au menu', ctx.canvas.width / 2, ctx.canvas.height / 2 + 40 * scaleRatio);
    }
    
    endGame() {
        this.currentState = 'menu';
        this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        
        const scaleRatio = this.game.getScaleRatio();
        
        // Game Over text
        this.game.ctx.fillStyle = '#FF5555';
        this.game.ctx.font = `${Math.floor(48 * scaleRatio)}px Arial`;
        this.game.ctx.textAlign = 'center';
        this.game.ctx.fillText('GAME OVER', this.game.canvas.width / 2, this.game.canvas.height / 2 - 30 * scaleRatio);
        
        // Score/wave info
        this.game.ctx.fillStyle = 'white';
        this.game.ctx.font = `${Math.floor(24 * scaleRatio)}px Arial`;
        this.game.ctx.fillText(
            `Niveau atteint: ${this.game.experienceManager.level} | Vague: ${this.game.waveManager.currentWave}`, 
            this.game.canvas.width / 2, 
            this.game.canvas.height / 2 + 20 * scaleRatio
        );
        
        setTimeout(() => this.switchToMenu(), 3000);
    }
    
    handleKeyPress(key) {
        if (key === 'Escape') {
            if (this.currentState === 'game') {
                this.pauseGame();
            } else if (this.currentState === 'pause') {
                this.resumeGame();
            }
        } else if (key === 'KeyM' && this.currentState === 'pause') {
            this.switchToMenu();
        }
    }
}