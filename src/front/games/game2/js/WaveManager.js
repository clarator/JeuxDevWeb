import ChaserEnemy from './ChaserEnemy.js';
import ShooterEnemy from './shooterEnemy.js';
import WandererEnemy from './WandererEnemy.js';

export default class WaveManager {
    constructor(game, pseudo) {
        this.game = game;
        this.currentWave = 1;
        this.enemiesRemaining = 0;
        this.waveTimer = 0;
        this.waveDelay = 3; // Délai entre les vagues en secondes
        this.waveInProgress = false;
        this.betweenWaves = true;
        this.baseEnemyCount = 3; // Nombre initial d'ennemis
    }
    
    // Réinitialise le gestionnaire de vagues
    reset() {
        this.currentWave = 1;
        this.enemiesRemaining = 0;
        this.waveTimer = 2; // Court délai avant la première vague
        this.waveInProgress = false;
        this.betweenWaves = true;
    }
    
    // Mise à jour du gestionnaire à chaque frame
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
    
    // Démarre une nouvelle vague d'ennemis
    startWave() {
        this.waveInProgress = true;
        this.betweenWaves = false;
        
        // Calcul du nombre d'ennemis pour cette vague
        const enemyCount = this.calculateEnemyCount();
        
        // Faire apparaître les ennemis
        this.spawnEnemies(enemyCount);
        
        this.enemiesRemaining = enemyCount;
    }
    
    // Termine la vague actuelle et prépare la suivante
    endWave() {
        /* Fonctionnalité de sauvegarde de score désactivée
        console.log("Pseudo récupéré :", this.pseudo);
        console.log("Vague actuelle :", wave);
        console.log(this.pseudo, wave);
        saveWaveGame2(this.pseudo, wave); */

        this.waveInProgress = false;
        this.betweenWaves = true;
        this.currentWave++;
        this.waveTimer = this.waveDelay;
    }
    
    // Calcule le nombre d'ennemis en fonction de la vague
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
    
    // Fait apparaître les ennemis pour la vague actuelle
    spawnEnemies(count) {
        const scaleRatio = this.game.getScaleRatio();
        
        for (let i = 0; i < count; i++) {
            const type = this.getEnemyType();
            
            // Position aléatoire suffisamment loin du joueur
            let x, y;
            let tooClose = true;
            
            while (tooClose) {
                x = Math.random() * (this.game.canvas.width - 40 * scaleRatio);
                y = Math.random() * (this.game.canvas.height - 40 * scaleRatio);
                
                // Calcul de la distance par rapport au joueur
                const distX = x - this.game.player.canvasX;
                const distY = y - this.game.player.canvasY;
                const distance = Math.sqrt(distX * distX + distY * distY);
                
                if (distance > 200 * scaleRatio) { // Distance minimale de sécurité
                    tooClose = false;
                }
            }
            
            // Créer et ajouter l'ennemi au jeu
            this.game.enemies.push(this.createEnemy(x, y, type, scaleRatio));
        }
    }
    
    // Détermine le type d'ennemi en fonction de la vague
    getEnemyType() {
        if (this.currentWave === 1) {
            // Vague 1: Uniquement des wanderers (errants)
            return 'wanderer';
        } else if (this.currentWave <= 3) {
            // Vagues 2-3: Wanderers et chasers (chasseurs)
            return Math.random() < 0.5 ? 'wanderer' : 'chaser';
        } else if (this.currentWave <= 5) {
            // Vagues 4-5: Tous les types
            const rand = Math.random();
            if (rand < 0.4) return 'wanderer';
            if (rand < 0.7) return 'chaser';
            return 'shooter';
        } else {
            // Vague 6+: Plus de shooters (tireurs)
            const rand = Math.random();
            if (rand < 0.2) return 'wanderer';
            if (rand < 0.4) return 'chaser';
            return 'shooter';
        }
    }
    
    // Appelé quand un ennemi est tué
    onEnemyKilled() {
        this.enemiesRemaining--;
    }
    
    // Crée un ennemi du type spécifié
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
    
    // Affiche les informations sur la vague actuelle
    render(ctx) {
        ctx.save();
        const scaleRatio = this.game.getScaleRatio();
        
        ctx.fillStyle = 'white';
        ctx.font = `${Math.floor(20 * scaleRatio)}px Arial`;
        ctx.textAlign = 'right';
        
        // Affichage du numéro de vague
        ctx.fillText(`Vague: ${this.currentWave}`, ctx.canvas.width - 20 * scaleRatio, 30 * scaleRatio);
        
        // Affichage du nombre d'ennemis restants
        ctx.fillText(`Ennemis: ${this.game.enemies.length}`, ctx.canvas.width - 20 * scaleRatio, 60 * scaleRatio);
        
        // Si entre deux vagues, affichage du compte à rebours
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