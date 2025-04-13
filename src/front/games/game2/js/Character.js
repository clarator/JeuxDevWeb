// Classe de base pour tous les personnages (joueur et ennemis)
class Character {
    constructor(x, y, width, height, speed, health, scaleRatio) {
        // Position
        this.x = x;
        this.y = y;
        
        // Dimensions
        this.baseWidth = width;  // Taille de référence non mise à l'échelle
        this.baseHeight = height;
        this.width = Utils.scaleValue(width, scaleRatio);
        this.height = Utils.scaleValue(height, scaleRatio);
        
        // Mouvement
        this.baseSpeed = speed;  // Vitesse de référence non mise à l'échelle
        this.speed = Utils.scaleValue(speed, scaleRatio);
        this.direction = { x: 0, y: 0 };
        
        // Combat
        this.health = health;
        this.maxHealth = health;
        this.shootCooldown = 0;
    }
    
    // Mise à jour générique - à remplacer dans les sous-classes
    update(deltaTime, walls, scaleRatio) {
        // Mettre à jour le cooldown des tirs
        if (this.shootCooldown > 0) {
            this.shootCooldown -= deltaTime;
        }
    }
    
    // Méthode pour s'assurer que la direction est valide
    ensureDirection() {
        if (!this.direction) {
            this.direction = { x: 0, y: 0 };
        }
    }
    
    // Obtenir les coordonnées du centre du personnage
    getCenter() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }
    
    // Déplacer le personnage dans une direction donnée
    move(directionX, directionY, deltaTime) {
        this.x += directionX * this.speed * deltaTime;
        this.y += directionY * this.speed * deltaTime;
    }
    
    // Recevoir des dégâts
    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }
    
    // Tirer un projectile - à implémenter dans les sous-classes
    shoot(scaleRatio) {
        // Méthode abstraite
        return null;
    }
    
    // Dessiner le personnage - à remplacer dans les sous-classes
    draw(ctx) {
        // Méthode abstraite
    }
    
    // Redimensionner le personnage en fonction du ratio d'échelle
    resize(scaleRatio) {
        this.width = Utils.scaleValue(this.baseWidth, scaleRatio);
        this.height = Utils.scaleValue(this.baseHeight, scaleRatio);
        this.speed = Utils.scaleValue(this.baseSpeed, scaleRatio);
    }
}