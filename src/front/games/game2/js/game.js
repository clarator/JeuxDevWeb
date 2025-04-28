// Classe principale du jeu
class Game {
    constructor(canvasId) {
        // Configurer le canvas
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Gestionnaire d'entrées (passer le canvas pour les événements de souris)
        this.inputHandler = new InputHandler(this.canvas);
        
        // Gestionnaire d'états du jeu
        this.stateManager = new GameStateManager(this);
        
        // Gestionnaire de vagues
        this.waveManager = new WaveManager(this);
        
        // Initialiser les objets du jeu
        this.init();
        
        // Configurer le redimensionnement
        window.addEventListener('resize', () => this.resize());
        this.resize();
        
        // Variables pour la boucle de jeu
        this.lastTime = 0;
        this.projectiles = [];
        this.enemies = [];
        this.gameOver = false;
    }
    
    // Initialisation des objets du jeu
    init() {
        // D'abord, redimensionner le canvas pour établir la bonne taille
        this.resize();
        
        // Calculer le ratio d'échelle initial
        const scaleRatio = Utils.getScaleRatio(this.canvas.width, this.canvas.height);
        
        // Créer le joueur au centre de l'écran
        this.player = new Player(
            this.canvas.width / 2 - Utils.scaleValue(25, scaleRatio),
            this.canvas.height / 2 - Utils.scaleValue(25, scaleRatio),
            scaleRatio
        );
        
        // Initialiser les tableaux
        this.projectiles = [];
        this.enemies = [];
        
        // Initialiser le gestionnaire de vagues
        this.waveManager.reset();
    }
    
    // Gérer le redimensionnement
    resize() {
        // Sauvegarder la position relative du joueur (en pourcentage) avant le redimensionnement
        let playerRelativeX = 0;
        let playerRelativeY = 0;
        
        if (this.player) {
            playerRelativeX = (this.player.x + this.player.width / 2) / this.canvas.width;
            playerRelativeY = (this.player.y + this.player.height / 2) / this.canvas.height;
        }
        
        // Ratio 16:9
        const targetRatio = 16 / 9;
        
        // Calculer la taille maximale possible pour le canvas tout en maintenant le ratio 16:9
        let canvasWidth = window.innerWidth;
        let canvasHeight = canvasWidth / targetRatio;
        
        // Si la hauteur calculée est trop grande, on recalcule à partir de la hauteur
        if (canvasHeight > window.innerHeight) {
            canvasHeight = window.innerHeight;
            canvasWidth = canvasHeight * targetRatio;
        }
        
        // Définir la taille du canvas
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        
        // Calculer le nouveau ratio d'échelle par rapport à la référence 1920x1080
        const scaleRatio = Utils.getScaleRatio(canvasWidth, canvasHeight);
        
        // Redimensionner le joueur et le repositionner à sa position relative
        if (this.player) {
            this.player.resize(scaleRatio);
            
            // Repositionner le joueur en fonction de sa position relative précédente
            const newPlayerWidth = Utils.scaleValue(50, scaleRatio);
            const newPlayerHeight = Utils.scaleValue(50, scaleRatio);
            
            this.player.x = (playerRelativeX * canvasWidth) - (newPlayerWidth / 2);
            this.player.y = (playerRelativeY * canvasHeight) - (newPlayerHeight / 2);
        }
        
        // Redimensionner les projectiles
        this.projectiles?.forEach(projectile => {
            projectile.resize(scaleRatio);
        });
        
        // Redimensionner les ennemis
        this.enemies?.forEach(enemy => {
            enemy.resize(scaleRatio);
        });
        
        // Recréer les murs (seulement les bords de la pièce)
        const wallThickness = Utils.scaleValue(20, scaleRatio);
        this.walls = [
            // Mur du haut
            { x: 0, y: 0, width: canvasWidth, height: wallThickness },
            // Mur de droite
            { x: canvasWidth - wallThickness, y: 0, width: wallThickness, height: canvasHeight },
            // Mur du bas
            { x: 0, y: canvasHeight - wallThickness, width: canvasWidth, height: wallThickness },
            // Mur de gauche
            { x: 0, y: 0, width: wallThickness, height: canvasHeight }
        ];
        
        // Redimensionner les éléments d'interface utilisateur
        if (this.stateManager) {
            this.stateManager.resizeUI();
        }
    }
    
