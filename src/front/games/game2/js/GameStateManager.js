export default class GameStateManager {
    constructor(game) {
        this.game = game;
        this.currentState = null; // 'game' ou 'menu'
        this.menuElement = null;
    }
    
    switchToMenu() {
        this.currentState = 'menu';
        this.game.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        this.game.canvas.style.display = 'none';
        
        if (!this.menuElement) {
            this.menuElement = document.getElementById('menu');
        }
        this.menuElement.style.display = 'block';
        
        const startButton = document.createElement('button');
        startButton.textContent = 'JOUER';
        startButton.style.padding = '10px 20px';
        startButton.style.fontSize = '20px';
        startButton.style.cursor = 'pointer';
        startButton.addEventListener('click', () => {
            this.game.reset();
            this.switchToGame();
        });
        
        // Clear previous content and add button
        this.menuElement.innerHTML = '';
        this.menuElement.appendChild(startButton);
    }
    
    switchToGame() {
        this.currentState = 'game';
        this.game.canvas.style.display = 'block';
        this.menuElement.style.display = 'none';
    }
    
    endGame() {
        this.currentState = 'menu';
        this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        
        this.game.ctx.fillStyle = 'white';
        this.game.ctx.font = '48px Arial';
        this.game.ctx.textAlign = 'center';
        this.game.ctx.fillText('GAME OVER', this.game.canvas.width / 2, this.game.canvas.height / 2);
        
        setTimeout(() => this.switchToMenu(), 2000);
    }
}