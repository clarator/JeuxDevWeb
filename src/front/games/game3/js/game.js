import Map from './map.js';
import { InputManager } from './inputManager.js';
import Player from './player.js';

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Ajuster la taille du canvas à la fenêtre
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialiser la map
        this.map = new Map(canvas);
        
        // Le joueur sera initialisé après le chargement de la carte
        this.player = null;
        
        // Initialiser le gestionnaire d'entrées
        this.inputManager = new InputManager(this);
        
        // Pour calculer le deltaTime
        this.lastTime = 0;
        
        // État du jeu
        this.isRunning = false;
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        this.isRunning = true;
        
        const grid = [
            [2,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0],
            [0,0,0,1,0,0,0,1,0,0,0,1,0,1,1,1],
            [0,0,1,1,1,1,1,1,1,0,0,1,0,1,0,0],
            [0,0,1,1,0,0,0,1,1,0,0,1,0,1,1,0],
            [0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,0],
            [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0],
        ];

        this.map.loadMap(grid);
        
        // Créer le joueur à la position de spawn
        this.player = new Player(this.map, this.map.spawnX, this.map.spawnY);
        
        // Centrer la caméra sur le joueur au démarrage
        this.map.updateCameraPosition(
            this.player.gridX * this.map.cellSize,
            this.player.gridY * this.map.cellSize
        );
        
        // Démarrer la boucle de jeu
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    update(deltaTime) {
        if (!this.player) return;
        
        // Mettre à jour le joueur
        this.player.update(deltaTime);
        
        // Si le joueur n'est pas en mouvement, vérifier les entrées pour un nouveau déplacement
        if (!this.player.isMoving) {
            let dirX = 0;
            let dirY = 0;
            
            // Touches fléchées pour déplacer le joueur
            if (this.inputManager.isKeyPressed('ArrowUp') || this.inputManager.isKeyPressed('KeyW') || this.inputManager.isKeyPressed('KeyZ')) {
                dirY = -1;
            } else if (this.inputManager.isKeyPressed('ArrowDown') || this.inputManager.isKeyPressed('KeyS')) {
                dirY = 1;
            } else if (this.inputManager.isKeyPressed('ArrowLeft') || this.inputManager.isKeyPressed('KeyA') || this.inputManager.isKeyPressed('KeyQ')) {
                dirX = -1;
            } else if (this.inputManager.isKeyPressed('ArrowRight') || this.inputManager.isKeyPressed('KeyD')) {
                dirX = 1;
            }
            
            // Tenter de déplacer le joueur
            if (dirX !== 0 || dirY !== 0) {
                // On essaie de déplacer et on stocke si ça a réussi
                const moved = this.player.move(dirX, dirY);
                
                // Feedback visuel si le mouvement est réussi (vous pourriez ajouter un son ici plus tard)
                if (moved) {
                    console.log("Mouvement lancé dans la direction: ", dirX, dirY);
                }
            }
        }
        
        // Mettre à jour la position de la caméra pour suivre le joueur
        this.map.updateCameraPosition(this.player.visualX, this.player.visualY);
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return;
        
        // Calculer le deltaTime
        const now = timestamp || performance.now();
        const deltaTime = now - this.lastTime;
        this.lastTime = now;
        
        // Mettre à jour l'état du jeu
        this.update(deltaTime);
        
        // Dessiner la carte
        this.map.render();
        
        // Dessiner le joueur
        if (this.player) {
            this.player.render(this.ctx, this.map.cameraX, this.map.cameraY);
        }
        
        // Continuer la boucle
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
}