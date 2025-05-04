import Enemy from "./Enemy.js";
import Utils from "./utils.js";
import Collision from "./collision.js";

export default class ChaserEnemy extends Enemy {
    constructor(x, y, scaleRatio) {
        // Paramètres spécifiques: width, height, speed, health, color, shootChance
        super(x, y, 40, 40, 150, 3, 'crimson', 0, scaleRatio);
    }
    
    // Mise à jour spécifique au chaser: poursuivre le joueur
    update(deltaTime, player, walls, scaleRatio) {
        // Appel de la méthode de base
        super.update(deltaTime, walls, scaleRatio);
        
        // Obtenir le centre de l'ennemi et du joueur
        const enemyCenter = this.getCenter();
        const playerCenter = player.getCenter();
        
        // Calculer la direction vers le joueur
        this.direction = Utils.getDirectionVector(
            enemyCenter.x, 
            enemyCenter.y, 
            playerCenter.x, 
            playerCenter.y
        );
        
        // Déplacer l'ennemi vers le joueur
        this.move(this.direction.x, this.direction.y, deltaTime);
        
        // Gérer les collisions avec les murs
        Collision.handleWallCollision(this, walls);
    }
}