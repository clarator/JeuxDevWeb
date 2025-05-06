// src/front/games/game2/js/WaveManager.js
import ChaserEnemy from './chaserEnemy.js';
import ShooterEnemy from './shooterEnemy.js';
import WandererEnemy from './wandererEnemy.js';
import { saveWaveGame2 } from '../../common/scoreManager.js';

export default class WaveManager {
    constructor(game, pseudo) {
        this.game = game;
        this.currentWave = 1;
        this.enemiesRemaining = 0;
        this.waveTimer = 0;
        this.waveDelay = 3; // Délai entre les vagues en secondes
        this.waveInProgress = false;
        this.betweenWaves = true;
        this.baseEnemyCount = 3;
    }
    
    reset() {
        this.currentWave = 1;
        this.enemiesRemaining = 0;
        this.waveTimer = 2; // Court délai avant la première vague
        this.waveInProgress = false;
        this.betweenWaves = true;
    }
    
    update(deltaTime) {
        // Si nous sommes entre deux vagues, décompter le timer
        if (this.betweenWaves) {
            this.waveTimer -= deltaTime;
            
            // Si le timer est écoulé, démarrer une nouvelle vague
            if (this.waveTimer <= 0) {
                this.startWave();
            }
            return;
        }
        
        // Si une vague est en cours, vérifier si tous les ennemis sont éliminés
        if (this.waveInProgress && this.game.enemies.length === 0) {
            this.endWave();
        }
    }
    
    startWave() {
        this.waveInProgress = true;
        this.betweenWaves = false;
        
        // Déterminer le nombre d'ennemis pour cette vague
        const enemyCount = this.calculateEnemyCount();
        
        // Faire apparaître les ennemis
        this.spawnEnemies(enemyCount);
        
        this.enemiesRemaining = enemyCount;
    }
    
    endWave() {
        /*
        console.log("Pseudo récupéré :", this.pseudo); // ⬅︎ ligne de debug
        console.log("Vague actuelle :", wave); // ⬅︎ ligne de debug  
        console.log(this.pseudo, wave);
        saveWaveGame2(this.pseudo, wave);  */

        this.waveInProgress = false;
        this.betweenWaves = true;
        this.currentWave++;
        this.waveTimer = this.waveDelay;
    }
    
    calculateEnemyCount() {
        // Progression douce pour les premières vagues
        if (this.currentWave === 1) {
            return this.baseEnemyCount; // 3 ennemis
        } else if (this.currentWave === 2) {
            return this.baseEnemyCount + 1; // 4 ennemis
        } else if (this.currentWave === 3) {
            return this.baseEnemyCount + 2; // 5 ennemis
        } else {
            // À partir de la vague 4, progression plus rapide
            return this.baseEnemyCount + 2 + (this.currentWave - 3) * 2;
        }
    }
    
    spawnEnemies(count) {
        const scaleRatio = this.game.getScaleRatio();
        
        for (let i = 0; i < count; i++) {
            const type = this.getEnemyType();
            
            // Position aléatoire loin du joueur
            let x, y;
            let tooClose = true;
            
            while (tooClose) {
                x = Math.random() * (this.game.canvas.width - 40 * scaleRatio);
                y = Math.random() * (this.game.canvas.height - 40 * scaleRatio);
                
                // Distance du joueur
                const distX = x - this.game.player.canvasX;
                const distY = y - this.game.player.canvasY;
                const distance = Math.sqrt(distX * distX + distY * distY);
                
                if (distance > 200 * scaleRatio) { // Au moins 200 pixels du joueur
                    tooClose = false;
                }
            }
            
            // Créer et ajouter l'ennemi
            this.game.enemies.push(this.createEnemy(x, y, type, scaleRatio));
        }
    }
    
    getEnemyType() {
        if (this.currentWave === 1) {
            // Vague 1: Uniquement des wanderers
            return 'wanderer';
        } else if (this.currentWave <= 3) {
            // Vagues 2-3: Wanderers et chasers
            return Math.random() < 0.5 ? 'wanderer' : 'chaser';
        } else if (this.currentWave <= 5) {
            // Vagues 4-5: Tous les types
            const rand = Math.random();
            if (rand < 0.4) return 'wanderer';
            if (rand < 0.7) return 'chaser';
            return 'shooter';
        } else {
            // Vague 6+: Plus de shooters
            const rand = Math.random();
            if (rand < 0.2) return 'wanderer';
            if (rand < 0.4) return 'chaser';
            return 'shooter';
        }
    }
    
    onEnemyKilled() {
        this.enemiesRemaining--;
    }
    
    createEnemy(x, y, type, scaleRatio) {
        switch(type) {
            case 'chaser':
                return new ChaserEnemy(x, y, scaleRatio, this.game);
            case 'shooter':
                return new ShooterEnemy(x, y, scaleRatio, this.game);
            case 'wanderer':
                return new WandererEnemy(x, y, scaleRatio, this.game);
            default:
                throw new Error(`Type d'ennemi inconnu: ${type}`);
        }
    }
    
    render(ctx) {
        ctx.save();
        const scaleRatio = this.game.getScaleRatio();
        
        ctx.fillStyle = 'white';
        ctx.font = `${Math.floor(20 * scaleRatio)}px Arial`;
        ctx.textAlign = 'right';
        
        // Afficher le numéro de vague
        ctx.fillText(`Vague: ${this.currentWave}`, ctx.canvas.width - 20 * scaleRatio, 30 * scaleRatio);
        
        // Afficher les ennemis restants
        ctx.fillText(`Ennemis: ${this.game.enemies.length}`, ctx.canvas.width - 20 * scaleRatio, 60 * scaleRatio);
        
        // Si entre deux vagues, afficher le compte à rebours
        if (this.betweenWaves) {
            ctx.textAlign = 'center';
            ctx.font = `${Math.floor(40 * scaleRatio)}px Arial`;
            ctx.fillText(
                `Prochaine vague dans ${Math.ceil(this.waveTimer)}`, 
                ctx.canvas.width / 2, 
                ctx.canvas.height / 4
            );
        }
        ctx.restore();
    }
}