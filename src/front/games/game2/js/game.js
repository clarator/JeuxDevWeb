import GameStateManager from './GameStateManager.js';
import InputManager from '../../common/inputManager.js';
import Player from './Player.js';
import WaveManager from './WaveManager.js';
import ExperienceManager from './ExperienceManager.js';
import Projectile from './Projectile.js';
import { getCookie } from '../../common/cookie.js';
import { saveWaveGame2 } from './score.js'; 

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Résolution de référence pour le dimensionnement
        this.REFERENCE_WIDTH = 1920;
        this.REFERENCE_HEIGHT = 1080;
        
        // Initialisation des composants du jeu
        this.gameStateManager = new GameStateManager(this);
        this.inputManager = new InputManager();
        this.player = new Player(this.getScaleRatio());
        this.waveManager = new WaveManager(this);
        this.experienceManager = new ExperienceManager(this);
        
        // Collections d'objets de jeu
        this.projectiles = [];
        this.enemies = [];
        this.walls = [];
        
        // Variables de timing et d'état
        this.lastTime = 0;
        this.deltaTime = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mousePressed = false;
        this.isPaused = false;
        
        // Écouteurs d'événements souris
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('click', (e) => this.handleMouseClick(e));
        
        // Configuration initiale
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.loopStarted = false;
    }
    
    // Calcul du ratio d'échelle pour adapter à toutes les résolutions
    getScaleRatio() {
        const widthRatio = this.canvas.width / this.REFERENCE_WIDTH;
        const heightRatio = this.canvas.height / this.REFERENCE_HEIGHT;
        return Math.min(widthRatio, heightRatio);
    }
    
    // Mise à l'échelle d'une valeur selon le ratio d'échelle
    scaleValue(value) {
        return value * this.getScaleRatio();
    }
    
    // Gère le mouvement de la souris
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }
    
    // Gère l'appui du bouton de souris
    handleMouseDown(e) {
        if (e.button === 0) { // Clic gauche
            this.mousePressed = true;
        }
    }
    
    // Gère le relâchement du bouton de souris
    handleMouseUp(e) {
        if (e.button === 0) { // Clic gauche
            this.mousePressed = false;
        }
    }
    
    // Redimensionne le canvas en conservant le ratio 16:9
    resizeCanvas() {
        // Maintien du ratio 16:9
        const targetRatio = 16 / 9;
        let canvasWidth = window.innerWidth;
        let canvasHeight = canvasWidth / targetRatio;
        
        if (canvasHeight > window.innerHeight) {
            canvasHeight = window.innerHeight;
            canvasWidth = canvasHeight * targetRatio;
        }
        
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        
        // Redimensionnement de tous les éléments du jeu
        const scaleRatio = this.getScaleRatio();
        
        this.player.resize(scaleRatio);
        this.enemies.forEach(enemy => enemy.resize(scaleRatio));
        this.projectiles.forEach(projectile => projectile.resize(scaleRatio));
        this.experienceManager.resize(scaleRatio);
        
        // Recréation des murs après redimensionnement
        this.createWalls();
    }
    
    // Crée les murs autour de l'aire de jeu
    createWalls() {
        const scaleRatio = this.getScaleRatio();
        const wallThickness = this.scaleValue(20);
        
        this.walls = [
            // Seulement les murs extérieurs
            { canvasX: 0, canvasY: 0, width: this.canvas.width, height: wallThickness }, // Haut
            { canvasX: this.canvas.width - wallThickness, canvasY: 0, width: wallThickness, height: this.canvas.height }, // Droite
            { canvasX: 0, canvasY: this.canvas.height - wallThickness, width: this.canvas.width, height: wallThickness }, // Bas
            { canvasX: 0, canvasY: 0, width: wallThickness, height: this.canvas.height }, // Gauche
        ];
    }    

    // Charge le niveau et réinitialise les éléments du jeu
    loadLevel() {
        const scaleRatio = this.getScaleRatio();
        
        // Position initiale du joueur au centre
        this.player.canvasX = this.canvas.width / 2 - this.scaleValue(25);
        this.player.canvasY = this.canvas.height / 2 - this.scaleValue(25);
        this.player.reset(); // Réinitialisation des améliorations
        
        // Vidage des collections d'objets
        this.projectiles = [];
        this.enemies = [];
        
        // Réinitialisation des gestionnaires
        this.waveManager.reset();
        this.experienceManager.reset();
        
        // Création des murs
        this.createWalls();
    }
    
    // Met le jeu en pause pour permettre la sélection d'une amélioration
    pauseForLevelUp() {
        this.isPaused = true;
    }
    
    // Reprend le jeu après une pause
    resumeGame() {
        this.isPaused = false;
    }
    
    // Démarre le jeu et la boucle principale
    start() {
        this.gameStateManager.switchToMenu();
        this.lastTime = performance.now();
        this.loopStarted = true;
        this.gameLoop();
    }
    
    // Boucle principale du jeu
    gameLoop(timestamp) {
        const now = timestamp || performance.now();
        this.deltaTime = (now - this.lastTime) / 1000; // Conversion en secondes
        this.lastTime = now;
        
        if (this.gameStateManager.currentState === 'game') {
            // Vérification de la touche Échap pour la pause
            if (this.inputManager.isKeyPressed('Escape')) {
                this.gameStateManager.switchToPause();
            }
            this.update();
            this.render();
        } else if (this.gameStateManager.currentState === 'pause') {
            // En pause, on continue à rendre le jeu pour montrer le menu de pause
            this.render();
        }
        
        // Demande la prochaine frame d'animation
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
    
    // Mise à jour de l'état du jeu à chaque frame
    update() {
        // Si en pause pour le niveau supérieur, on gère uniquement les entrées
        if (this.isPaused) {
            this.handleInput(); // Pour permettre la sélection d'amélioration
            return;
        }

        // Gestion des entrées joueur (clavier, souris)
        this.handleInput();

        // Mise à jour du joueur
        this.player.update(this.deltaTime, this.mouseX, this.mouseY);
        
        // Mise à jour des ennemis
        for (const enemy of this.enemies) {
            enemy.update(this.deltaTime, this.player);
            
            // Collision des ennemis avec les murs
            this.checkWallCollision(enemy);
            
            // Collision entre ennemis
            this.checkEnemyCollisionsWithOthers(enemy);
            
            // Gestion des tirs ennemis
            if (enemy.canShoot() && Math.random() < enemy.shootChance) {
                const enemyCenter = enemy.getCenter();
                const playerCenter = this.player.getCenter();
                const dirX = playerCenter.x - enemyCenter.x;
                const dirY = playerCenter.y - enemyCenter.y;
                
                const length = Math.sqrt(dirX * dirX + dirY * dirY);
                if (length > 0) {
                    const direction = { x: dirX / length, y: dirY / length };
                    this.projectiles.push(new Projectile(enemyCenter.x, enemyCenter.y, direction, 'enemy', this.getScaleRatio()));
                    enemy.triggerShootCooldown();
                }
            }
        }
        
        // Mise à jour des projectiles et vérification des limites
        this.projectiles = this.projectiles.filter(projectile => {
            projectile.update(this.deltaTime);
            
            // Vérification des collisions avec les murs
            const collision = this.checkWallCollision(projectile);
            if (collision) return false;
            
            // Vérification des limites du canvas
            return projectile.isInBounds(this.canvas.width, this.canvas.height);
        });
        
        // Vérification de toutes les collisions
        this.checkCollisions();
        
        // Collision du joueur avec les murs
        this.checkWallCollision(this.player);
        
        // Mise à jour du gestionnaire de vagues
        this.waveManager.update(this.deltaTime);
    }
    
    // Gère les clics de souris (notamment pour le menu d'amélioration)
    handleMouseClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Si en pause pour niveau supérieur, traite le clic
        if (this.isPaused && this.experienceManager.levelUpPending) {
            this.experienceManager.handleClick(mouseX, mouseY);
        }
    }    

    // Gère les entrées clavier et souris
    handleInput() {
        // Gestion du déplacement avec WASD/ZQSD
        let moveX = 0;
        let moveY = 0;
        
        if (this.inputManager.isKeyPressed('KeyW')) moveY = -1;
        if (this.inputManager.isKeyPressed('KeyS')) moveY = 1;
        if (this.inputManager.isKeyPressed('KeyA')) moveX = -1;
        if (this.inputManager.isKeyPressed('KeyD')) moveX = 1;
        
        // Application de la vitesse au joueur
        this.player.speedX = moveX * this.player.speedValue;
        this.player.speedY = moveY * this.player.speedValue;
        
        // Gestion du tir avec amélioration multi-tir
        if (this.mousePressed && this.player.shootCooldown <= 0) {
            const direction = this.getShootDirection();
            if (direction.x !== 0 || direction.y !== 0) {
                const center = this.player.getCenter();
                const multiShot = this.player.multiShot || 1;
                
                const baseAngle = Math.atan2(direction.y, direction.x);
                
                if (multiShot === 1) {
                    // Un seul projectile standard
                    this.projectiles.push(new Projectile(center.x, center.y, direction, 'player', this.getScaleRatio()));
                } else if (multiShot === 2) {
                    // Deux projectiles côte à côte
                    const offset = 5 * this.getScaleRatio();
                    
                    // Projectile gauche
                    const leftX = center.x + Math.cos(baseAngle - Math.PI/2) * offset;
                    const leftY = center.y + Math.sin(baseAngle - Math.PI/2) * offset;
                    this.projectiles.push(new Projectile(leftX, leftY, direction, 'player', this.getScaleRatio()));
                    
                    // Projectile droite
                    const rightX = center.x + Math.cos(baseAngle + Math.PI/2) * offset;
                    const rightY = center.y + Math.sin(baseAngle + Math.PI/2) * offset;
                    this.projectiles.push(new Projectile(rightX, rightY, direction, 'player', this.getScaleRatio()));
                } else {
                    // 3+ projectiles en éventail
                    const angleSpread = Math.PI / 8; // Angle total de l'éventail
                    const angleStep = angleSpread / (multiShot - 1);
                    const startAngle = -angleSpread / 2;
                    
                    for (let i = 0; i < multiShot; i++) {
                        const angle = baseAngle + startAngle + angleStep * i;
                        const spreadDirection = {
                            x: Math.cos(angle),
                            y: Math.sin(angle)
                        };
                        this.projectiles.push(new Projectile(center.x, center.y, spreadDirection, 'player', this.getScaleRatio()));
                    }
                }
                
                // Activation du cooldown de tir
                this.player.shootCooldown = this.player.shootCooldownTime;
            }
        }
    }

    // Calcule la direction de tir basée sur la position de la souris
    getShootDirection() {
        const center = this.player.getCenter();
        const dirX = this.mouseX - center.x;
        const dirY = this.mouseY - center.y;
        
        // Normalisation du vecteur (longueur = 1)
        const length = Math.sqrt(dirX * dirX + dirY * dirY);
        if (length === 0) return { x: 0, y: 0 };
        
        return {
            x: dirX / length,
            y: dirY / length
        };
    }
    
    // Vérifie toutes les collisions entre les objets du jeu
    checkCollisions() {
        // Collision projectile-ennemi
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            
            if (projectile.source === 'player') {
                for (let j = this.enemies.length - 1; j >= 0; j--) {
                    const enemy = this.enemies[j];
                    
                    if (this.checkRectCollision(projectile, enemy)) {
                        // Vérification si l'ennemi a déjà été touché par ce projectile
                        if (projectile.touchedEnemies.includes(enemy)) {
                            continue; // Passer au prochain ennemi
                        }
                        
                        // Calcul des dégâts avec pénétration
                        const damage = this.player.projectileDamage || 1;
                        
                        // Détermine si c'est le dernier ennemi qui peut être touché
                        const isFinalTarget = projectile.touchedEnemies.length >= this.player.piercingLevel;
                        const finalDamage = isFinalTarget ? damage * 0.5 : damage;
                        
                        const isDead = enemy.takeDamage(finalDamage);
                        
                        // Mémorisation de l'ennemi touché
                        projectile.touchedEnemies.push(enemy);
                        
                        // Destruction du projectile dans certains cas
                        const shouldDestroy = this.player.piercingLevel === 0 || isFinalTarget;
                        
                        if (shouldDestroy) {
                            this.projectiles.splice(i, 1);
                        }
                        
                        if (isDead) {
                            this.enemies.splice(j, 1);
                            this.waveManager.onEnemyKilled();
                        
                            this.pseudo = getCookie("user");
                            console.log("Pseudo:", this.pseudo);
                            this.wave = this.waveManager.currentWave;
                            console.log("Vague actuelle:", this.wave);
                            
                            saveWaveGame2(this.pseudo,  this.wave); 
                                
                        }
                        
                        if (shouldDestroy) {
                            break;
                        }
                    }
                }
            }
            // Collision projectile ennemi - joueur
            else if (projectile.source === 'enemy') {
                if (this.checkRectCollision(projectile, this.player)) {
                    // Destruction du projectile dans tous les cas
                    this.projectiles.splice(i, 1);
                    
                    // Dégâts seulement si joueur non invulnérable
                    if (!this.player.invulnerable) {
                        const isDead = this.player.takeDamage();
                        if (isDead) {
                            this.gameStateManager.endGame();
                        }
                    }
                }
            }
        }
        
        // Collision ennemi-joueur (contact direct)
        if (!this.player.invulnerable) {
            for (const enemy of this.enemies) {
                if (this.checkRectCollision(this.player, enemy)) {
                    const isDead = this.player.takeDamage();
                    if (isDead) {
                        this.gameStateManager.endGame();
                        //mettre ici recup score
                    }
                    break;
                }
            }
        }
    }
    
    // Vérifie la collision entre deux rectangles
    checkRectCollision(rect1, rect2) {
        return (
            rect1.canvasX < rect2.canvasX + rect2.width &&
            rect1.canvasX + rect1.width > rect2.canvasX &&
            rect1.canvasY < rect2.canvasY + rect2.height &&
            rect1.canvasY + rect1.height > rect2.canvasY
        );
    }
    
    // Gère la collision avec les murs et corrige la position
    checkWallCollision(object) {
        let hasCollision = false;
        
        // Vérification avec tous les murs
        for (const wall of this.walls) {
            if (this.checkRectCollision(object, wall)) {
                // Détermination du côté de collision avec le moins de pénétration
                const overlapLeft = object.canvasX + object.width - wall.canvasX;
                const overlapRight = wall.canvasX + wall.width - object.canvasX;
                const overlapTop = object.canvasY + object.height - wall.canvasY;
                const overlapBottom = wall.canvasY + wall.height - object.canvasY;
                
                // Correction de la position selon le côté avec le moins de pénétration
                const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
                
                if (minOverlap === overlapLeft) {
                    object.canvasX = wall.canvasX - object.width;
                } else if (minOverlap === overlapRight) {
                    object.canvasX = wall.canvasX + wall.width;
                } else if (minOverlap === overlapTop) {
                    object.canvasY = wall.canvasY - object.height;
                } else if (minOverlap === overlapBottom) {
                    object.canvasY = wall.canvasY + wall.height;
                }
                
                hasCollision = true;
            }
        }
        
        return hasCollision;
    }
    
    // Gère les collisions entre ennemis pour éviter les superpositions
    checkEnemyCollisionsWithOthers(currentEnemy) {
        for (const otherEnemy of this.enemies) {
            if (currentEnemy !== otherEnemy) {
                if (this.checkRectCollision(currentEnemy, otherEnemy)) {
                    // Calcul du vecteur de séparation
                    const dx = currentEnemy.canvasX - otherEnemy.canvasX;
                    const dy = currentEnemy.canvasY - otherEnemy.canvasY;
                    
                    const length = Math.sqrt(dx * dx + dy * dy);
                    if (length < 1) { // Évite la division par zéro
                        currentEnemy.canvasX += 0.5;
                        currentEnemy.canvasY += 0.5;
                    } else {
                        // Légère séparation dans la direction opposée
                        const pushDistance = 1;
                        currentEnemy.canvasX += (dx / length) * pushDistance;
                        currentEnemy.canvasY += (dy / length) * pushDistance;
                    }
                }
            }
        }
    }
    
    // Rendu de tous les éléments du jeu
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Fond noir
        this.ctx.save();
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        
        // Rendu des murs
        this.ctx.save();
        this.ctx.fillStyle = 'gray';
        this.walls.forEach(wall => {
            this.ctx.fillRect(wall.canvasX, wall.canvasY, wall.width, wall.height);
        });
        this.ctx.restore();
        
        // Rendu du joueur
        this.player.render(this.ctx);
        
        // Rendu des ennemis
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        
        // Rendu des projectiles
        this.projectiles.forEach(projectile => projectile.render(this.ctx));
        
        // Rendu des informations de vague
        this.waveManager.render(this.ctx);
        
        // Rendu de l'expérience et niveau
        this.experienceManager.render(this.ctx);
    }
    
    // Réinitialise le jeu pour une nouvelle partie
    reset() {
        this.loadLevel();
    }
}