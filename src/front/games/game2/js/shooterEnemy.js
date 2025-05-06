import Enemy from './Enemy.js';

export default class ShooterEnemy extends Enemy {
    constructor(x, y, scaleRatio, game) {
        // Appel du constructeur parent avec chance de tir élevée
        super(x, y, 40, 40, 80, 2, 'orangered', 0.015, scaleRatio, game);
        this.baseSpeed = 80;
        
        // Chargement de l'image de l'ennemi "tireur"
        this.image = new Image();
        this.image.src = '../../../public/assets/img/game2/ShooterEnemy.png';
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        
        // Mouvement initial léger (30% de la vitesse normale)
        const angle = Math.random() * Math.PI * 2;
        this.speedX = Math.cos(angle) * this.speedValue * 0.3;
        this.speedY = Math.sin(angle) * this.speedValue * 0.3;
    }
    
    // Mise à jour spécifique : mouvement aléatoire léger
    update(deltaTime, player) {
        // 1% de chance de changer de direction à chaque frame
        if (Math.random() < 0.01) {
            const angle = Math.random() * Math.PI * 2;
            this.speedX = Math.cos(angle) * this.speedValue * 0.3;
            this.speedY = Math.sin(angle) * this.speedValue * 0.3;
        }
        
        super.update(deltaTime);
    }
}