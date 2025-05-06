import Enemy from './Enemy.js';

export default class ChaserEnemy extends Enemy {
    constructor(x, y, scaleRatio, game) {
        // Appel du constructeur parent (ennemi sans tir)
        super(x, y, 40, 40, 150, 3, 'crimson', 0, scaleRatio, game);
        this.baseSpeed = 150;
        
        // Chargement de l'image de l'ennemi "chasseur"
        this.image = new Image();
        this.image.src = '../../../public/assets/img/game2/ChaserEnemy.png';
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
    }
    
    // Mise à jour spécifique : poursuite du joueur
    update(deltaTime, player) {
        const playerCenter = player.getCenter();
        const enemyCenter = this.getCenter();
        
        // Calcul de la direction vers le joueur
        const dirX = playerCenter.x - enemyCenter.x;
        const dirY = playerCenter.y - enemyCenter.y;
        
        // Normalisation et application de la vitesse
        const length = Math.sqrt(dirX * dirX + dirY * dirY);
        if (length > 0) {
            this.speedX = (dirX / length) * this.speedValue;
            this.speedY = (dirY / length) * this.speedValue;
        }
        
        super.update(deltaTime);
    }
}