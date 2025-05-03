import { CELL_SIZE } from "./game.js";

export default class Map {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.grid = null;
        
        // Position du point de spawn (sera déterminée lors du chargement de la carte)
        this.spawnX = 0;
        this.spawnY = 0;
    }

    loadMap(grid) {
        this.grid = grid;
        
        // Chercher le point de spawn (valeur 2) dans la grille
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x] === 2) {
                    this.spawnX = x;
                    this.spawnY = y;
                    return; // Une fois trouvé, on sort de la fonction
                }
            }
        }
        
        // Si aucun point de spawn n'est trouvé, on utilise la première cellule vide
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x] === 1) {
                    this.spawnX = x;
                    this.spawnY = y;
                    return;
                }
            }
        }
    }

    render(camera) {
        if (!this.grid) return;

        this.ctx.save();
        // Parcourir la grille et dessiner chaque cellule
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                const cellValue = this.grid[y][x];
                
                // Calculer la position de la cellule ajustée à la caméra
                const posX = x * CELL_SIZE - camera.cameraX;
                const posY = y * CELL_SIZE - camera.cameraY;
                
                // Vérifier si la cellule est visible à l'écran
                if (
                    posX + CELL_SIZE < 0 || 
                    posX > this.canvas.width || 
                    posY + CELL_SIZE < 0 || 
                    posY > this.canvas.height
                ) {
                    continue; // Ne pas dessiner les cellules hors écran
                }
                
                // Dessiner différentes cellules selon leur valeur
                if (cellValue === 0) {
                    // Mur
                    this.ctx.fillStyle = '#333';
                    this.ctx.fillRect(posX, posY, CELL_SIZE, CELL_SIZE);
                    
                    // Bordure pour mieux voir les cellules
                    this.ctx.strokeStyle = '#444';
                    this.ctx.strokeRect(posX, posY, CELL_SIZE, CELL_SIZE);
                } else if (cellValue === 1 || cellValue === 2) {
                    // Espace vide ou spawn
                    this.ctx.fillStyle = cellValue === 1 ? '#eee' : '#aaffaa';
                    this.ctx.fillRect(posX, posY, CELL_SIZE, CELL_SIZE);
                    
                    // Bordure pour mieux voir les cellules
                    this.ctx.strokeStyle = '#ddd';
                    this.ctx.strokeRect(posX, posY, CELL_SIZE, CELL_SIZE);
                }
            }
        }
        this.ctx.restore();
    }
}