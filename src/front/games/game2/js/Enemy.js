// src/front/games/game2/js/Enemy.js
export default class Enemy {
    constructor(x, y, width, height, speed, health, color, shootChance, scaleRatio, game) {
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
        this.game = game; // Référence au jeu
        
        // Pour la rotation
        this.angle = 0; // Angle en radians
        
        // Image de l'ennemi (sera définie par les sous-classes)
        this.image = null;
        this.imageLoaded = false;
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
        
        // Calculer l'angle basé sur la direction du mouvement
        if (this.speedX !== 0 || this.speedY !== 0) {
            this.angle = Math.atan2(this.speedY, this.speedX);
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
        
        if (this.health <= 0) {
            // Ajouter de l'expérience en fonction du type d'ennemi
            let baseExp = 10; // Par défaut
            
            if (this.constructor.name === 'ShooterEnemy') baseExp = 15;
            else if (this.constructor.name === 'ChaserEnemy') baseExp = 12;
            
            const waveBonus = this.game ? Math.floor(this.game.waveManager.currentWave * 2) : 0;
            const expAmount = baseExp + waveBonus;
            
            if (this.game && this.game.experienceManager) {
                this.game.experienceManager.addExperience(expAmount);
            }
            return true;
        }
        
        return false;
    }
    
    canShoot() {
        return this.shootChance > 0 && this.shootCooldown <= 0;
    }
    
    triggerShootCooldown() {
        this.shootCooldown = 0.8 + Math.random() * 0.7; // Entre 0.8 et 1.5 secondes
    }
    
    render(ctx) {
        ctx.save();
        
        const center = this.getCenter();
        
        // Appliquer la rotation et dessiner l'image si chargée
        ctx.translate(center.x, center.y);
        ctx.rotate(this.angle);
        
        if (this.imageLoaded) {
            // Si l'image est chargée, la dessiner
            ctx.drawImage(
                this.image,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
        } else {
            // Sinon, dessiner un rectangle pour le fallback
            // Changer la couleur si touché
            ctx.fillStyle = this.isHit ? 'white' : this.color;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }
        
        ctx.restore();
        
        // Barre de vie (sans rotation)
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