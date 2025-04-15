export default class Game {
    constructor(canvasId) {
        // Configuration du canvas
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Dimensions de la fenêtre
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Taille constante du monde de jeu (indépendante de la taille d'écran)
        this.worldWidth = 2000;  // Taille aléatoire pour la démo
        this.worldHeight = 2000; // Taille aléatoire pour la démo
        
        // Position de la caméra
        this.camera = {
            x: 0,
            y: 0,
            width: this.canvas.width,
            height: this.canvas.height,
            speed: 10
        };

        // Génération d'une carte aléatoire
        this.generateRandomMap();
        
        // Variables pour le contrôle de la caméra
        this.keys = {
            ArrowLeft: false,
            ArrowRight: false,
            ArrowUp: false,
            ArrowDown: false
        };
        
        // Écouteurs d'événements pour le contrôle de la caméra
        this.setupEventListeners();
        
        // Variables de jeu
        this.lastTime = 0;
        this.isRunning = false;
    }

    resizeCanvas() {
        // Ajuster le canvas à la taille de la fenêtre
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    generateRandomMap() {
        // Générer une carte aléatoire
        this.map = {
            tiles: [],
            tileSize: 50 // Taille de chaque tuile en pixels
        };

        // Créer une grille de tuiles aléatoires
        for (let y = 0; y < this.worldHeight / this.map.tileSize; y++) {
            this.map.tiles[y] = [];
            for (let x = 0; x < this.worldWidth / this.map.tileSize; x++) {
                // Type de tuile aléatoire entre 0 et 4 (pour différentes couleurs)
                this.map.tiles[y][x] = Math.floor(Math.random() * 5);
            }
        }
    }

    setupEventListeners() {
        // Écouteurs pour les touches du clavier (contrôle de la caméra)
        window.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = false;
            }
        });
    }

    updateCamera(deltaTime) {
        // Déplacer la caméra selon les touches appuyées
        const moveDistance = this.camera.speed * (deltaTime / 16.667); // Normalisation par rapport à 60 FPS
        
        if (this.keys.ArrowLeft) {
            this.camera.x = Math.max(0, this.camera.x - moveDistance);
        }
        if (this.keys.ArrowRight) {
            this.camera.x = Math.min(this.worldWidth - this.camera.width, this.camera.x + moveDistance);
        }
        if (this.keys.ArrowUp) {
            this.camera.y = Math.max(0, this.camera.y - moveDistance);
        }
        if (this.keys.ArrowDown) {
            this.camera.y = Math.min(this.worldHeight - this.camera.height, this.camera.y + moveDistance);
        }
    }

    drawMap() {
        // Calculer quelles tuiles sont visibles dans la caméra
        const startX = Math.floor(this.camera.x / this.map.tileSize);
        const startY = Math.floor(this.camera.y / this.map.tileSize);
        const endX = Math.ceil((this.camera.x + this.camera.width) / this.map.tileSize);
        const endY = Math.ceil((this.camera.y + this.camera.height) / this.map.tileSize);
        
        // Dessiner uniquement les tuiles visibles
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                if (y >= 0 && y < this.map.tiles.length && x >= 0 && x < this.map.tiles[y].length) {
                    const tileType = this.map.tiles[y][x];
                    
                    // Définir la couleur selon le type de tuile
                    switch (tileType) {
                        case 0: this.ctx.fillStyle = '#386641'; break; // Vert foncé
                        case 1: this.ctx.fillStyle = '#6a994e'; break; // Vert moyen
                        case 2: this.ctx.fillStyle = '#a7c957'; break; // Vert clair
                        case 3: this.ctx.fillStyle = '#f2e8cf'; break; // Beige
                        case 4: this.ctx.fillStyle = '#bc4749'; break; // Rouge
                    }
                    
                    // Dessiner la tuile (en tenant compte de la position de la caméra)
                    this.ctx.fillRect(
                        x * this.map.tileSize - this.camera.x,
                        y * this.map.tileSize - this.camera.y,
                        this.map.tileSize,
                        this.map.tileSize
                    );
                    
                    // Ajouter une bordure aux tuiles
                    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                    this.ctx.strokeRect(
                        x * this.map.tileSize - this.camera.x,
                        y * this.map.tileSize - this.camera.y,
                        this.map.tileSize,
                        this.map.tileSize
                    );
                }
            }
        }
    }

    drawUI() {
        // Afficher des informations de débogage
        this.ctx.fillStyle = 'white';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`Caméra: (${Math.floor(this.camera.x)}, ${Math.floor(this.camera.y)})`, 10, 20);
        this.ctx.fillText(`Taille du monde: ${this.worldWidth}x${this.worldHeight}`, 10, 40);
        this.ctx.fillText(`Utilisez les flèches du clavier pour déplacer la caméra`, 10, 60);
        
        // Minimap (vue globale de la carte)
        const minimapSize = 150;
        const minimapX = this.canvas.width - minimapSize - 10;
        const minimapY = 10;
        
        // Dessiner le fond de la minimap
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize);
        
        // Dessiner les limites du monde dans la minimap
        this.ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
        this.ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize);
        
        // Dessiner la position de la caméra sur la minimap
        const cameraRatioX = this.camera.x / this.worldWidth;
        const cameraRatioY = this.camera.y / this.worldHeight;
        const cameraWidthRatio = this.camera.width / this.worldWidth;
        const cameraHeightRatio = this.camera.height / this.worldHeight;
        
        this.ctx.strokeStyle = 'yellow';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
            minimapX + cameraRatioX * minimapSize,
            minimapY + cameraRatioY * minimapSize,
            cameraWidthRatio * minimapSize,
            cameraHeightRatio * minimapSize
        );
    }

    start() {
        this.isRunning = true;
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    stop() {
        this.isRunning = false;
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return;

        // Calcul du delta time pour des mouvements fluides
        const deltaTime = timestamp - (this.lastTime || timestamp);
        this.lastTime = timestamp;

        // Mise à jour
        this.updateCamera(deltaTime);

        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dessin
        this.drawMap();
        this.drawUI();

        // Continuer la boucle
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}