    // Vérifier les collisions entre projectiles et entités
    checkProjectileCollisions() {
        // Vérifier les collisions entre les projectiles du joueur et les ennemis
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            
            if (projectile.source === 'player') {
                for (let j = this.enemies.length - 1; j >= 0; j--) {
                    const enemy = this.enemies[j];
                    
                    // Vérifier la collision
                    if (Collision.checkRectCollision(projectile, enemy)) {
                        // Désactiver le projectile
                        projectile.active = false;
                        
                        // Infliger des dégâts à l'ennemi
                        const isDead = enemy.takeDamage(1);
                        
                        // Si l'ennemi n'a plus de vie, le supprimer et ajouter des points
                        if (isDead) {
                            this.enemies.splice(j, 1);
                            
                            // Ajouter des points au score (10 points par ennemi)
                            if (this.stateManager) {
                                this.stateManager.addScore(10);
                            }
                        }
                        
                        // Passer au projectile suivant
                        break;
                    }
                }
            }
            // Vérifier les collisions entre les projectiles ennemis et le joueur
            else if (projectile.source === 'enemy' && !this.player.invulnerable) {
                if (Collision.checkRectCollision(projectile, this.player)) {
                    // Désactiver le projectile
                    projectile.active = false;
                    
                    // Infliger des dégâts au joueur
                    const isDead = this.player.takeDamage();
                    if (isDead) {
                        this.gameOver = true;
                        
                        // Mettre à jour l'état du jeu
                        if (this.stateManager) {
                            this.stateManager.endGame();
                        }
                    }
                }
            }
        }
        
        // Vérifier les collisions entre le joueur et les ennemis
        if (!this.player.invulnerable) {
            for (const enemy of this.enemies) {
                if (Collision.checkRectCollision(this.player, enemy)) {
                    // Infliger des dégâts au joueur
                    const isDead = this.player.takeDamage();
                    if (isDead) {
                        this.gameOver = true;
                        
                        // Mettre à jour l'état du jeu
                        if (this.stateManager) {
                            this.stateManager.endGame();
                        }
                    }
                    break;
                }
            }
        }
    }
    
    // Réinitialiser le jeu
    reset() {
        this.projectiles = [];
        this.enemies = [];
        this.gameOver = false;
        
        const scaleRatio = Utils.getScaleRatio(this.canvas.width, this.canvas.height);
        this.player = new Player(
            this.canvas.width / 2 - Utils.scaleValue(25, scaleRatio),
            this.canvas.height / 2 - Utils.scaleValue(25, scaleRatio),
            scaleRatio
        );
        
        // Réinitialiser le gestionnaire de vagues
        this.waveManager.reset();
    }
    
    // Boucle principale du jeu
    gameLoop(timestamp) {
        // Calculer le temps écoulé depuis la dernière frame
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        
        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dessiner l'arrière-plan
        this.ctx.fillStyle = '#222';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Mettre à jour et dessiner en fonction de l'état du jeu
        this.stateManager.update(deltaTime);
        
        // Si nous sommes dans l'état de jeu
        if (this.stateManager.isPlaying()) {
            // Calculer le ratio d'échelle actuel
            const scaleRatio = Utils.getScaleRatio(this.canvas.width, this.canvas.height);
            
            // Mettre à jour le gestionnaire de vagues
            this.waveManager.update(deltaTime);
            
            // Mettre à jour le joueur
            this.player.update(deltaTime, this.inputHandler, this.walls, scaleRatio);
            
            // Vérifier si le joueur tire avec la souris
            if (this.inputHandler.isFiring() && this.player.shootCooldown <= 0) {
                const projectile = this.player.shoot(scaleRatio);
                if (projectile) {
                    this.projectiles.push(projectile);
                }
            }
            
            // Mettre à jour les ennemis et leurs tirs
            for (const enemy of this.enemies) {
                enemy.update(deltaTime, this.player, this.walls, scaleRatio);
                
                // Vérifier si l'ennemi tire
                const projectile = enemy.shoot(this.player, scaleRatio);
                if (projectile) {
                    this.projectiles.push(projectile);
                }
            }
            
            // Mettre à jour et filtrer les projectiles
            this.projectiles = this.projectiles.filter(projectile => {
                projectile.update(deltaTime, this.walls, scaleRatio);
                return projectile.active;
            });
            
            // Vérifier les collisions
            this.checkProjectileCollisions();
            
            // Dessiner les murs
            this.ctx.fillStyle = 'gray';
            this.walls.forEach(wall => {
                this.ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
            });
            
            // Dessiner les projectiles
            this.projectiles.forEach(projectile => {
                projectile.draw(this.ctx);
            });
            
            // Dessiner les ennemis
            this.enemies.forEach(enemy => {
                enemy.draw(this.ctx);
            });
            
            // Dessiner le joueur
            this.player.draw(this.ctx);
            
            // Dessiner les informations de vague
            this.waveManager.draw(this.ctx);
            
            // Dessiner une bordure pour montrer clairement les limites du canvas
            this.ctx.strokeStyle = '#444';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Dessiner l'interface utilisateur (menu, game over, etc.)
        this.stateManager.draw(this.ctx);
        
        // Continuer la boucle
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
    
    // Démarrer le jeu
    start() {
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }
}