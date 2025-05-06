import Enemy from './Enemy.js';

export default class WandererEnemy extends Enemy {
    constructor(x, y, scaleRatio, game) {
        // Appel du constructeur parent avec faible chance de tir
        super(x, y, 40, 40, 100, 3, 'darkred', 0.005, scaleRatio, game);
        this.baseSpeed = 100;
        this.directionChangeTimer = 0;
        
        // Chargement de l'image de l'ennemi "vagabond"
        this.image = new Image();
        this.image.src = '/assets/img/game2/WandererEnemy.png';
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        
        // Direction initiale aléatoire
        const angle = Math.random() * Math.PI * 2;
        this.speedX = Math.cos(angle) * this.speedValue;
        this.speedY = Math.sin(angle) * this.speedValue;
    }
    
    // Mise à jour spécifique : changement de direction aléatoire
    update(deltaTime, player) {
        this.directionChangeTimer += deltaTime;
        
        // Change de direction toutes les 2 secondes
        if (this.directionChangeTimer > 2) {
            this.directionChangeTimer = 0;
            const angle = Math.random() * Math.PI * 2;
            this.speedX = Math.cos(angle) * this.speedValue;
            this.speedY = Math.sin(angle) * this.speedValue;
        }
        
        super.update(deltaTime);
    }
}