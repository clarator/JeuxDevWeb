import Enemy from './enemy.js';

export default class WandererEnemy extends Enemy {
    constructor(x, y, scaleRatio, game) {
        super(x, y, 40, 40, 100, 3, 'darkred', 0.005, scaleRatio, game);
        this.baseSpeed = 100;
        this.directionChangeTimer = 0;
        
        // Définir une direction initiale aléatoire
        const angle = Math.random() * Math.PI * 2;
        this.speedX = Math.cos(angle) * this.speedValue;
        this.speedY = Math.sin(angle) * this.speedValue;
    }
    
    update(deltaTime, player) {
        this.directionChangeTimer += deltaTime;
        
        // Changer de direction toutes les 2 secondes
        if (this.directionChangeTimer > 2) {
            this.directionChangeTimer = 0;
            const angle = Math.random() * Math.PI * 2;
            this.speedX = Math.cos(angle) * this.speedValue;
            this.speedY = Math.sin(angle) * this.speedValue;
        }
        
        super.update(deltaTime);
    }
}