// Classe pour l'ennemi de type "wanderer" qui se déplace aléatoirement
class WandererEnemy extends Enemy {
    constructor(x, y, scaleRatio) {
        // Paramètres spécifiques: width, height, speed, health, color, shootChance
        super(x, y, 40, 40, 100, 3, 'darkred', 0.005, scaleRatio);
        
        // Initialiser avec une direction aléatoire
        this.direction = Utils.getRandomDirection();
        this.directionChangeTimer = 0;
        
        // Stocker la vague actuelle pour adapter le comportement
        this.wave = this.getWaveNumber();
    }
    
    // Obtenir le numéro de la vague actuelle
    getWaveNumber() {
        // Essayer de récupérer le numéro de vague depuis le gestionnaire de vagues
        try {
            return window.game.stateManager.stats.wave;
        } catch(e) {
            return 10; // Valeur par défaut élevée si on ne peut pas récupérer la vague
        }
    }
    
    // Mise à jour spécifique au wanderer: se déplacer aléatoirement
    update(deltaTime, player, walls, scaleRatio) {
        // Appel de la méthode de base
        super.update(deltaTime, walls, scaleRatio);
        
        // Mettre à jour le timer de changement de direction
        this.directionChangeTimer += deltaTime;
        
        // Changer de direction plus lentement dans les premières vagues
        let directionChangeTime = 2; // Par défaut: toutes les 2 secondes
        
        // Vague 1: changement plus lent (toutes les 3 secondes)
        if (this.wave === 1) {
            directionChangeTime = 3;
        }
        
        // Changer de direction selon le timer
        if (this.directionChangeTimer > directionChangeTime) {
            this.directionChangeTimer = 0;
            this.direction = Utils.getRandomDirection();
        }
        
        // Réduire la vitesse pour les vagues 1 et 2
        let speedMultiplier = 1.0;
        if (this.wave === 1) {
            speedMultiplier = 0.6; // 60% de la vitesse normale
        } else if (this.wave === 2) {
            speedMultiplier = 0.8; // 80% de la vitesse normale
        }
        
        // Déplacer l'ennemi avec le multiplicateur de vitesse
        this.move(this.direction.x, this.direction.y, deltaTime * speedMultiplier);
        
        // Gérer les collisions avec les murs
        const collision = Collision.handleWallCollision(this, walls);
        
        // Si collision avec un mur, changer de direction
        if (collision) {
            this.directionChangeTimer = directionChangeTime; // Forcer un changement de direction
        }
    }
}