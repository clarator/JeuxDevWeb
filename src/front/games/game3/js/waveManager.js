// Gestionnaire des vagues d'ennemis
export class WaveManager {
    constructor(game) {
        this.game = game;
        this.currentWave = 0;
        this.waveInProgress = false;
        this.enemiesLeftToSpawn = 0;
        this.waveCompleted = false;
        
        // Timer pour l'apparition des ennemis
        this.spawnTimer = 0;
        this.spawnDelay = 1; // 1 seconde entre chaque ennemi
        
        // Timer pour les pauses entre les vagues
        this.waveDelayTimer = 0;
        this.wavePauseDelay = 5; // 5 secondes entre chaque vague
    }
    
    update(deltaTime) {
        // Si une vague est en cours
        if (this.waveInProgress) {
            // Mettre à jour le timer d'apparition
            if (this.enemiesLeftToSpawn > 0) {
                this.spawnTimer += deltaTime;
                
                // Faire apparaître un ennemi
                if (this.spawnTimer >= this.spawnDelay) {
                    this.spawnEnemy();
                    this.spawnTimer = 0;
                }
            }
            
            // Vérifier si la vague est terminée
            if (this.enemiesLeftToSpawn === 0 && this.game.enemyManager.getEnemyCount() === 0) {
                this.waveCompleted = true;
                this.waveInProgress = false;
                this.waveDelayTimer = 0;
                
                // Bonus d'or à la fin de la vague
                const waveBonus = 25 + this.currentWave * 5;
                this.game.player.addGold(waveBonus);
                
                // Afficher un message de fin de vague
                this.game.ui.showMessage(`Vague ${this.currentWave} terminée! +${waveBonus} or`, 2000);
            }
        } 
        // Pause entre les vagues
        else if (this.waveCompleted) {
            this.waveDelayTimer += deltaTime;
            
            // Lancer la prochaine vague après la pause
            if (this.waveDelayTimer >= this.wavePauseDelay) {
                this.startNextWave();
            }
        }
    }
    
    startWave() {
        this.currentWave = 1;
        this.setupWave();
    }
    
    startNextWave() {
        this.currentWave++;
        this.setupWave();
    }
    
    setupWave() {
        // Calculer les paramètres de la vague en fonction du numéro
        const enemyCount = 5 + this.currentWave * 2;
        const enemyHealth = 30 + this.currentWave * 5;
        const enemySpeed = 50 + this.currentWave * 2;
        const enemyReward = 10 + Math.floor(this.currentWave / 2);
        
        // Configurer la vague
        this.enemiesLeftToSpawn = enemyCount;
        this.waveInProgress = true;
        this.waveCompleted = false;
        this.spawnTimer = 0;
        
        // Ajuster le délai d'apparition en fonction de la vague
        this.spawnDelay = Math.max(0.5, 1.5 - this.currentWave * 0.05);
        
        // Stocker les informations sur les ennemis de cette vague
        this.waveEnemies = {
            type: this.getEnemyTypeForWave(),
            health: enemyHealth,
            speed: enemySpeed,
            reward: enemyReward
        };
        
        // Afficher les informations sur la vague
        this.game.ui.showWaveInfo(this.currentWave, enemyCount);
    }
    
    spawnEnemy() {
        if (this.enemiesLeftToSpawn <= 0) return;
        
        // Faire apparaître un ennemi avec les caractéristiques de la vague
        this.game.enemyManager.spawnEnemy(
            this.waveEnemies.type,
            this.waveEnemies.health,
            this.waveEnemies.speed,
            this.waveEnemies.reward
        );
        
        this.enemiesLeftToSpawn--;
    }
    
    // Déterminer le type d'ennemi en fonction de la vague
    getEnemyTypeForWave() {
        // Pour l'instant, on n'a qu'un seul type d'ennemi
        return 'basic';
        
        // Pour les versions futures, on pourra ajouter différents types d'ennemis
        // en fonction du numéro de vague
        /*
        if (this.currentWave < 3) {
            return 'basic';
        } else if (this.currentWave < 6) {
            return Math.random() < 0.7 ? 'basic' : 'fast';
        } else {
            const rand = Math.random();
            if (rand < 0.5) {
                return 'basic';
            } else if (rand < 0.8) {
                return 'fast';
            } else {
                return 'tank';
            }
        }
        */
    }
    
    reset() {
        this.currentWave = 0;
        this.waveInProgress = false;
        this.enemiesLeftToSpawn = 0;
        this.waveCompleted = false;
        this.spawnTimer = 0;
        this.waveDelayTimer = 0;
    }
    
    // Méthode pour forcer le début de la prochaine vague
    skipToNextWave() {
        if (this.waveInProgress) {
            // Supprimer tous les ennemis restants
            this.game.enemyManager.reset();
            this.enemiesLeftToSpawn = 0;
            
            // Marquer la vague comme terminée
            this.waveCompleted = true;
            this.waveInProgress = false;
            
            // Réinitialiser les timers
            this.waveDelayTimer = this.wavePauseDelay; // Lancer la prochaine vague immédiatement
        } else if (this.waveCompleted) {
            // Forcer le démarrage de la prochaine vague
            this.waveDelayTimer = this.wavePauseDelay;
        }
    }
}