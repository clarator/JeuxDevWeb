export default class Map {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.grid = null;
        
        // Taille de chaque cellule de la grille
        this.cellSize = 50;
        
        // Position de la caméra (décalage de la vue)
        this.cameraX = 0;
        this.cameraY = 0;
        
        // Position du point de spawn (sera déterminée lors du chargement de la carte)
        this.spawnX = 0;
        this.spawnY = 0;
        
        // Vitesse de la caméra pour le suivi du joueur
        this.cameraSpeed = 0.1; // Facteur de lissage (0-1)
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
    
    // Déplacer la caméra pour suivre le joueur
    updateCameraPosition(playerX, playerY) {
        // Calculer la position cible de la caméra (centrée sur le joueur)
        const targetCameraX = playerX - this.canvas.width / 2 + this.cellSize / 2;
        const targetCameraY = playerY - this.canvas.height / 2 + this.cellSize / 2;
        
        // Appliquer un mouvement lissé vers la position cible
        this.cameraX += (targetCameraX - this.cameraX) * this.cameraSpeed;
        this.cameraY += (targetCameraY - this.cameraY) * this.cameraSpeed;
    }

    render() {
        if (!this.grid) return;
        
        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Parcourir la grille et dessiner chaque cellule
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                const cellValue = this.grid[y][x];
                
                // Calculer la position de la cellule ajustée à la caméra
                const posX = x * this.cellSize - this.cameraX;
                const posY = y * this.cellSize - this.cameraY;
                
                // Vérifier si la cellule est visible à l'écran
                if (
                    posX + this.cellSize < 0 || 
                    posX > this.canvas.width || 
                    posY + this.cellSize < 0 || 
                    posY > this.canvas.height
                ) {
                    continue; // Ne pas dessiner les cellules hors écran
                }
                
                // Dessiner différentes cellules selon leur valeur
                if (cellValue === 0) {
                    // Mur
                    this.ctx.fillStyle = '#333';
                    this.ctx.fillRect(posX, posY, this.cellSize, this.cellSize);
                    
                    // Bordure pour mieux voir les cellules
                    this.ctx.strokeStyle = '#444';
                    this.ctx.strokeRect(posX, posY, this.cellSize, this.cellSize);
                } else if (cellValue === 1 || cellValue === 2) {
                    // Espace vide ou spawn
                    this.ctx.fillStyle = cellValue === 1 ? '#eee' : '#aaffaa';
                    this.ctx.fillRect(posX, posY, this.cellSize, this.cellSize);
                    
                    // Bordure pour mieux voir les cellules
                    this.ctx.strokeStyle = '#ddd';
                    this.ctx.strokeRect(posX, posY, this.cellSize, this.cellSize);
                    
                    // Si c'est un spawn, ajouter un indicateur visuel
                    if (cellValue === 2) {
                        this.ctx.fillStyle = '#00aa00';
                        this.ctx.beginPath();
                        this.ctx.arc(
                            posX + this.cellSize / 2,
                            posY + this.cellSize / 2,
                            this.cellSize / 6,
                            0,
                            Math.PI * 2
                        );
                        this.ctx.fill();
                    }
                }
                // Vous pourrez ajouter d'autres types de cellules ici plus tard
            }
        }
    }
}