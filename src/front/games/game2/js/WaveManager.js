// Classe pour gérer les vagues d'ennemis
class WaveManager {
    constructor(game) {
        this.game = game;
        this.currentWave = 1;
        this.enemiesRemaining = 0;
        this.waveTimer = 0;
        this.waveDelay = 5; // Délai entre les vagues en secondes
        this.waveInProgress = false;
        this.betweenWaves = true;
        this.baseEnemyCount = 5; // Nombre de base d'ennemis pour la vague 1
    }
    
    // Mise à jour du gestionnaire de vague
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
        // Formule: baseEnemyCount + (currentWave - 1) * 2
        // Vague 1: 5 ennemis
        // Vague 2: 7 ennemis
        // Vague 3: 9 ennemis, etc.
        return this.baseEnemyCount + (this.currentWave - 1) * 2;
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
                
                if (distance > Utils.scaleValue(200, scaleRatio)) {
                    tooClose = false;
                }
            }
            
            // Créer et ajouter l'ennemi
            this.game.enemies.push(Enemy.createEnemy(x, y, type, scaleRatio));
        }
    }
    
    // Obtenir la distribution des types d'ennemis en fonction de la vague
    getEnemyTypeDistribution() {
        // Distribution de base
        let distribution = {
            chaser: 0.4,
            shooter: 0.3,
            wanderer: 0.3
        };
        
        // Ajuster en fonction de la vague
        if (this.currentWave >= 3) {
            // Plus de shooters dans les vagues supérieures
            distribution.chaser = 0.3;
            distribution.shooter = 0.4;
            distribution.wanderer = 0.3;
        }
        
        if (this.currentWave >= 5) {
            // Encore plus de shooters dans les vagues très avancées
            distribution.chaser = 0.25;
            distribution.shooter = 0.5;
            distribution.wanderer = 0.25;
        }
        
        return distribution;
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
        
        // Par défaut, retourner chaser
        return 'chaser';
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
}