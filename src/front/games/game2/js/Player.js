// Classe pour gérer le joueur
class Player extends Character {
    constructor(x, y, scaleRatio) {
        // Appel du constructeur parent avec les paramètres spécifiques au joueur
        super(x, y, 50, 50, 300, 6, scaleRatio);
        
        // Propriétés spécifiques au joueur
        this.invulnerable = false;
        this.invulnerableTime = 0;
    }
    
    // Mettre à jour la position et l'état du joueur
    update(deltaTime, inputHandler, walls, scaleRatio) {
        // Appel de la méthode parente
        super.update(deltaTime, walls, scaleRatio);
        
        // Obtenir la direction à partir des entrées
        const newDirection = inputHandler.getDirection();
        
        // Mettre à jour la position
        this.move(newDirection.x, newDirection.y, deltaTime);
        
        // Gérer les collisions avec les murs
        Collision.handleWallCollision(this, walls);
        
        // Mettre à jour l'invulnérabilité
        if (this.invulnerable) {
            this.invulnerableTime -= deltaTime;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }
        
        // Mettre à jour la direction de tir en fonction de la souris
        this.direction = inputHandler.getShootingDirection(this.x, this.y, this.width, this.height);
    }
    
    // Dessiner le joueur
    draw(ctx) {
        // Si invulnérable, faire clignoter le joueur
        if (this.invulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        } else {
            ctx.fillStyle = 'white';
        }
        
        // Dessiner le corps du joueur
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Dessiner une ligne indiquant la direction de tir
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const center = this.getCenter();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(
            center.x + this.direction.x * 30,
            center.y + this.direction.y * 30
        );
        ctx.stroke();
        
        // Dessiner les points de vie
        this.drawHealth(ctx);
    }
    
    // Dessiner la barre de vie du joueur
    drawHealth(ctx) {
        const heartSize = 20;
        const startX = 10;
        const startY = 10;
        
        // Dessiner les cœurs pleins
        ctx.fillStyle = 'red';
        for (let i = 0; i < this.health; i++) {
            const x = startX + (i % 6) * (heartSize + 5);
            const y = startY + Math.floor(i / 6) * (heartSize + 5);
            
            // Dessiner un cœur (simplifié comme un carré pour l'instant)
            ctx.fillRect(x, y, heartSize, heartSize);
        }
        
        // Dessiner les cœurs vides
        ctx.fillStyle = 'darkred';
        for (let i = this.health; i < this.maxHealth; i++) {
            const x = startX + (i % 6) * (heartSize + 5);
            const y = startY + Math.floor(i / 6) * (heartSize + 5);
            
            ctx.fillRect(x, y, heartSize, heartSize);
        }
    }
    
    // Vérifier si le joueur peut tirer et créer un projectile si possible
    shoot(scaleRatio) {
        if (this.shootCooldown <= 0 && (this.direction.x !== 0 || this.direction.y !== 0)) {
            // Réinitialiser le cooldown
            this.shootCooldown = 0.2; // 200ms
            
            // Obtenir le centre du joueur
            const center = this.getCenter();
            
            // Créer et retourner un nouveau projectile
            return new Projectile(
                center.x - Utils.scaleValue(5, scaleRatio),
                center.y - Utils.scaleValue(5, scaleRatio),
                this.direction,
                500, // Vitesse de base du projectile
                10,  // Taille de base du projectile
                scaleRatio,
                'player' // Indique que c'est un projectile du joueur
            );
        }
        
        return null;
    }
    
    // Prendre des dégâts avec gestion de l'invulnérabilité
    takeDamage() {
        if (!this.invulnerable) {
            super.takeDamage(1);
            this.invulnerable = true;
            this.invulnerableTime = 1.0; // 1 seconde d'invulnérabilité
            
            // Si plus de vie, game over (géré à l'extérieur)
            return this.health <= 0;
        }
        return false;
    }
}