// Classe pour l'ennemi de type "wanderer" qui se déplace aléatoirement
class WandererEnemy extends Enemy {
    constructor(x, y, scaleRatio) {
        // Paramètres spécifiques: width, height, speed, health, color, shootChance
        super(x, y, 40, 40, 100, 4, 'darkred', 0.01, scaleRatio);
        
        // Initialiser avec une direction aléatoire
        this.direction = Utils.getRandomDirection();
        this.directionChangeTimer = 0;
    }
    
    // Mise à jour spécifique au wanderer: se déplacer aléatoirement
    update(deltaTime, player, walls, scaleRatio) {
        // Appel de la méthode de base
        super.update(deltaTime, walls, scaleRatio);
        
        // Mettre à jour le timer de changement de direction
        this.directionChangeTimer += deltaTime;
        
        // Changer de direction toutes les 2 secondes
        if (this.directionChangeTimer > 2) {
            this.directionChangeTimer = 0;
            this.direction = Utils.getRandomDirection();
        }
        
        // Déplacer l'ennemi
        this.move(this.direction.x, this.direction.y, deltaTime);
        
        // Gérer les collisions avec les murs
        const collision = Collision.handleWallCollision(this, walls);
        
        // Si collision avec un mur, changer de direction
        if (collision) {
            this.directionChangeTimer = 2; // Forcer un changement de direction
        }
    }
}