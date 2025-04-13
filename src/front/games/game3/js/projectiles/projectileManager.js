// Gestionnaire des projectiles
export class ProjectileManager {
    constructor(game) {
        this.game = game;
        this.projectiles = [];
    }
    
    update(deltaTime) {
        // Mise à jour de tous les projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            
            // Déplacer le projectile
            this.moveProjectile(projectile, deltaTime);
            
            // Vérifier la durée de vie
            projectile.lifetime -= deltaTime;
            if (projectile.lifetime <= 0) {
                this.projectiles.splice(i, 1);
            }
        }
    }
    
    draw() {
        // Dessiner tous les projectiles
        for (const projectile of this.projectiles) {
            this.drawProjectile(projectile);
        }
    }
    
    addProjectile(projectileConfig) {
        // Créer un nouveau projectile
        const projectile = {
            // Position et mouvement
            x: projectileConfig.x,
            y: projectileConfig.y,
            targetX: projectileConfig.targetX,
            targetY: projectileConfig.targetY,
            speed: projectileConfig.speed,
            
            // Apparence
            color: projectileConfig.color || '#FFCC00',
            radius: projectileConfig.radius || 4,
            
            // Effets
            damage: projectileConfig.damage || 10,
            hitRadius: projectileConfig.hitRadius || 5,
            
            // Type et comportement
            type: projectileConfig.type || 'basic',
            homing: projectileConfig.homing || false,
            target: projectileConfig.target || null,
            
            // État
            lifetime: projectileConfig.lifetime || 3, // durée de vie en secondes
            hit: false
        };
        
        // Direction initiale
        const dx = projectile.targetX - projectile.x;
        const dy = projectile.targetY - projectile.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        projectile.dirX = dx / distance;
        projectile.dirY = dy / distance;
        
        this.projectiles.push(projectile);
        return projectile;
    }
    
    moveProjectile(projectile, deltaTime) {
        // Si le projectile a un comportement de suivi et une cible
        if (projectile.homing && projectile.target && !projectile.target.reachedEnd && projectile.target.health > 0) {
            // Mettre à jour la direction vers la cible
            const dx = projectile.target.x - projectile.x;
            const dy = projectile.target.y - projectile.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Éviter la division par zéro
            if (distance > 0) {
                // Mettre à jour la direction avec un facteur de lissage
                const smoothFactor = 0.1; // Plus petit = virage plus serré
                projectile.dirX = projectile.dirX * (1 - smoothFactor) + (dx / distance) * smoothFactor;
                projectile.dirY = projectile.dirY * (1 - smoothFactor) + (dy / distance) * smoothFactor;
                
                // Normaliser la direction
                const dirLength = Math.sqrt(projectile.dirX * projectile.dirX + projectile.dirY * projectile.dirY);
                projectile.dirX /= dirLength;
                projectile.dirY /= dirLength;
            }
        }
        
        // Déplacer le projectile
        projectile.x += projectile.dirX * projectile.speed * deltaTime;
        projectile.y += projectile.dirY * projectile.speed * deltaTime;
    }
    
    drawProjectile(projectile) {
        const canvas = this.game.canvas;
        
        switch (projectile.type) {
            case 'basic':
                // Projectile basique (cercle)
                canvas.drawCircle(projectile.x, projectile.y, projectile.radius, projectile.color);
                break;
                
            case 'laser':
                // Laser (ligne)
                const length = 15;
                const endX = projectile.x + projectile.dirX * length;
                const endY = projectile.y + projectile.dirY * length;
                
                canvas.drawLine(projectile.x, projectile.y, endX, endY, projectile.color, 2);
                break;
                
            case 'missile':
                // Missile (rectangle orienté)
                canvas.save();
                canvas.translate(projectile.x, projectile.y);
                
                // Calculer l'angle de rotation
                const angle = Math.atan2(projectile.dirY, projectile.dirX);
                canvas.rotate(angle);
                
                // Dessiner le missile
                canvas.drawRect(0, -2, 8, 4, projectile.color);
                
                canvas.restore();
                break;
                
            default:
                // Projectile par défaut (cercle)
                canvas.drawCircle(projectile.x, projectile.y, projectile.radius, projectile.color);
        }
    }
    
    reset() {
        this.projectiles = [];
    }
}