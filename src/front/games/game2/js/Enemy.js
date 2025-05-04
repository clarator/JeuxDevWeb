export default class Enemy {
    constructor(x, y, width, height, speed, health, color, shootChance, scaleRatio) {
        this.canvasX = x;
        this.canvasY = y;
        this.width = width * scaleRatio;
        this.height = height * scaleRatio;
        this.speedX = 0;
        this.speedY = 0;
        this.speedValue = speed * scaleRatio;
        this.health = health;
        this.maxHealth = health;
        this.color = color;
        this.shootChance = shootChance;
        this.shootCooldown = 0;
        this.isHit = false;
        this.scaleRatio = scaleRatio;
        this.baseSpeed = speed;
    }
    
    resize(scaleRatio) {
        this.width = 40 * scaleRatio;
        this.height = 40 * scaleRatio;
        this.speedValue = this.baseSpeed * scaleRatio;
        this.scaleRatio = scaleRatio;
    }
    
    update(deltaTime) {
        this.canvasX += this.speedX * deltaTime;
        this.canvasY += this.speedY * deltaTime;
        
        if (this.shootCooldown > 0) {
            this.shootCooldown -= deltaTime;
        }
    }
    
    getCenter() {
        return {
            x: this.canvasX + this.width / 2,
            y: this.canvasY + this.height / 2
        };
    }
    
    takeDamage(damage) {
        this.health -= damage;
        this.isHit = true;
        setTimeout(() => { this.isHit = false; }, 200);
        return this.health <= 0;
    }
    
    canShoot() {
        return this.shootChance > 0 && this.shootCooldown <= 0;
    }
    
    triggerShootCooldown() {
        this.shootCooldown = 0.8 + Math.random() * 0.7; // Entre 0.8 et 1.5 secondes
    }
    
    render(ctx) {
        ctx.save();
        // Changer la couleur si touché
        ctx.fillStyle = this.isHit ? 'white' : this.color;
        ctx.fillRect(this.canvasX, this.canvasY, this.width, this.height);
        
        // Barre de vie
        const healthBarWidth = this.width;
        const healthBarHeight = 5 * this.scaleRatio;
        
        // Fond de la barre de vie
        ctx.fillStyle = 'darkgray';
        ctx.fillRect(this.canvasX, this.canvasY - healthBarHeight - 2 * this.scaleRatio, healthBarWidth, healthBarHeight);
        
        // Barre de vie actuelle
        ctx.fillStyle = 'limegreen';
        const currentHealthWidth = (this.health / this.maxHealth) * healthBarWidth;
        ctx.fillRect(this.canvasX, this.canvasY - healthBarHeight - 2 * this.scaleRatio, currentHealthWidth, healthBarHeight);
        ctx.restore();
    }
}