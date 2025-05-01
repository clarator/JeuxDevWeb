// player.js - Gestion du joueur
import { DIRECTION, PLAYER, GRID_COLS, GRID_ROWS, COLORS } from './utils/constants.js';

export class Player {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.targetRow = row;
        this.targetCol = col;
        this.direction = DIRECTION.NONE;
        this.moving = false;
        this.speed = PLAYER.SPEED;
        this.size = PLAYER.SIZE;
        this.score = 0;
    }
    
    update(deltaTime, game) {
        // Si le joueur est en mouvement, continuer jusqu'à la prochaine cellule
        if (this.moving) {
            const progress = (this.speed * deltaTime) / 1000; // Progression en cellules
            
            // Déplacer le joueur dans la direction actuelle
            switch (this.direction) {
                case DIRECTION.UP:
                    this.row -= progress;
                    if (this.row <= this.targetRow) {
                        this.row = this.targetRow;
                        this.completeMove(game);
                    }
                    break;
                case DIRECTION.RIGHT:
                    this.col += progress;
                    if (this.col >= this.targetCol) {
                        this.col = this.targetCol;
                        this.completeMove(game);
                    }
                    break;
                case DIRECTION.DOWN:
                    this.row += progress;
                    if (this.row >= this.targetRow) {
                        this.row = this.targetRow;
                        this.completeMove(game);
                    }
                    break;
                case DIRECTION.LEFT:
                    this.col -= progress;
                    if (this.col <= this.targetCol) {
                        this.col = this.targetCol;
                        this.completeMove(game);
                    }
                    break;
            }
        }
    }
    
    completeMove(game) {
        this.moving = false;
        
        // Vérifier les collectibles
        if (game.grid.isCollectible(Math.round(this.row), Math.round(this.col))) {
            game.grid.collectItem(Math.round(this.row), Math.round(this.col));
            this.score += 10;
            game.gameState.score = this.score;
        }
        
        // Vérifier la sortie
        if (game.grid.isExit(Math.round(this.row), Math.round(this.col))) {
            game.gameState.levelComplete = true;
        }
        
        // Dans Tomb of the Mask, le joueur continue de se déplacer jusqu'à ce qu'il heurte un mur
        // Cette fonctionnalité sera implémentée dans la prochaine version
    }
    
    moveInDirection(direction, game) {
        // Ne pas commencer un nouveau mouvement si déjà en mouvement
        if (this.moving) return;
        
        this.direction = direction;
        let newRow = Math.round(this.row);
        let newCol = Math.round(this.col);
        
        // Trouve la position cible dans la direction jusqu'à ce qu'un mur soit rencontré
        switch (direction) {
            case DIRECTION.UP:
                while (!game.grid.isWall(newRow - 1, newCol)) {
                    newRow--;
                }
                break;
            case DIRECTION.RIGHT:
                while (!game.grid.isWall(newRow, newCol + 1)) {
                    newCol++;
                }
                break;
            case DIRECTION.DOWN:
                while (!game.grid.isWall(newRow + 1, newCol)) {
                    newRow++;
                }
                break;
            case DIRECTION.LEFT:
                while (!game.grid.isWall(newRow, newCol - 1)) {
                    newCol--;
                }
                break;
        }
        
        // Ne bouger que si la position cible est différente
        if (newRow !== Math.round(this.row) || newCol !== Math.round(this.col)) {
            this.targetRow = newRow;
            this.targetCol = newCol;
            this.moving = true;
        }
    }
    
    render(ctx, canvasWidth, canvasHeight, game) {
        // Obtenir les informations de rendu de la grille
        // Note: Dans une vraie implémentation, ces infos seraient retournées par game.grid.render
        const gridCellSize = 40; // Prendre la taille par défaut si non disponible
        const scaleX = canvasWidth / (GRID_COLS * gridCellSize);
        const scaleY = canvasHeight / (GRID_ROWS * gridCellSize);
        const scale = Math.min(scaleX, scaleY);
        
        // Centrer la grille
        const offsetX = (canvasWidth - GRID_COLS * gridCellSize * scale) / 2;
        const offsetY = (canvasHeight - GRID_ROWS * gridCellSize * scale) / 2;
        
        const cellSize = gridCellSize * scale;
        const x = offsetX + this.col * cellSize;
        const y = offsetY + this.row * cellSize;
        const size = cellSize * this.size;
        
        // Dessiner le joueur
        ctx.fillStyle = COLORS.PLAYER;
        ctx.fillRect(
            x + (cellSize - size) / 2,
            y + (cellSize - size) / 2,
            size,
            size
        );
        
        // Dessiner les yeux (pour un look basique)
        ctx.fillStyle = '#ffffff';
        const eyeSize = size * 0.2;
        const eyeOffset = size * 0.25;
        
        // Œil gauche
        ctx.fillRect(
            x + (cellSize - size) / 2 + eyeOffset,
            y + (cellSize - size) / 2 + eyeOffset,
            eyeSize,
            eyeSize
        );
        
        // Œil droit
        ctx.fillRect(
            x + (cellSize - size) / 2 + size - eyeOffset - eyeSize,
            y + (cellSize - size) / 2 + eyeOffset,
            eyeSize,
            eyeSize
        );
    }
}