import { CELL_SIZE } from "./game.js";

export default class Player {
    constructor(x, y) {
        this.gridX = x; // Position sur la grille (pas en pixels)
        this.gridY = y;

        this.isMoving = false;
        
        // Couleur du joueur
        this.color = '#ff5555';
        
        // Position visuelle actuelle (en pixels)
        this.canvasX = this.gridX * CELL_SIZE;
        this.canvasY = this.gridY * CELL_SIZE;
    
        this.lastDirection = null; // Dernière direction de mouvement

        this.speedX = 0; // Vitesse sur l'axe X
        this.speedY = 0; // Vitesse sur l'axe Y

        this.speedValue = 6;
    } 

    update() {
        this.canvasX += this.speedX;
        this.canvasY += this.speedY;
    }

    stopMoving() {
        this.speedX = 0;
        this.speedY = 0;
        this.isMoving = false;
    }

    // Dessiner le joueur
    render(ctx, camera) {
        ctx.save();

        const screenX = this.canvasX - camera.cameraX;
        const screenY = this.canvasY - camera.cameraY;
        
        // Dessiner le joueur comme un carré rouge
        ctx.fillStyle = this.color;
        ctx.fillRect(
            screenX + 2, 
            screenY + 2, 
            CELL_SIZE - 4, 
            CELL_SIZE - 4
        );
        ctx.restore();
    }
    
}