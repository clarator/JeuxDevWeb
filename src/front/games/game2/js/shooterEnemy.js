import Enemy from './enemy.js';

export default class ShooterEnemy extends Enemy {
    constructor(x, y, scaleRatio) {
        super(x, y, 40, 40, 80, 2, 'orangered', 0.015, scaleRatio);
        this.baseSpeed = 80;
        
        // Définir un mouvement initial léger
        const angle = Math.random() * Math.PI * 2;
        this.speedX = Math.cos(angle) * this.speedValue * 0.3;
        this.speedY = Math.sin(angle) * this.speedValue * 0.3;
    }
    
    update(deltaTime, player) {
        // Mouvement aléatoire léger
        if (Math.random() < 0.01) {
            const angle = Math.random() * Math.PI * 2;
            this.speedX = Math.cos(angle) * this.speedValue * 0.3;
            this.speedY = Math.sin(angle) * this.speedValue * 0.3;
        }
        
        super.update(deltaTime);
    }
}