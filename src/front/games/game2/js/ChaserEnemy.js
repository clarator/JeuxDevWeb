import Enemy from './enemy.js';

export default class ChaserEnemy extends Enemy {
    constructor(x, y, scaleRatio, game) {
        super(x, y, 40, 40, 150, 3, 'crimson', 0, scaleRatio, game);
        this.baseSpeed = 150;
        
        // Image du chaser
        this.image = new Image();
        this.image.src = '../../assets/img/game2/ChaserEnemy.png';
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
    }
    
    update(deltaTime, player) {
        const playerCenter = player.getCenter();
        const enemyCenter = this.getCenter();
        
        // Calculer la direction vers le joueur
        const dirX = playerCenter.x - enemyCenter.x;
        const dirY = playerCenter.y - enemyCenter.y;
        
        // Normaliser et appliquer la vitesse
        const length = Math.sqrt(dirX * dirX + dirY * dirY);
        if (length > 0) {
            this.speedX = (dirX / length) * this.speedValue;
            this.speedY = (dirY / length) * this.speedValue;
        }
        
        super.update(deltaTime);
    }
}