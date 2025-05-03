import { CELL_SIZE } from "./game.js";

export default class Snake {
    constructor() {
        this.segments = [];
        this.color = '#ff0000';
        this.speed = 2; // Plus lent que le joueur
        this.activationTimer = 0;
        this.activationDelay = 1000; // Délai d'activation en millisecondes
        this.isActive = false;
        this.playerHasMoved = false;
    }

    startLevel(x, y) {
        this.segments = [{ x: x, y: y }];
        this.activationTimer = 0;
        this.isActive = false;
    }

    update(deltaTime, player, map) {
        if (!this.playerHasMoved && player.isMoving) {
            this.playerHasMoved = true;
        }
        if (this.playerHasMoved) {
            if (!this.isActive) {
                this.activationTimer += deltaTime;
                
                // Activer le serpent après le délai
                if (this.activationTimer >= this.activationDelay) {
                    this.isActive = true;
                }
                
                return; // Ne pas mettre à jour le serpent tant qu'il n'est pas activé
            }
        }
    }

    checkCollision(playerX, playerY) {
        if (!this.isActive) return false;
        // Vérifier si la tête du serpent est sur la même case que le joueur
        const head = this.segments[0];
        return (Math.floor(playerX / CELL_SIZE) === head.x && 
                Math.floor(playerY / CELL_SIZE) === head.y);
    }

    render(ctx, camera) {
        if (this.segments.length === 0 || !this.isActive) return;
        
        ctx.save();
        
        // Dessiner chaque segment du serpent
        for (let i = 0; i < this.segments.length; i++) {
            const segment = this.segments[i];
            const screenX = segment.x * CELL_SIZE - camera.cameraX;
            const screenY = segment.y * CELL_SIZE - camera.cameraY;
            
            // Couleur dégradée du rouge au noir pour l'effet serpent
            const alpha = 1 - (i / this.segments.length) * 0.7;
            ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
            
            // Dessiner le segment
            ctx.fillRect(
                screenX + 5, 
                screenY + 5, 
                CELL_SIZE - 10, 
                CELL_SIZE - 10
            );
            
            // Pour la tête, ajouter des "yeux"
            if (i === 0) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(
                    screenX + CELL_SIZE / 4, 
                    screenY + CELL_SIZE / 4, 
                    CELL_SIZE / 10, 
                    CELL_SIZE / 10
                );
                ctx.fillRect(
                    screenX + CELL_SIZE * 3/4 - CELL_SIZE / 10, 
                    screenY + CELL_SIZE / 4, 
                    CELL_SIZE / 10, 
                    CELL_SIZE / 10
                );
            }
        }
        
        ctx.restore();
    }
}