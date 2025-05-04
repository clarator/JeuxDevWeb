// src/front/games/game2/js/Projectile.js
export default class Projectile {
    constructor(x, y, direction, source = 'player', scaleRatio) {
        this.canvasX = x;
        this.canvasY = y;
        this.direction = direction;
        this.speed = 500 * scaleRatio;
        this.width = 10 * scaleRatio;
        this.height = 10 * scaleRatio;
        this.source = source;
        this.color = source === 'player' ? '#ffff00' : 'orangered';
        this.scaleRatio = scaleRatio;
        
        // Pour la pénétration - ennemis touchés
        this.touchedEnemies = []; // Tableau des instances des ennemis déjà touchés
    }
    
    resize(scaleRatio) {
        this.speed = 500 * scaleRatio;
        this.width = 10 * scaleRatio;
        this.height = 10 * scaleRatio;
        this.scaleRatio = scaleRatio;
    }
    
    update(deltaTime) {
        this.canvasX += this.direction.x * this.speed * deltaTime;
        this.canvasY += this.direction.y * this.speed * deltaTime;
    }
    
    isInBounds(canvasWidth, canvasHeight) {
        return (
            this.canvasX > -this.width &&
            this.canvasX < canvasWidth + this.width &&
            this.canvasY > -this.height &&
            this.canvasY < canvasHeight + this.height
        );
    }
    
    render(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.canvasX, this.canvasY, this.width, this.height);
        ctx.restore();
    }
}