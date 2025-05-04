export default class Player {
    constructor(scaleRatio) {
        this.canvasX = 0;
        this.canvasY = 0;
        this.width = 50 * scaleRatio;
        this.height = 50 * scaleRatio;
        this.speedX = 0;
        this.speedY = 0;
        this.speedValue = 300 * scaleRatio;
        this.color = '#ff5555';
        this.shootCooldown = 0;
        this.shootCooldownTime = 0.2;
        this.health = 6;
        this.maxHealth = 6;
        this.invulnerable = false;
        this.invulnerableTime = 0;
        this.scaleRatio = scaleRatio;
    }
    
    resize(scaleRatio) {
        this.width = 50 * scaleRatio;
        this.height = 50 * scaleRatio;
        this.speedValue = 300 * scaleRatio;
        this.scaleRatio = scaleRatio;
    }
    
    update(deltaTime) {
        this.canvasX += this.speedX * deltaTime;
        this.canvasY += this.speedY * deltaTime;
        
        if (this.shootCooldown > 0) {
            this.shootCooldown -= deltaTime;
        }
        
        if (this.invulnerable) {
            this.invulnerableTime -= deltaTime;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }
    }
    
    takeDamage() {
        if (!this.invulnerable) {
            this.health--;
            this.invulnerable = true;
            this.invulnerableTime = 1.0; // 1 seconde d'invulnérabilité
            return this.health <= 0;
        }
        return false;
    }
    
    getCenter() {
        return {
            x: this.canvasX + this.width / 2,
            y: this.canvasY + this.height / 2
        };
    }
    render(ctx) {
        ctx.save();
        // Clignoter si invulnérable
        if (this.invulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.fillStyle = 'rgba(255, 85, 85, 0.5)';
        } else {
            ctx.fillStyle = this.color;
        }
        ctx.fillRect(this.canvasX, this.canvasY, this.width, this.height);
        ctx.restore();
        
        // Dessiner la barre de vie
        this.renderHealth(ctx);
    }
    
    renderHealth(ctx) {
        ctx.save();
        const heartSize = 20 * this.scaleRatio;
        const startX = 10 * this.scaleRatio;
        const startY = 10 * this.scaleRatio;
        
        // Dessiner les cœurs pleins
        ctx.fillStyle = 'red';
        for (let i = 0; i < this.health; i++) {
            const x = startX + (i % 6) * (heartSize + 5 * this.scaleRatio);
            const y = startY + Math.floor(i / 6) * (heartSize + 5 * this.scaleRatio);
            ctx.fillRect(x, y, heartSize, heartSize);
        }
        
        // Dessiner les cœurs vides
        ctx.fillStyle = 'darkred';
        for (let i = this.health; i < this.maxHealth; i++) {
            const x = startX + (i % 6) * (heartSize + 5 * this.scaleRatio);
            const y = startY + Math.floor(i / 6) * (heartSize + 5 * this.scaleRatio);
            ctx.fillRect(x, y, heartSize, heartSize);
        }
        ctx.restore();
    }
}