import Enemy from "./Enemy.js";
import Utils from "./utils.js";
import Collision from "./collision.js";

export default class ShooterEnemy extends Enemy {
    constructor(x, y, scaleRatio) {
        // Paramètres spécifiques: width, height, speed, health, color, shootChance
        super(x, y, 40, 40, 80, 2, 'orangered', 0.015, scaleRatio);
        
        // Initialiser avec une direction aléatoire
        this.direction = Utils.getRandomDirection();
    }
    
    // Mise à jour spécifique au shooter: se déplacer lentement et tirer
    update(deltaTime, player, walls, scaleRatio) {
        // Appel de la méthode de base
        super.update(deltaTime, walls, scaleRatio);
        
        // Déplacer légèrement l'ennemi pour éviter qu'il soit immobile
        if (Math.random() < 0.01) { // 1% de chance de changer de direction
            this.direction = Utils.getRandomDirection();
        }
        
        // Déplacer l'ennemi plus lentement que sa vitesse normale
        this.move(this.direction.x, this.direction.y, deltaTime * 0.3);
        
        // Gérer les collisions avec les murs
        Collision.handleWallCollision(this, walls);
    }
}