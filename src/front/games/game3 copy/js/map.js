// Classe pour gérer la carte du jeu
export class Map {
    constructor(canvas) {
        this.canvas = canvas;
        this.tileSize = 40; // Taille d'une tuile en pixels
        this.gridWidth = Math.floor(canvas.width / this.tileSize);
        this.gridHeight = Math.floor(canvas.height / this.tileSize);
        
        // Types de tuiles
        this.TILE_TYPES = {
            EMPTY: 0,
            PATH: 1,
            OBSTACLE: 2,
            TOWER: 3
        };
        
        // Couleurs des tuiles
        this.TILE_COLORS = {
            [this.TILE_TYPES.EMPTY]: '#8FBC8F',    // Herbe
            [this.TILE_TYPES.PATH]: '#A0522D',     // Chemin
            [this.TILE_TYPES.OBSTACLE]: '#708090', // Obstacle
            [this.TILE_TYPES.TOWER]: '#4682B4'     // Tour
        };
        
        // Initialisation de la grille
        this.grid = this.createEmptyGrid();
        
        // Points du chemin (coordonnées en tuiles)
        this.pathPoints = [];
        this.enemyPath = [];
    }
    
    init() {
        this.createMap();
        this.calculateEnemyPath();
    }
    
    createEmptyGrid() {
        // Création d'une grille vide
        const grid = [];
        for (let y = 0; y < this.gridHeight; y++) {
            grid[y] = [];
            for (let x = 0; x < this.gridWidth; x++) {
                grid[y][x] = this.TILE_TYPES.EMPTY;
            }
        }
        return grid;
    }
    
    createMap() {
        // Définition du chemin (à personnaliser selon vos besoins)
        this.pathPoints = [
            { x: 0, y: 5 },
            { x: 5, y: 5 },
            { x: 5, y: 2 },
            { x: 10, y: 2 },
            { x: 10, y: 8 },
            { x: 15, y: 8 },
            { x: 15, y: 5 },
            { x: 19, y: 5 }
        ];
        
        // Placer le chemin sur la grille
        for (let i = 0; i < this.pathPoints.length - 1; i++) {
            const current = this.pathPoints[i];
            const next = this.pathPoints[i + 1];
            
            // Tracer le chemin entre les deux points
            this.drawPathBetweenPoints(current, next);
        }
        
        // Ajouter quelques obstacles
        this.addObstacles();
    }
    
    drawPathBetweenPoints(point1, point2) {
        const startX = Math.min(point1.x, point2.x);
        const endX = Math.max(point1.x, point2.x);
        const startY = Math.min(point1.y, point2.y);
        const endY = Math.max(point1.y, point2.y);
        
        if (point1.x === point2.x) {
            // Chemin vertical
            for (let y = startY; y <= endY; y++) {
                this.grid[y][point1.x] = this.TILE_TYPES.PATH;
            }
        } else if (point1.y === point2.y) {
            // Chemin horizontal
            for (let x = startX; x <= endX; x++) {
                this.grid[point1.y][x] = this.TILE_TYPES.PATH;
            }
        }
    }
    
    addObstacles() {
        // Ajouter quelques obstacles aléatoires
        const numObstacles = 15;
        let placed = 0;
        
        while (placed < numObstacles) {
            const x = Math.floor(Math.random() * this.gridWidth);
            const y = Math.floor(Math.random() * this.gridHeight);
            
            // Vérifier que ce n'est pas sur le chemin
            if (this.grid[y][x] === this.TILE_TYPES.EMPTY) {
                this.grid[y][x] = this.TILE_TYPES.OBSTACLE;
                placed++;
            }
        }
    }
    
    calculateEnemyPath() {
        this.enemyPath = [];
        
        // Convertir les positions de tuiles en positions en pixels (centre de la tuile)
        for (const point of this.pathPoints) {
            this.enemyPath.push({
                x: (point.x + 0.5) * this.tileSize,
                y: (point.y + 0.5) * this.tileSize
            });
        }
    }
    
    draw() {
        // Dessiner la grille
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const tileType = this.grid[y][x];
                const color = this.TILE_COLORS[tileType];
                
                // Dessiner la tuile
                this.canvas.drawRect(
                    x * this.tileSize,
                    y * this.tileSize,
                    this.tileSize,
                    this.tileSize,
                    color
                );
                
                // Dessiner la bordure de la tuile
                this.canvas.drawLine(
                    x * this.tileSize,
                    y * this.tileSize,
                    (x + 1) * this.tileSize,
                    y * this.tileSize,
                    '#00000033', 1
                );
                this.canvas.drawLine(
                    x * this.tileSize,
                    y * this.tileSize,
                    x * this.tileSize,
                    (y + 1) * this.tileSize,
                    '#00000033', 1
                );
            }
        }
    }
    
    canPlaceTower(gridX, gridY) {
        // Vérifier que les coordonnées sont valides
        if (gridX < 0 || gridX >= this.gridWidth || gridY < 0 || gridY >= this.gridHeight) {
            return false;
        }
        
        // Vérifier que la tuile est vide (pas de chemin, pas d'obstacle, pas de tour)
        return this.grid[gridY][gridX] === this.TILE_TYPES.EMPTY;
    }
    
    placeTower(gridX, gridY) {
        if (this.canPlaceTower(gridX, gridY)) {
            this.grid[gridY][gridX] = this.TILE_TYPES.TOWER;
            return true;
        }
        return false;
    }
    
    removeTower(gridX, gridY) {
        if (gridX >= 0 && gridX < this.gridWidth && gridY >= 0 && gridY < this.gridHeight) {
            if (this.grid[gridY][gridX] === this.TILE_TYPES.TOWER) {
                this.grid[gridY][gridX] = this.TILE_TYPES.EMPTY;
                return true;
            }
        }
        return false;
    }
    
    // Obtenir le point de départ des ennemis (premier point du chemin)
    getStartPoint() {
        return this.enemyPath[0];
    }
    
    // Obtenir le point d'arrivée des ennemis (dernier point du chemin)
    getEndPoint() {
        return this.enemyPath[this.enemyPath.length - 1];
    }
    
    // Vérifier si les coordonnées sont sur le chemin
    isOnPath(gridX, gridY) {
        return this.grid[gridY][gridX] === this.TILE_TYPES.PATH;
    }
    
    // Convertir les coordonnées de la grille en coordonnées du monde
    gridToWorld(gridX, gridY) {
        return {
            x: gridX * this.tileSize + this.tileSize / 2,
            y: gridY * this.tileSize + this.tileSize / 2
        };
    }
    
    // Convertir les coordonnées du monde en coordonnées de la grille
    worldToGrid(x, y) {
        return {
            gridX: Math.floor(x / this.tileSize),
            gridY: Math.floor(y / this.tileSize)
        };
    }
}