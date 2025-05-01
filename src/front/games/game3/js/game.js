// game.js - Gestionnaire principal du jeu
import { Player } from './player.js';
import { Grid } from './grid.js';
import { InputHandler } from './input.js';
import { GAME_WIDTH, GAME_HEIGHT, GRID_SIZE, COLORS } from './utils/constants.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.lastTime = 0;
        this.accumulator = 0;
        this.timeStep = 1000 / 60; // 60 FPS
        
        this.gameState = {
            running: false,
            paused: false,
            gameOver: false,
            levelComplete: false,
            score: 0
        };
        
        this.entities = [];
        this.player = null;
        this.grid = null;
        this.input = null;
    }
    
    init() {
        // Configurer le canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialiser la grille
        this.grid = new Grid(GRID_SIZE);
        
        // Créer le joueur
        this.player = new Player(1, 1); // Position de départ
        this.entities.push(this.player);
        
        // Configurer la gestion des entrées (après avoir configuré le canvas)
        this.input = new InputHandler(this);
    }
    
    resizeCanvas() {
        // Faire correspondre la taille du canvas à la fenêtre avec une marge
        const margin = 20;
        this.canvas.width = Math.min(window.innerWidth - margin, GAME_WIDTH);
        this.canvas.height = Math.min(window.innerHeight - margin, GAME_HEIGHT);
    }
    
    start() {
        this.gameState.running = true;
        requestAnimationFrame(timestamp => this.gameLoop(timestamp));
    }
    
    gameLoop(timestamp) {
        if (!this.gameState.running) return;
        
        // Calcul du delta time
        if (this.lastTime === 0) {
            this.lastTime = timestamp;
        }
        
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Accumulateur pour des mises à jour fixes
        this.accumulator += deltaTime;
        
        // Mise à jour à pas de temps fixe
        while (this.accumulator >= this.timeStep) {
            this.update(this.timeStep);
            this.accumulator -= this.timeStep;
        }
        
        // Rendu
        this.render();
        
        // Continuer la boucle
        requestAnimationFrame(timestamp => this.gameLoop(timestamp));
    }
    
    update(deltaTime) {
        if (this.gameState.paused || this.gameState.gameOver) return;
        
        // Mettre à jour toutes les entités
        this.entities.forEach(entity => {
            if (entity.update) {
                entity.update(deltaTime, this);
            }
        });
        
        // Vérifier les collisions
        this.checkCollisions();
        
        // Vérifier les conditions de fin
        this.checkGameConditions();
    }
    
    render() {
        // Effacer le canvas
        this.ctx.fillStyle = COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dessiner la grille
        this.grid.render(this.ctx, this.canvas.width, this.canvas.height);
        
        // Dessiner toutes les entités
        this.entities.forEach(entity => {
            if (entity.render) {
                entity.render(this.ctx, this.canvas.width, this.canvas.height, this);
            }
        });
        
        // Afficher le score
        this.ctx.fillStyle = COLORS.TEXT;
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.gameState.score}`, 10, 30);
        
        // Afficher les messages de jeu
        if (this.gameState.gameOver) {
            this.displayMessage('Game Over! Tap to restart');
        } else if (this.gameState.levelComplete) {
            this.displayMessage('Level Complete! Tap for next level');
        } else if (this.gameState.paused) {
            this.displayMessage('Paused');
        }
    }
    
    displayMessage(message) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = COLORS.TEXT;
        this.ctx.font = '24px Arial';
        
        const textWidth = this.ctx.measureText(message).width;
        const x = (this.canvas.width - textWidth) / 2;
        const y = this.canvas.height / 2;
        
        this.ctx.fillText(message, x, y);
    }
    
    checkCollisions() {
        // À implémenter: vérification des collisions entre entités et avec la grille
    }
    
    checkGameConditions() {
        // À implémenter: vérification des conditions de victoire/défaite
    }
    
    pause() {
        this.gameState.paused = true;
    }
    
    resume() {
        this.gameState.paused = false;
    }
    
    restart() {
        // Réinitialiser le jeu
        this.gameState = {
            running: true,
            paused: false,
            gameOver: false,
            levelComplete: false,
            score: 0
        };
        
        // Réinitialiser les entités
        this.entities = [];
        this.player = new Player(1, 1);
        this.entities.push(this.player);
    }
}