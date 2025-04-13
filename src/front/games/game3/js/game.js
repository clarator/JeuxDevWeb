// Le module principal qui orchestre tout le jeu
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
        this.isRunning = true;
        this.map.init();
        this.ui.init();
        this.waveManager.startWave();
        this.gameLoop(0);
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
        
        // Vérification des collisions
        this.collisionManager.checkCollisions();
        
        // Vérification de fin de jeu
        if (this.player.lives <= 0) {
            this.gameOver = true;
            console.log("Game Over!");
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
            console.log("Pas assez d'or!");
        }
    }
    
    placeTower(x, y) {
        if (this.placingTower && this.map.canPlaceTower(x, y)) {
            this.player.spendGold(this.placingTower.cost);
            this.towerManager.addTower(this.placingTower.type, x, y);
            this.placingTower = null;
            return true;
        }
        return false;
    }
    
    cancelPlacingTower() {
        this.placingTower = null;
    }
    
    enemyReachedEnd(enemy) {
        this.player.takeDamage(1);
        this.enemyManager.removeEnemy(enemy);
    }
    
    enemyKilled(enemy) {
        this.player.addGold(enemy.reward);
        this.enemyManager.removeEnemy(enemy);
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
    }
    
    restart() {
        // Réinitialisation du jeu
        this.player.reset();
        this.enemyManager.reset();
        this.towerManager.reset();
        this.projectileManager.reset();
        this.waveManager.reset();
        this.gameOver = false;
        this.start();
    }
}