import Utils from "./utils.js";
import Collision from "./collision.js";

export default class Projectile {
    constructor(x, y, direction, speed, size, scaleRatio, source = 'player') {
        this.x = x;
        this.y = y;
        this.direction = { ...direction }; // Copie de l'objet direction
        this.speed = Utils.scaleValue(speed, scaleRatio);
        this.width = Utils.scaleValue(size, scaleRatio);
        this.height = Utils.scaleValue(size, scaleRatio);
        this.active = true;
        this.source = source; // 'player' ou 'enemy'
    }
    
    // Mettre à jour la position du projectile
    update(deltaTime, walls, scaleRatio) {
        // Mettre à jour la position en fonction de la direction et de la vitesse
        this.x += this.direction.x * this.speed * deltaTime;
        this.y += this.direction.y * this.speed * deltaTime;
        
        // Vérifier les collisions avec les murs
        const collision = Collision.handleWallCollision(this, walls);
        
        // Si collision avec un mur, désactiver le projectile
        if (collision) {
            this.active = false;
        }
    }
    
    // Dessiner le projectile
    draw(ctx) {
        // Couleur différente selon la source
        ctx.fillStyle = this.source === 'player' ? 'yellow' : 'orangered';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    // Redimensionner le projectile en fonction du ratio d'échelle
    resize(scaleRatio) {
        const scaledSpeed = Utils.scaleValue(500, scaleRatio); // Vitesse de base: 500
        const scaledSize = Utils.scaleValue(10, scaleRatio);   // Taille de base: 10
        
        this.speed = scaledSpeed;
        this.width = scaledSize;
        this.height = scaledSize;
    }
}