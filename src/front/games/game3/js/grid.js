// grid.js - Gestion de la grille de jeu
import { GRID_COLS, GRID_ROWS, CELL_TYPE, COLORS } from './utils/constants.js';

export class Grid {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.grid = [];
        
        // Initialiser une grille vide
        this.initGrid();
    }
    
    initGrid() {
        // Crée une grille vide avec des murs autour
        this.grid = [];
        
        for (let row = 0; row < GRID_ROWS; row++) {
            this.grid[row] = [];
            for (let col = 0; col < GRID_COLS; col++) {
                // Placer des murs sur les bords
                if (row === 0 || col === 0 || row === GRID_ROWS - 1 || col === GRID_COLS - 1) {
                    this.grid[row][col] = CELL_TYPE.WALL;
                } else {
                    this.grid[row][col] = CELL_TYPE.EMPTY;
                }
            }
        }
        
        // Ajouter quelques murs intérieurs pour le niveau de départ
        this.grid[3][4] = CELL_TYPE.WALL;
        this.grid[3][5] = CELL_TYPE.WALL;
        this.grid[3][6] = CELL_TYPE.WALL;
        this.grid[5][2] = CELL_TYPE.WALL;
        this.grid[5][3] = CELL_TYPE.WALL;
        this.grid[5][7] = CELL_TYPE.WALL;
        this.grid[5][8] = CELL_TYPE.WALL;
        this.grid[7][4] = CELL_TYPE.WALL;
        this.grid[7][5] = CELL_TYPE.WALL;
        this.grid[7][6] = CELL_TYPE.WALL;
        
        // Ajouter quelques collectibles
        this.grid[2][2] = CELL_TYPE.COLLECTIBLE;
        this.grid[2][8] = CELL_TYPE.COLLECTIBLE;
        this.grid[8][2] = CELL_TYPE.COLLECTIBLE;
        this.grid[8][8] = CELL_TYPE.COLLECTIBLE;
        
        // Ajouter la sortie
        this.grid[10][14] = CELL_TYPE.EXIT;
    }
    
    getCell(row, col) {
        // Vérifie si les coordonnées sont valides
        if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) {
            return CELL_TYPE.WALL; // Traiter hors limites comme un mur
        }
        return this.grid[row][col];
    }
    
    setCell(row, col, type) {
        if (row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS) {
            this.grid[row][col] = type;
        }
    }
    
    isWall(row, col) {
        return this.getCell(row, col) === CELL_TYPE.WALL;
    }
    
    isCollectible(row, col) {
        return this.getCell(row, col) === CELL_TYPE.COLLECTIBLE;
    }
    
    isExit(row, col) {
        return this.getCell(row, col) === CELL_TYPE.EXIT;
    }
    
    collectItem(row, col) {
        if (this.isCollectible(row, col)) {
            this.setCell(row, col, CELL_TYPE.EMPTY);
            return true;
        }
        return false;
    }
    
    render(ctx, canvasWidth, canvasHeight) {
        // Calculer l'échelle pour adapter la grille au canvas
        const scaleX = canvasWidth / (GRID_COLS * this.cellSize);
        const scaleY = canvasHeight / (GRID_ROWS * this.cellSize);
        const scale = Math.min(scaleX, scaleY);
        
        // Centrer la grille
        const offsetX = (canvasWidth - GRID_COLS * this.cellSize * scale) / 2;
        const offsetY = (canvasHeight - GRID_ROWS * this.cellSize * scale) / 2;
        
        // Dessiner la grille et son contenu
        for (let row = 0; row < GRID_ROWS; row++) {
            for (let col = 0; col < GRID_COLS; col++) {
                const cellType = this.grid[row][col];
                const x = offsetX + col * this.cellSize * scale;
                const y = offsetY + row * this.cellSize * scale;
                const size = this.cellSize * scale;
                
                // Dessiner la cellule en fonction de son type
                switch (cellType) {
                    case CELL_TYPE.WALL:
                        ctx.fillStyle = COLORS.WALL;
                        ctx.fillRect(x, y, size, size);
                        break;
                        
                    case CELL_TYPE.COLLECTIBLE:
                        ctx.fillStyle = COLORS.COLLECTIBLE;
                        ctx.beginPath();
                        ctx.arc(x + size/2, y + size/2, size/4, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                        
                    case CELL_TYPE.EXIT:
                        ctx.fillStyle = COLORS.GRID;
                        ctx.fillRect(x, y, size, size);
                        // Dessiner la porte de sortie
                        ctx.fillStyle = '#4CAF50';
                        ctx.fillRect(x + size * 0.1, y + size * 0.1, size * 0.8, size * 0.8);
                        break;
                        
                    default:
                        // Cellule vide - juste dessiner la grille
                        ctx.strokeStyle = COLORS.GRID;
                        ctx.strokeRect(x, y, size, size);
                }
            }
        }
        
        return { offsetX, offsetY, scale }; // Retourner les infos pour le rendu d'autres entités
    }
}
