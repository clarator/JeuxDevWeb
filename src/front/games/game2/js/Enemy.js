export default class Enemy {
    constructor(x, y, width, height, speed, health, color, shootChance, scaleRatio, game) {
        // Position et dimensions
        this.canvasX = x;
        this.canvasY = y;
        this.width = width * scaleRatio;
        this.height = height * scaleRatio;
        
        // Vitesse et direction
        this.speedX = 0;
        this.speedY = 0;
        this.speedValue = speed * scaleRatio;
        
        // Santé et aspect
        this.health = health;
        this.maxHealth = health;
        this.color = color;
        
        // Propriétés de tir
        this.shootChance = shootChance;
        this.shootCooldown = 0;
        
        // État et références
        this.isHit = false;
        this.scaleRatio = scaleRatio;
        this.baseSpeed = speed;
        this.game = game; // Référence au jeu principal
        
        // Rotation
        this.angle = 0; // Angle en radians
        
        // Image (définie par les sous-classes)
        this.image = null;
        this.imageLoaded = false;
    }
    
    // Redimensionne l'ennemi lors du changement de taille d'écran
    resize(scaleRatio) {
        this.width = 40 * scaleRatio;
        this.height = 40 * scaleRatio;
        this.speedValue = this.baseSpeed * scaleRatio;
        this.scaleRatio = scaleRatio;
    }
    
    // Mise à jour de l'ennemi à chaque frame
    update(deltaTime) {
        // Déplacement selon la vitesse
        this.canvasX += this.speedX * deltaTime;
        this.canvasY += this.speedY * deltaTime;
        
        // Réduction du temps de recharge du tir
        if (this.shootCooldown > 0) {
            this.shootCooldown -= deltaTime;
        }
        
        // Calcul de l'angle en fonction de la direction du mouvement
        if (this.speedX !== 0 || this.speedY !== 0) {
            this.angle = Math.atan2(this.speedY, this.speedX);
        }
    }
    
    // Retourne le centre de l'ennemi
    getCenter() {
        return {
            x: this.canvasX + this.width / 2,
            y: this.canvasY + this.height / 2
        };
    }
    
    // Gère les dégâts infligés à l'ennemi
    takeDamage(damage) {
        this.health -= damage;
        this.isHit = true;
        setTimeout(() => { this.isHit = false; }, 200);
        
        if (this.health <= 0) {
            // Attribution d'expérience en fonction du type d'ennemi
            let baseExp = 10; // Par défaut
            
            if (this.constructor.name === 'ShooterEnemy') baseExp = 15;
            else if (this.constructor.name === 'ChaserEnemy') baseExp = 12;
            
            // Bonus par vague
            const waveBonus = this.game ? Math.floor(this.game.waveManager.currentWave * 2) : 0;
            const expAmount = baseExp + waveBonus;
            
            // Ajout de l'expérience au joueur
            if (this.game && this.game.experienceManager) {
                this.game.experienceManager.addExperience(expAmount);
            }
            return true; // L'ennemi est mort
        }
        
        return false; // L'ennemi est encore en vie
    }
    
    // Vérifie si l'ennemi peut tirer
    canShoot() {
        return this.shootChance > 0 && this.shootCooldown <= 0;
    }
    
    // Active le temps de recharge du tir
    triggerShootCooldown() {
        this.shootCooldown = 0.8 + Math.random() * 0.7; // Entre 0.8 et 1.5 secondes
    }
    
    // Affichage de l'ennemi et de sa barre de vie
    render(ctx) {
        ctx.save();
        
        const center = this.getCenter();
        
        // Applique la rotation et affiche l'image ou un rectangle de repli
        ctx.translate(center.x, center.y);
        ctx.rotate(this.angle);
        
        if (this.imageLoaded) {
            // Si l'image est chargée, l'afficher
            ctx.drawImage(
                this.image,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
        } else {
            // Sinon, afficher un rectangle coloré
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