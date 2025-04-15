// Mise à jour du fichier src/front/games/game3/js/game.js

// Importer le gestionnaire d'effets
import { Canvas } from './canvas.js';
import { InputHandler } from './input.js';
import { UIManager } from './ui.js';
import { Map } from './map.js';
import { TowerManager } from './towers/towerManager.js';
import { EnemyManager } from './enemies/enemyManager.js';
import { ProjectileManager } from './projectiles/projectileManager.js';
import { WaveManager } from './waveManager.js';
import { CollisionManager } from './collisionManager.js';
import { Player } from './player.js';
import { EffectsManager } from './effects/effectsManager.js';

export class Game {
    constructor() {
        // Initialisation du canvas
        this.canvas = new Canvas('gameCanvas', 800, 600);
        
        // Initialisation des gestionnaires
        this.input = new InputHandler(this);
        this.ui = new UIManager();
        this.map = new Map(this.canvas);
        this.player = new Player();
        this.towerManager = new TowerManager(this);
        this.enemyManager = new EnemyManager(this);
        this.projectileManager = new ProjectileManager(this);
        this.waveManager = new WaveManager(this);
        this.collisionManager = new CollisionManager(this);
        this.effectsManager = new EffectsManager(this);
        
        // États du jeu
        this.isRunning = false;
        this.isPaused = false;
        this.gameOver = false;
        
        // Gestion du temps
        this.lastTime = 0;
        this.deltaTime = 0;

        // Mode de placement des tours
        this.placingTower = null;
    }
    
    start() {
        // S'assurer que tous les composants sont initialisés
        if (!this.map || !this.ui || !this.player || !this.waveManager) {
            console.error("Certains composants du jeu ne sont pas correctement initialisés.");
            return;
        }
        
        this.isRunning = true;
        
        // Initialiser les composants dans le bon ordre
        this.map.init();
        this.ui.init();
        
        // S'assurer que le joueur est correctement initialisé
        if (this.player.gold === undefined) {
            this.player = new Player(); // Réinitialiser le joueur si nécessaire
        }
        
        // Démarrer la première vague
        this.waveManager.startWave();
        
        // Commencer la boucle de jeu
        if (this.gameLoop) {
            this.gameLoop(0);
        } else {
            console.error("La boucle de jeu n'est pas définie.");
        }
    }
    
    gameLoop(timestamp) {
        // Calcul du delta time pour des animations fluides
        this.deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        
        // Limiter le deltaTime pour éviter les problèmes lors de changement d'onglet
        if (this.deltaTime > 0.1) this.deltaTime = 0.1;
        
        if (!this.isPaused && !this.gameOver) {
            this.update();
            this.render();
        }
        
        if (this.isRunning) {
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }
    
    update() {
        // Mise à jour des différents systèmes
        this.waveManager.update(this.deltaTime);
        this.enemyManager.update(this.deltaTime);
        this.towerManager.update(this.deltaTime);
        this.projectileManager.update(this.deltaTime);
        this.effectsManager.update(this.deltaTime);
        
        // Vérification des collisions
        this.collisionManager.checkCollisions();
        
        // Mise à jour de l'état des boutons de tour (seulement si tous les composants sont initialisés)
        if (this.input && typeof this.input.updateButtonStates === 'function' && this.player) {
            this.input.updateButtonStates();
        }
        
        // Vérification de fin de jeu
        if (this.player && this.player.lives <= 0) {
            this.gameOver = true;
            this.ui.showGameOver();
        }
    }
    
    render() {
        // Effacer le canvas
        this.canvas.clear();
        
        // Dessiner la carte
        this.map.draw();
        
        // Dessiner les entités
        this.enemyManager.draw();
        this.towerManager.draw();
        this.projectileManager.draw();
        this.effectsManager.draw();
        
        // Dessiner l'interface
        this.ui.update(this.player.lives, this.player.gold, this.waveManager.currentWave);
        
        // Dessiner la tour en cours de placement
        if (this.placingTower) {
            this.placingTower.drawPreview(this.input.mouseX, this.input.mouseY);
        }
    }
    
    selectTower(towerType) {
        if (this.player.canAfford(towerType.cost)) {
            this.placingTower = this.towerManager.createTowerPreview(towerType);
        } else {
            this.ui.showMessage("Pas assez d'or!", 1500);
        }
    }
    
    placeTower(x, y) {
        if (this.placingTower && this.map.canPlaceTower(x, y)) {
            this.player.spendGold(this.placingTower.cost);
            this.towerManager.addTower(this.placingTower.type, x, y);
            this.placingTower = null;
            return true;
        }
        
        if (this.placingTower && !this.map.canPlaceTower(x, y)) {
            this.ui.showMessage("Impossible de placer une tour ici!", 1500);
        }
        
        return false;
    }
    
    cancelPlacingTower() {
        this.placingTower = null;
    }
    
    enemyReachedEnd(enemy) {
        this.player.takeDamage(1);
        this.enemyManager.removeEnemy(enemy);
        this.effectsManager.createFloatingText(enemy.x, enemy.y - 20, "-1 vie", "#FF0000");
    }
    
    enemyKilled(enemy) {
        // Ajouter l'or au joueur
        this.player.addGold(enemy.reward);
        
        // Afficher le gain d'or
        this.effectsManager.createFloatingText(enemy.x, enemy.y - 20, "+" + enemy.reward, "#FFD700");
        
        // Créer un effet d'explosion
        this.effectsManager.createExplosion(enemy.x, enemy.y, enemy.radius * 2, "#FF0000");
        
        // Supprimer l'ennemi
        this.enemyManager.removeEnemy(enemy);
    }
    
    pause() {
        this.isPaused = true;
        this.ui.showMessage("Jeu en pause - Appuyez sur P pour continuer", 0);
    }
    
    resume() {
        this.isPaused = false;
        // Supprimer le message de pause
        const pauseMessage = document.querySelector('.game-message');
        if (pauseMessage) pauseMessage.remove();
    }
    
    restart() {
        // Réinitialisation du jeu
        this.player.reset();
        this.enemyManager.reset();
        this.towerManager.reset();
        this.projectileManager.reset();
        this.waveManager.reset();
        this.effectsManager.clear();
        this.gameOver = false;
        this.ui.hideGameOver();
        this.start();
    }
}