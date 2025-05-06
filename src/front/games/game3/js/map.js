import { CELL_SIZE } from "./Game.js";

export default class Map {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.grid = null;

        // Chargement de l'image des pièces d'or
        this.collectibleImage = new Image();
        this.collectibleImage.src = '../../assets/img/game3/pieceOr.png';
        
        // Position du point de départ du joueur
        this.spawnX = 0;
        this.spawnY = 0;
    }

    // Charge une carte à partir des données de niveau
    loadMap(level) {
        // Copie profonde de la grille et des collectibles pour éviter les références
        this.grid = level.grid.map(row => [...row]);
        this.collectibles = level.collectibles.map(collectible => ({ ...collectible }));
        
        // Recherche du point de départ (valeur 2) dans la grille
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x] === 2) {
                    this.spawnX = x;
                    this.spawnY = y;
                    return; // Une fois trouvé, on sort de la fonction
                }
            }
        }
        
        // Si aucun point de départ n'est trouvé, utilise la première cellule disponible
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x] === 1) {
                    this.spawnX = x;
                    this.spawnY = y;
                    return;
                }
            }
        }
    }

    // Dessine la carte à l'écran en fonction de la position de la caméra
    render(camera) {
        if (!this.grid) return;
        
        this.ctx.save();
        // Parcours la grille et dessine chaque cellule
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                const cellValue = this.grid[y][x];
                
                // Calcule la position de la cellule en tenant compte de la caméra
                const posX = x * CELL_SIZE - camera.cameraX;
                const posY = y * CELL_SIZE - camera.cameraY;
                
                // Optimisation : ne dessine que les cellules visibles à l'écran
                if (
                    posX + CELL_SIZE < 0 || 
                    posX > this.canvas.width || 
                    posY + CELL_SIZE < 0 || 
                    posY > this.canvas.height
                ) {
                    continue; // Ignore les cellules hors écran
                }
                
                // Dessine les cellules de chemin, de départ et de sortie
                if (cellValue === 1 || cellValue === 2 || cellValue === 3) {
                    
                    if (cellValue === 2) {
                        this.ctx.fillStyle = '#aaffaa'; // Vert clair pour le point de départ
                    }
                    else if (cellValue === 3) {
                        this.ctx.fillStyle = '#6f61c2'; // Violet pour la sortie
                    } else {
                        this.ctx.fillStyle = '#eee'; // Blanc cassé pour les chemins
                    }
                    this.ctx.fillRect(posX, posY, CELL_SIZE, CELL_SIZE);

                    // Contour léger pour toutes les cellules
                    this.ctx.strokeStyle = '#ddd';
                    this.ctx.strokeRect(posX, posY, CELL_SIZE, CELL_SIZE);
                                
                }
            }
        }
        
        // Dessine les objets collectables (pièces d'or)
        for (let collectible of this.collectibles) {
            const posX = collectible.x * CELL_SIZE - camera.cameraX;
            const posY = collectible.y * CELL_SIZE - camera.cameraY;
            
            // Optimisation : ne dessine que les collectibles visibles à l'écran
            if (
                posX + CELL_SIZE < 0 || 
                posX > this.canvas.width || 
                posY + CELL_SIZE < 0 || 
                posY > this.canvas.height
            ) {
                continue; // Ignore les collectibles hors écran
            }
           
            // Dessine l'image de la pièce d'or centrée dans la cellule
            this.ctx.drawImage(
                this.collectibleImage,          
                posX + CELL_SIZE / 4,                
                posY + CELL_SIZE / 4,              
                CELL_SIZE / 2,                       
                CELL_SIZE / 2          
            );
        }
        
        this.ctx.restore();
    }
}