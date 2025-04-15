// Classe pour gérer l'interface utilisateur
export class UIManager {
    constructor() {
        this.livesElement = null;
        this.goldElement = null;
        this.waveElement = null;
    }
    
    init() {
        // Récupération des éléments du DOM
        this.livesElement = document.getElementById('lives');
        this.goldElement = document.getElementById('gold');
        this.waveElement = document.getElementById('wave');
    }
    
    update(lives, gold, wave) {
        // Mise à jour des informations affichées
        if (this.livesElement) this.livesElement.textContent = lives;
        if (this.goldElement) this.goldElement.textContent = gold;
        if (this.waveElement) this.waveElement.textContent = wave;
    }
    
    showMessage(message, duration = 3000) {
        // Création d'un élément temporaire pour afficher un message
        const messageElement = document.createElement('div');
        messageElement.className = 'game-message';
        messageElement.textContent = message;
        messageElement.style.position = 'absolute';
        messageElement.style.top = '50%';
        messageElement.style.left = '50%';
        messageElement.style.transform = 'translate(-50%, -50%)';
        messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        messageElement.style.color = 'white';
        messageElement.style.padding = '10px 20px';
        messageElement.style.borderRadius = '5px';
        messageElement.style.zIndex = '100';
        
        // Ajout au conteneur de jeu
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.appendChild(messageElement);
        
        // Suppression après la durée spécifiée
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, duration);
    }
    
    showGameOver() {
        const gameOverElement = document.createElement('div');
        gameOverElement.id = 'gameOver';
        gameOverElement.style.position = 'absolute';
        gameOverElement.style.top = '50%';
        gameOverElement.style.left = '50%';
        gameOverElement.style.transform = 'translate(-50%, -50%)';
        gameOverElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        gameOverElement.style.color = 'white';
        gameOverElement.style.padding = '20px';
        gameOverElement.style.borderRadius = '10px';
        gameOverElement.style.textAlign = 'center';
        gameOverElement.style.zIndex = '200';
        
        gameOverElement.innerHTML = `
            <h2>Game Over</h2>
            <p>Appuyez sur 'R' pour recommencer</p>
        `;
        
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.appendChild(gameOverElement);
    }
    
    hideGameOver() {
        const gameOverElement = document.getElementById('gameOver');
        if (gameOverElement && gameOverElement.parentNode) {
            gameOverElement.parentNode.removeChild(gameOverElement);
        }
    }
    
    showWaveInfo(waveNumber, enemyCount) {
        this.showMessage(`Vague ${waveNumber} - ${enemyCount} ennemis`, 2000);
    }
}