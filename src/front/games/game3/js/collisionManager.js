// Gestionnaire des collisions
export class CollisionManager {
    constructor(game) {
        this.game = game;
    }
    
    checkCollisions() {
        // Vérifier les collisions entre projectiles et ennemis
        this.checkProjectileEnemyCollisions();
    }
    
    checkProjectileEnemyCollisions() {
        const projectiles = this.game.projectileManager.projectiles;
        const enemies = this.game.enemyManager.enemies;
        
        // Parcourir tous les projectiles
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const projectile = projectiles[i];
            
            // Ignorer les projectiles déjà touchés
            if (projectile.hit) continue;
            
            let hasHit = false;
            
            // Vérifier la collision avec chaque ennemi
            for (const enemy of enemies) {
                // Calculer la distance entre le projectile et l'ennemi
                const dx = projectile.x - enemy.x;
                const dy = projectile.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Rayon de collision = rayon de l'ennemi + rayon du projectile
                const collisionRadius = enemy.radius + projectile.hitRadius;
                
                if (distance <= collisionRadius) {
                    // Collision détectée
                    enemy.takeDamage(projectile.damage);
                    
                    // Marquer le projectile comme touché
                    projectile.hit = true;
                    hasHit = true;
                    
                    // Supprimer le projectile s'il n'est pas traversant
                    if (!projectile.piercing) {
                        projectiles.splice(i, 1);
                    }
                    
                    break; // Passer au projectile suivant si non traversant
                }
            }
            
            // Gérer les projectiles à effet de zone lors d'un impact
            if (hasHit && projectile.areaEffect) {
                this.handleAreaEffect(projectile);
            }
        }
    }
    
    handleAreaEffect(projectile) {
        // Appliquer des dégâts de zone
        if (projectile.areaDamage && projectile.areaRadius) {
            this.game.enemyManager.applyAreaDamage(
                projectile.x,
                projectile.y,
                projectile.areaRadius,
                projectile.areaDamage
            );
        }
        
        // Appliquer un effet de ralentissement
        if (projectile.slowEffect) {
            this.game.enemyManager.applySlowEffect(
                projectile.x,
                projectile.y,
                projectile.areaRadius,
                projectile.slowFactor,
                projectile.slowDuration
            );
        }
    }
    
    // Vérifier si un point est dans un rectangle
    isPointInRect(x, y, rectX, rectY, rectWidth, rectHeight) {
        return (
            x >= rectX &&
            x <= rectX + rectWidth &&
            y >= rectY &&
            y <= rectY + rectHeight
        );
    }
    
    // Vérifier si deux rectangles se chevauchent
    doRectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
        return !(
            x1 + w1 < x2 ||
            x2 + w2 < x1 ||
            y1 + h1 < y2 ||
            y2 + h2 < y1
        );
    }
    
    // Vérifier si deux cercles se chevauchent
    doCirclesOverlap(x1, y1, r1, x2, y2, r2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= r1 + r2;
    }
}