// Classe de base pour toutes les tours
export class Tower {
    constructor(game, x, y, gridX, gridY, config, isPreview = false) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.gridX = gridX;
        this.gridY = gridY;
        this.isPreview = isPreview;
        
        // Configuration de la tour
        this.range = config.range;
        this.fireRate = config.fireRate;
        this.damage = config.damage;
        this.cost = config.cost;
        this.color = config.color;
        this.upgradeOptions = config.upgradeOptions || [];
        
        // État de la tour
        this.level = 1;
        this.target = null;
        this.fireTimer = 0;
        this.canFire = true;
        this.value = this.cost; // Valeur de revente
        
        // Statistiques
        this.killCount = 0;
        this.damageDealt = 0;
    }
    
    update(deltaTime) {
        if (this.isPreview) return; // Les prévisualisations ne sont pas mises à jour
        
        // Gestion du timer de tir
        if (!this.canFire) {
            this.fireTimer += deltaTime;
            if (this.fireTimer >= 1 / this.fireRate) {
                this.canFire = true;
                this.fireTimer = 0;
            }
        }
        
        // Recherche d'une cible
        this.findTarget();
        
        // Tir si possible
        if (this.canFire && this.target) {
            this.fire();
        }
    }
    
    findTarget() {
        // Récupérer tous les ennemis actifs
        const enemies = this.game.enemyManager.enemies;
        
        // Reset de la cible actuelle
        this.target = null;
        
        // Trouver l'ennemi à la portée le plus avancé sur le chemin
        let highestProgress = -1;
        
        for (const enemy of enemies) {
            // Calculer la distance
            const dx = this.x - enemy.x;
            const dy = this.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Vérifier si l'ennemi est à portée
            if (distance <= this.range) {
                // Prendre l'ennemi le plus avancé sur le chemin
                if (enemy.pathProgress > highestProgress) {
                    highestProgress = enemy.pathProgress;
                    this.target = enemy;
                }
            }
        }
    }
    
    fire() {
        if (!this.target) return;
        
        // Créer un projectile dirigé vers la cible
        const projectile = this.createProjectile(this.target);
        
        if (projectile) {
            // Ajouter le projectile au gestionnaire
            this.game.projectileManager.addProjectile(projectile);
            
            // Reset du timer de tir
            this.canFire = false;
            this.fireTimer = 0;
        }
    }
    
    // Méthode à implémenter dans les sous-classes
    createProjectile(target) {
        console.error('La méthode createProjectile doit être implémentée dans les sous-classes');
        return null;
    }
    
    draw() {
        if (this.isPreview) {
            this.drawPreview(this.game.input.mouseX, this.game.input.mouseY);
        } else {
            this.drawTower();
            
            // Dessiner la portée si la tour est sélectionnée
            // (à implémenter plus tard)
        }
    }
    
    // Méthode à implémenter dans les sous-classes
    drawTower() {
        console.error('La méthode drawTower doit être implémentée dans les sous-classes');
    }
    
    drawPreview(mouseX, mouseY) {
        // Obtenir la position de la tuile survolée
        const { gridX, gridY } = this.game.map.worldToGrid(mouseX, mouseY);
        const { x, y } = this.game.map.gridToWorld(gridX, gridY);
        
        // Sauvegarder la position pour utilisation future
        this.x = x;
        this.y = y;
        this.gridX = gridX;
        this.gridY = gridY;
        
        // Vérifier si l'emplacement est valide
        const canPlace = this.game.map.canPlaceTower(gridX, gridY);
        
        // Dessiner la portée
        const alpha = canPlace ? 0.2 : 0.1;
        this.game.canvas.ctx.globalAlpha = alpha;
        this.game.canvas.drawCircle(x, y, this.range, canPlace ? '#00FF00' : '#FF0000');
        this.game.canvas.ctx.globalAlpha = 1;
        
        // Dessiner la tour en semi-transparence
        this.game.canvas.ctx.globalAlpha = 0.7;
        this.drawTower();
        this.game.canvas.ctx.globalAlpha = 1;
    }
    
    // Appliquer une amélioration
    upgrade(index) {
        if (index >= 0 && index < this.upgradeOptions.length) {
            const upgrade = this.upgradeOptions[index];
            
            if (this.game.player.canAfford(upgrade.cost)) {
                // Payer l'amélioration
                this.game.player.spendGold(upgrade.cost);
                
                // Appliquer l'effet
                upgrade.effect(this);
                
                // Augmenter la valeur de la tour
                this.value += upgrade.cost;
                
                // Augmenter le niveau
                this.level++;
                
                return true;
            }
        }
        return false;
    }
    
    // Obtenir la valeur de revente (généralement 80% de la valeur totale investie)
    getSellValue() {
        return Math.floor(this.value * 0.8);
    }
    
    // Vendre la tour
    sell() {
        const sellValue = this.getSellValue();
        this.game.player.addGold(sellValue);
        return sellValue;
    }
    
    // Vérifier si une position est à portée
    isInRange(x, y) {
        const dx = this.x - x;
        const dy = this.y - y;
        const distanceSquared = dx * dx + dy * dy;
        return distanceSquared <= this.range * this.range;
    }
}