// Classe de base pour les ennemis
class Enemy extends Character {
    constructor(x, y, width, height, speed, health, color, shootChance, scaleRatio) {
        super(x, y, width, height, speed, health, scaleRatio);
        
        // Propriétés spécifiques aux ennemis
        this.color = color;
        this.shootChance = shootChance;
        this.isHit = false;
    }
    
    // Dessiner l'ennemi avec sa barre de vie
    draw(ctx) {
        // Changer la couleur si touché
        ctx.fillStyle = this.isHit ? 'white' : this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Dessiner une barre de vie au-dessus de l'ennemi
        const healthBarWidth = this.width;
        const healthBarHeight = Utils.scaleValue(5, 0.5); // Hauteur fixe pour la barre de vie
        
        // Fond de la barre de vie
        ctx.fillStyle = 'darkgray';
        ctx.fillRect(this.x, this.y - healthBarHeight - 2, healthBarWidth, healthBarHeight);
        
        // Barre de vie actuelle
        ctx.fillStyle = 'limegreen';
        const currentHealthWidth = (this.health / this.maxHealth) * healthBarWidth;
        ctx.fillRect(this.x, this.y - healthBarHeight - 2, currentHealthWidth, healthBarHeight);
    }
    
    // Vérifier si l'ennemi veut tirer et créer un projectile si oui
    shoot(player, scaleRatio) {
        if (this.shootChance === 0) return null; // Ne tire pas
        
        if (this.shootCooldown <= 0 && Math.random() < this.shootChance) {
            // Obtenir le centre de l'ennemi et du joueur
            const enemyCenter = this.getCenter();
            const playerCenter = player.getCenter();
            
            // Obtenir le vecteur de direction vers le joueur
            const direction = Utils.getDirectionVector(
                enemyCenter.x, 
                enemyCenter.y, 
                playerCenter.x, 
                playerCenter.y
            );
            
            // Réinitialiser le cooldown (entre 0.8 et 1.5 secondes)
            this.shootCooldown = 0.8 + Math.random() * 0.7;
            
            // Créer et retourner un nouveau projectile ennemi
            return new Projectile(
                enemyCenter.x - Utils.scaleValue(5, scaleRatio),
                enemyCenter.y - Utils.scaleValue(5, scaleRatio),
                direction,
                400, // Vitesse du projectile
                10,  // Taille du projectile
                scaleRatio,
                'enemy' // Indique que c'est un projectile ennemi
            );
        }
        
        return null;
    }
    
    // Recevoir des dégâts avec effet visuel
    takeDamage(damage) {
        const isDead = super.takeDamage(damage);
        
        // Effet visuel quand touché
        this.isHit = true;
        setTimeout(() => { this.isHit = false; }, 200);
        
        return isDead;
    }
    
    // Méthode statique pour créer un ennemi du type spécifié
    static createEnemy(x, y, type, scaleRatio) {
        switch(type) {
            case 'chaser':
                return new ChaserEnemy(x, y, scaleRatio);
            case 'shooter':
                return new ShooterEnemy(x, y, scaleRatio);
            case 'wanderer':
                return new WandererEnemy(x, y, scaleRatio);
            default:
                throw new Error(`Type d'ennemi inconnu: ${type}`);
        }
    }
}