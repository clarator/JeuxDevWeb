import Utils from "./utils.js";
import ChaserEnemy from "./ChaserEnemy.js";
import ShooterEnemy from "./ShooterEnemy.js";
import WandererEnemy from "./WandererEnemy.js";

export default class WaveManager {
    constructor(game) {
        this.game = game;
        this.currentWave = 1;
        this.enemiesRemaining = 0;
        this.waveTimer = 0;
        this.waveDelay = 5; // Délai entre les vagues en secondes
        this.waveInProgress = false;
        this.betweenWaves = true;
        this.baseEnemyCount = 3; // Réduit de 5 à 3 pour faciliter la première vague
    }
    
    // Mise à jour du gestionnaire de vague
    update(deltaTime) {
        // Ne pas mettre à jour si le jeu est en pause
        if (this.game.stateManager.currentState === this.game.stateManager.states.PAUSE) {
            return;
        }
        
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
    
    // Démarrer une nouvelle vague
    startWave() {
        this.waveInProgress = true;
        this.betweenWaves = false;
        
        // Déterminer le nombre d'ennemis pour cette vague
        const enemyCount = this.calculateEnemyCount();
        
        // Faire apparaître les ennemis
        this.spawnEnemies(enemyCount);
        
        // Mettre à jour l'affichage
        this.enemiesRemaining = enemyCount;
    }
    
    // Terminer la vague actuelle
    endWave() {
        this.waveInProgress = false;
        this.betweenWaves = true;
        this.currentWave++;
        
        // Mettre à jour les statistiques du jeu
        if (this.game.stateManager) {
            this.game.stateManager.nextWave();
        }
        
        // Définir le timer pour la prochaine vague
        this.waveTimer = this.waveDelay;
    }
    
    // Calculer le nombre d'ennemis pour la vague actuelle
    calculateEnemyCount() {
        // Progression plus douce pour les premières vagues
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
    
    // Faire apparaître un nombre donné d'ennemis
    spawnEnemies(count) {
        const scaleRatio = Utils.getScaleRatio(this.game.canvas.width, this.game.canvas.height);
        const wallThickness = Utils.scaleValue(20, scaleRatio);
        
        for (let i = 0; i < count; i++) {
            // Déterminer le type d'ennemi en fonction de la vague
            let typeDistribution = this.getEnemyTypeDistribution();
            let type = this.chooseEnemyType(typeDistribution);
            
            // Calculer une position aléatoire loin du joueur
            let x, y;
            let tooClose = true;
            
            while (tooClose) {
                x = wallThickness + Math.random() * (this.game.canvas.width - 2 * wallThickness - Utils.scaleValue(40, scaleRatio));
                y = wallThickness + Math.random() * (this.game.canvas.height - 2 * wallThickness - Utils.scaleValue(40, scaleRatio));
                
                // Vérifier si la position est suffisamment éloignée du joueur (au moins 200 pixels)
                const distX = x - this.game.player.x;
                const distY = y - this.game.player.y;
                const distance = Math.sqrt(distX * distX + distY * distY);
                
                // Distance augmentée pour les 3 premières vagues pour donner plus d'espace au joueur
                const minDistance = this.currentWave <= 3 ? 
                    Utils.scaleValue(250, scaleRatio) : 
                    Utils.scaleValue(200, scaleRatio);
                
                if (distance > minDistance) {
                    tooClose = false;
                }
            }
            
            // Créer et ajouter l'ennemi
            this.game.enemies.push(this.createEnemy(x, y, type, scaleRatio));
        }
    }
    
    // Obtenir la distribution des types d'ennemis en fonction de la vague
    getEnemyTypeDistribution() {
        // Distribution en fonction de la vague
        if (this.currentWave === 1) {
            // Vague 1: Uniquement des wanderers (plus faciles à éviter)
            return {
                chaser: 0,
                shooter: 0,
                wanderer: 1.0
            };
        } else if (this.currentWave === 2) {
            // Vague 2: Principalement des wanderers, quelques chasers
            return {
                chaser: 0.2,
                shooter: 0,
                wanderer: 0.8
            };
        } else if (this.currentWave === 3) {
            // Vague 3: Introduction des shooters en petit nombre
            return {
                chaser: 0.3,
                shooter: 0.1,
                wanderer: 0.6
            };
        } else if (this.currentWave <= 5) {
            // Vagues 4-5: Distribution équilibrée
            return {
                chaser: 0.3,
                shooter: 0.3,
                wanderer: 0.4
            };
        } else {
            // Vagues 6+: Plus difficile avec plus de shooters
            return {
                chaser: 0.3,
                shooter: 0.5,
                wanderer: 0.2
            };
        }
    }
    
    // Choisir un type d'ennemi en fonction de la distribution
    chooseEnemyType(distribution) {
        const rand = Math.random();
        let cumulativeProbability = 0;
        
        for (const type in distribution) {
            cumulativeProbability += distribution[type];
            if (rand < cumulativeProbability) {
                return type;
            }
        }
        
        // Par défaut, retourner wanderer
        return 'wanderer';
    }
    
    // Dessiner les informations de vague
    draw(ctx) {
        const scaleRatio = Utils.getScaleRatio(ctx.canvas.width, ctx.canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = `${Math.floor(Utils.scaleValue(20, scaleRatio))}px Arial`;
        ctx.textAlign = 'right';
        
        // Afficher le numéro de vague
        ctx.fillText(`Vague: ${this.currentWave}`, ctx.canvas.width - 20, 30);
        
        // Afficher les ennemis restants
        ctx.fillText(`Ennemis: ${this.game.enemies.length}`, ctx.canvas.width - 20, 60);
        
        // Afficher le score
        if (this.game.stateManager) {
            ctx.fillText(`Score: ${this.game.stateManager.stats.score}`, ctx.canvas.width - 20, 90);
        }
        
        // Si nous sommes entre deux vagues, afficher le compte à rebours
        if (this.betweenWaves) {
            ctx.textAlign = 'center';
            ctx.font = `${Math.floor(Utils.scaleValue(40, scaleRatio))}px Arial`;
            ctx.fillText(
                `Prochaine vague dans ${Math.ceil(this.waveTimer)}`, 
                ctx.canvas.width / 2, 
                ctx.canvas.height / 4
            );
        }
    }
    
    // Réinitialiser le gestionnaire de vagues
    reset() {
        this.currentWave = 1;
        this.enemiesRemaining = 0;
        this.waveTimer = 0;
        this.waveInProgress = false;
        this.betweenWaves = true;
        this.waveTimer = 3; // Délai court avant la première vague
    }
    
    createEnemy(x, y, type, scaleRatio) {
        switch(type) {
            case 'chaser':
                return new ChaserEnemy(x, y, scaleRatio);
            case 'shooter':
                return new ShooterEnemy(x, y, scaleRatio);
            case 'wanderer':
                return new WandererEnemy(x, y, scaleRatio);
            default:
                throw new Error(`Type d'ennemi inconnu: ${type}`);
        }
    }
}