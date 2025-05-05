import Enemy from './enemy.js';

export default class ShooterEnemy extends Enemy {
    constructor(x, y, scaleRatio, game) {
        super(x, y, 40, 40, 80, 2, 'orangered', 0.015, scaleRatio, game);
        this.baseSpeed = 80;
        
        // Image du shooter
        this.image = new Image();
        this.image.src = '/assets/img/game2/ShooterEnemy.png';
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        
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