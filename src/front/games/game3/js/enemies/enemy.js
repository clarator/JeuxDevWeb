// Classe de base pour tous les ennemis
export class Enemy {
    constructor(game, x, y, health, speed, reward, config) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.health = health;
        this.maxHealth = config.maxHealth || health;
        this.baseSpeed = speed;
        this.speed = speed;
        this.reward = reward;
        
        // Paramètres de configuration
        this.color = config.color || '#FF0000';
        this.radius = config.radius || 10;
        
        // Navigation sur le chemin
        this.path = game.map.enemyPath;
        this.currentPathIndex = 1; // Commence à l'index 1 car on est déjà au point de départ (index 0)
        this.targetX = this.path[this.currentPathIndex].x;
        this.targetY = this.path[this.currentPathIndex].y;
        this.pathProgress = 0; // Progression sur le chemin (0 à 1)
        
        // État
        this.reachedEnd = false;
        this.isSlowed = false;
        this.slowTimer = 0;
        this.slowFactor = 1;
    }
    
    update(deltaTime) {
        // Gestion de l'effet de ralentissement
        if (this.isSlowed) {
            this.slowTimer -= deltaTime;
            if (this.slowTimer <= 0) {
                this.removeSlowEffect();
            }
        }
        
        // Déplacement vers le point cible
        this.moveTowardsTarget(deltaTime);
        
        // Mettre à jour la progression sur le chemin
        this.updatePathProgress();
    }
    
    moveTowardsTarget(deltaTime) {
        // Calculer la direction vers la cible
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Si on est arrivé au point cible
        if (distance < this.speed * deltaTime) {
            // Aller directement au point cible
            this.x = this.targetX;
            this.y = this.targetY;
            
            // Passer au point suivant du chemin
            this.currentPathIndex++;
            
            // Vérifier si on a atteint la fin du chemin
            if (this.currentPathIndex >= this.path.length) {
                this.reachedEnd = true;
            } else {
                // Définir la nouvelle cible
                this.targetX = this.path[this.currentPathIndex].x;
                this.targetY = this.path[this.currentPathIndex].y;
            }
        } else {
            // Continuer à se déplacer vers la cible
            const dirX = dx / distance;
            const dirY = dy / distance;
            
            this.x += dirX * this.speed * deltaTime;
            this.y += dirY * this.speed * deltaTime;
        }
    }
    
    updatePathProgress() {
        // Calculer la progression sur le chemin (0 à 1)
        // Utilisé pour déterminer quelle cible est la plus avancée
        const totalPathLength = this.path.length - 1;
        const currentProgress = (this.currentPathIndex - 1) / totalPathLength;
        
        // Ajouter la progression vers le point actuel
        if (this.currentPathIndex < this.path.length) {
            const prevPoint = this.path[this.currentPathIndex - 1];
            const currPoint = this.path[this.currentPathIndex];
            
            const segmentLength = Math.sqrt(
                Math.pow(currPoint.x - prevPoint.x, 2) +
                Math.pow(currPoint.y - prevPoint.y, 2)
            );
            
            const distanceTravelled = Math.sqrt(
                Math.pow(this.x - prevPoint.x, 2) +
                Math.pow(this.y - prevPoint.y, 2)
            );
            
            const segmentProgress = distanceTravelled / segmentLength;
            const segmentWeight = 1 / totalPathLength;
            
            this.pathProgress = currentProgress + segmentProgress * segmentWeight;
        } else {
            this.pathProgress = 1;
        }
    }
    
    takeDamage(amount) {
        this.health -= amount;
        
        // La suppression est gérée par le EnemyManager
        return this.health <= 0;
    }
    
    applySlow(factor, duration) {
        // Appliquer un effet de ralentissement
        this.isSlowed = true;
        this.slowFactor = factor;
        this.slowTimer = duration;
        this.speed = this.baseSpeed * factor;
    }
    
    removeSlowEffect() {
        // Supprimer l'effet de ralentissement
        this.isSlowed = false;
        this.slowFactor = 1;
        this.speed = this.baseSpeed;
    }
    
    draw() {
        // Méthode à implémenter dans les sous-classes
        console.error('La méthode draw doit être implémentée dans les sous-classes');
    }
    
    drawHealthBar() {
        const canvas = this.game.canvas;
        const healthPercentage = this.health / this.maxHealth;
        const barWidth = this.radius * 2;
        const barHeight = 4;
        
        // Dessiner le fond de la barre de vie
        canvas.drawRect(
            this.x - barWidth / 2,
            this.y - this.radius - barHeight - 2,
            barWidth,
            barHeight,
            '#333333'
        );
        
        // Dessiner la barre de vie
        const color = healthPercentage > 0.5 ? '#33CC33' : (healthPercentage > 0.25 ? '#FFCC00' : '#CC3333');
        canvas.drawRect(
            this.x - barWidth / 2,
            this.y - this.radius - barHeight - 2,
            barWidth * healthPercentage,
            barHeight,
            color
        );
    }
}