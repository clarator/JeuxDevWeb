export default class Projectile {
    constructor(x, y, direction, source = 'player', scaleRatio) {
        // Position et dimensions
        this.canvasX = x;
        this.canvasY = y;
        this.direction = direction;
        this.speed = 500 * scaleRatio;
        this.width = 10 * scaleRatio;
        this.height = 10 * scaleRatio;
        
        // Propriétés du tir
        this.source = source; // 'player' ou 'enemy'
        this.color = source === 'player' ? '#ffff00' : 'orangered';
        this.scaleRatio = scaleRatio;
        
        // Pour la pénétration - mémorisation des ennemis déjà touchés
        this.touchedEnemies = [];
    }
    
    // Redimensionne le projectile lors du changement de taille d'écran
    resize(scaleRatio) {
        this.speed = 500 * scaleRatio;
        this.width = 10 * scaleRatio;
        this.height = 10 * scaleRatio;
        this.scaleRatio = scaleRatio;
    }
    
    // Mise à jour du projectile à chaque frame
    update(deltaTime) {
        // Déplacement selon la direction et la vitesse
        this.canvasX += this.direction.x * this.speed * deltaTime;
        this.canvasY += this.direction.y * this.speed * deltaTime;
    }
    
    // Vérifie si le projectile est toujours dans les limites du canvas
    isInBounds(canvasWidth, canvasHeight) {
        return (
            this.canvasX > -this.width &&
            this.canvasX < canvasWidth + this.width &&
            this.canvasY > -this.height &&
            this.canvasY < canvasHeight + this.height
        );
    }
    
    // Affichage du projectile
    render(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.canvasX, this.canvasY, this.width, this.height);
        ctx.restore();
    }
}