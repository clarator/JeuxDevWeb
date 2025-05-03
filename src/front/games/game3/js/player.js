import { CELL_SIZE } from "./game.js";

export default class Player {
    constructor(x, y) {
        this.gridX = x; // Position sur la grille (pas en pixels)
        this.gridY = y;

        this.targetX = x; // Position cible sur la grille (pas en pixels)
        this.targetY = y;

        this.isMoving = false;
        
        // Couleur du joueur
        this.color = '#ff5555';
        
        // Position visuelle actuelle (en pixels)
        this.canvasX = this.gridX * CELL_SIZE;
        this.canvasY = this.gridY * CELL_SIZE;
    }

    update(map, right, left, up, down) {
        if (right && this.lastDirection !== 'right') {
            this.targetX += 1;
            this.lastDirection = 'right';
        }
        if (left && this.lastDirection !== 'left') {
            this.targetX -= 1;
            this.lastDirection = 'left';
        }
        if (up && this.lastDirection !== 'up') {
            this.targetY -= 1;
            this.lastDirection = 'up';
        }
        if (down && this.lastDirection !== 'down') {
            this.targetY += 1;
            this.lastDirection = 'down';
        }

        
        this.gridX = Math.floor(this.canvasX/CELL_SIZE);
        this.gridY = Math.floor(this.canvasY/CELL_SIZE);
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