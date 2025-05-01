// input.js - Gestion des entrées utilisateur
import { DIRECTION, SWIPE_THRESHOLD } from './utils/constants.js';

export class InputHandler {
    constructor(game) {
        this.game = game;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        
        // Enregistrer les gestionnaires d'événements
        this.setupKeyboardEvents();
        this.setupTouchEvents();
        this.setupMouseEvents();
    }
    
    setupKeyboardEvents() {
        window.addEventListener('keydown', (e) => {
            if (this.game.gameState.gameOver || this.game.gameState.levelComplete) {
                this.game.restart();
                return;
            }
            
            if (this.game.gameState.paused) {
                this.game.resume();
                return;
            }
            
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'z':
                    this.game.player.moveInDirection(DIRECTION.UP, this.game);
                    break;
                case 'ArrowRight':
                case 'd':
                    this.game.player.moveInDirection(DIRECTION.RIGHT, this.game);
                    break;
                case 'ArrowDown':
                case 's':
                    this.game.player.moveInDirection(DIRECTION.DOWN, this.game);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'q':
                    this.game.player.moveInDirection(DIRECTION.LEFT, this.game);
                    break;
                case 'Escape':
                case 'p':
                    this.game.gameState.paused = !this.game.gameState.paused;
                    break;
            }
            
            // Empêcher le défilement de la page avec les touches fléchées
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        });
    }
    
    setupTouchEvents() {
        // Vérifier que le canvas existe
        if (!this.game.canvas) {
            console.error("Canvas not found in game object");
            return;
        }
        
        this.game.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            
            // Gérer le redémarrage ou la reprise sur tap
            if (this.game.gameState.gameOver || this.game.gameState.levelComplete) {
                this.game.restart();
            } else if (this.game.gameState.paused) {
                this.game.resume();
            }
        });
        
        this.game.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });
        
        this.game.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchEndX = e.changedTouches[0].clientX;
            this.touchEndY = e.changedTouches[0].clientY;
            
            // Calculer la direction du swipe
            this.handleSwipe();
        });
    }
    
    setupMouseEvents() {
        // Vérifier que le canvas existe
        if (!this.game.canvas) {
            console.error("Canvas not found in game object");
            return;
        }
        
        this.game.canvas.addEventListener('mousedown', (e) => {
            this.touchStartX = e.clientX;
            this.touchStartY = e.clientY;
            
            // Gérer le redémarrage ou la reprise sur clic
            if (this.game.gameState.gameOver || this.game.gameState.levelComplete) {
                this.game.restart();
            } else if (this.game.gameState.paused) {
                this.game.resume();
            }
        });
        
        this.game.canvas.addEventListener('mouseup', (e) => {
            this.touchEndX = e.clientX;
            this.touchEndY = e.clientY;
            
            // Calculer la direction du swipe
            this.handleSwipe();
        });
    }
    
    handleSwipe() {
        const dx = this.touchEndX - this.touchStartX;
        const dy = this.touchEndY - this.touchStartY;
        
        // Ignorer les petits mouvements (taps)
        if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
            return;
        }
        
        // Déterminer la direction du swipe (horizontale ou verticale)
        if (Math.abs(dx) > Math.abs(dy)) {
            // Mouvement horizontal
            if (dx > 0) {
                this.game.player.moveInDirection(DIRECTION.RIGHT, this.game);
            } else {
                this.game.player.moveInDirection(DIRECTION.LEFT, this.game);
            }
        } else {
            // Mouvement vertical
            if (dy > 0) {
                this.game.player.moveInDirection(DIRECTION.DOWN, this.game);
            } else {
                this.game.player.moveInDirection(DIRECTION.UP, this.game);
            }
        }
    }
}