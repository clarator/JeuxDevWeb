// src/front/games/game2/js/game.js
import GameStateManager from './gameStateManager.js';
import InputManager from '../../common/inputManager.js';
import Player from './player.js';
import Projectile from './projectile.js';
import ChaserEnemy from './chaserEnemy.js';
import ShooterEnemy from './shooterEnemy.js';
import WandererEnemy from './wandererEnemy.js';
import WaveManager from './WaveManager.js';
import ExperienceManager from './ExperienceManager.js';

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Résolution de référence
        this.REFERENCE_WIDTH = 1920;
        this.REFERENCE_HEIGHT = 1080;
        
        this.gameStateManager = new GameStateManager(this);
        this.inputManager = new InputManager();
        this.player = new Player(this.getScaleRatio());
        this.waveManager = new WaveManager(this);
        this.experienceManager = new ExperienceManager(this);
        this.projectiles = [];
        this.enemies = [];
        this.walls = [];
        
        this.lastTime = 0;
        this.deltaTime = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mousePressed = false;
        this.isPaused = false;
        
        // Événements souris
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('click', (e) => this.handleMouseClick(e));
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.loopStarted = false;
    }
    
    getScaleRatio() {
        const widthRatio = this.canvas.width / this.REFERENCE_WIDTH;
        const heightRatio = this.canvas.height / this.REFERENCE_HEIGHT;
        return Math.min(widthRatio, heightRatio);
    }
    
    scaleValue(value) {
        return value * this.getScaleRatio();
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }
    
    handleMouseDown(e) {
        if (e.button === 0) { // Clic gauche
            this.mousePressed = true;
        }
    }
    
    handleMouseUp(e) {
        if (e.button === 0) { // Clic gauche
            this.mousePressed = false;
        }
    }
    
    resizeCanvas() {
        // Garder le ratio 16:9
        const targetRatio = 16 / 9;
        let canvasWidth = window.innerWidth;
        let canvasHeight = canvasWidth / targetRatio;
        
        if (canvasHeight > window.innerHeight) {
            canvasHeight = window.innerHeight;
            canvasWidth = canvasHeight * targetRatio;
        }
        
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        
        // Redimensionner tous les éléments
        const scaleRatio = this.getScaleRatio();
        
        this.player.resize(scaleRatio);
        this.enemies.forEach(enemy => enemy.resize(scaleRatio));
        this.projectiles.forEach(projectile => projectile.resize(scaleRatio));
        this.experienceManager.resize(scaleRatio);
        
        // Recréer les murs
        this.createWalls();
    }
    
    createWalls() {
        const scaleRatio = this.getScaleRatio();
        const wallThickness = this.scaleValue(20);
        
        this.walls = [
            // Murs du périmètre uniquement
            { canvasX: 0, canvasY: 0, width: this.canvas.width, height: wallThickness }, // Haut
            { canvasX: this.canvas.width - wallThickness, canvasY: 0, width: wallThickness, height: this.canvas.height }, // Droite
            { canvasX: 0, canvasY: this.canvas.height - wallThickness, width: this.canvas.width, height: wallThickness }, // Bas
            { canvasX: 0, canvasY: 0, width: wallThickness, height: this.canvas.height }, // Gauche
        ];
    }    

    loadLevel() {
        const scaleRatio = this.getScaleRatio();
        
        this.player.canvasX = this.canvas.width / 2 - this.scaleValue(25);
        this.player.canvasY = this.canvas.height / 2 - this.scaleValue(25);
        this.player.reset(); // Réinitialiser toutes les améliorations
        this.projectiles = [];
        this.enemies = [];
        this.waveManager.reset();
        this.experienceManager.reset();
        this.createWalls();
    }
    
    pauseForLevelUp() {
        this.isPaused = true;
    }
    
    resumeGame() {
        this.isPaused = false;
    }
    
    start() {
        this.gameStateManager.switchToMenu();
        this.lastTime = performance.now();
        this.loopStarted = true;
        this.gameLoop();
    }
    
    gameLoop(timestamp) {
        if (this.gameStateManager.currentState === 'game') {
            const now = timestamp || performance.now();
            this.deltaTime = (now - this.lastTime) / 1000;
            this.lastTime = now;
            
            this.update();
            this.render();
        }
        
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
    
    update() {
        // Ne pas mettre à jour si le jeu est en pause pour le level up
        if (this.isPaused) {
            this.handleInput(); // Pour gérer la sélection d'amélioration
            return;
        }
        
        if (this.inputManager.isKeyPressed('Space')) {
            this.experienceManager.addExperience(200);
        }

        this.handleInput();
        
        this.player.update(this.deltaTime);
        
        // Mise à jour des ennemis
        for (const enemy of this.enemies) {
            enemy.update(this.deltaTime, this.player);
            
            // Collision ennemis avec murs
            this.checkWallCollision(enemy);
            
            // Collision entre ennemis
            this.checkEnemyCollisionsWithOthers(enemy);
            
            // Tir des ennemis
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
        
        // Mise à jour des projectiles
        this.projectiles = this.projectiles.filter(projectile => {
            projectile.update(this.deltaTime);
            
            // Collision avec les murs
            const collision = this.checkWallCollision(projectile);
            if (collision) return false;
            
            return projectile.isInBounds(this.canvas.width, this.canvas.height);
        });
        
        // Vérifier les collisions
        this.checkCollisions();
        
        // Collision joueur avec les murs
        this.checkWallCollision(this.player);
        
        // Mise à jour du gestionnaire de vagues
        this.waveManager.update(this.deltaTime);
    }
    
    handleMouseClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Si on est en pause pour level up, gérer le clic
        if (this.isPaused && this.experienceManager.levelUpPending) {
            this.experienceManager.handleClick(mouseX, mouseY);
        }
    }    

    handleInput() {
        // Gestion du déplacement du joueur avec WASD
        let moveX = 0;
        let moveY = 0;
        
        if (this.inputManager.isKeyPressed('KeyW')) moveY = -1;
        if (this.inputManager.isKeyPressed('KeyS')) moveY = 1;
        if (this.inputManager.isKeyPressed('KeyA')) moveX = -1;
        if (this.inputManager.isKeyPressed('KeyD')) moveX = 1;
        
        this.player.speedX = moveX * this.player.speedValue;
        this.player.speedY = moveY * this.player.speedValue;
        
        // Gestion du tir amélioré
        if (this.mousePressed && this.player.shootCooldown <= 0) {
            const direction = this.getShootDirection();
            if (direction.x !== 0 || direction.y !== 0) {
                const center = this.player.getCenter();
                const multiShot = this.player.multiShot || 1;
                
                const baseAngle = Math.atan2(direction.y, direction.x);
                
                if (multiShot === 1) {
                    // Un seul projectile
                    this.projectiles.push(new Projectile(center.x, center.y, direction, 'player', this.getScaleRatio()));
                } else if (multiShot === 2) {
                    // Deux projectiles côte à côte vers l'avant
                    const offset = 5 * this.getScaleRatio(); // Distance entre les projectiles
                    
                    // Projectile gauche
                    const leftX = center.x + Math.cos(baseAngle - Math.PI/2) * offset;
                    const leftY = center.y + Math.sin(baseAngle - Math.PI/2) * offset;
                    this.projectiles.push(new Projectile(leftX, leftY, direction, 'player', this.getScaleRatio()));
                    
                    // Projectile droite
                    const rightX = center.x + Math.cos(baseAngle + Math.PI/2) * offset;
                    const rightY = center.y + Math.sin(baseAngle + Math.PI/2) * offset;
                    this.projectiles.push(new Projectile(rightX, rightY, direction, 'player', this.getScaleRatio()));
                } else {
                    // Pour 3+ projectiles, un au centre et les autres autour
                    const angleSpread = Math.PI / 8; // Plus petit angle pour garder un projectile central
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
                
                this.player.shootCooldown = this.player.shootCooldownTime;
            }
        }
        
    }

    getShootDirection() {
        const center = this.player.getCenter();
        const dirX = this.mouseX - center.x;
        const dirY = this.mouseY - center.y;
        
        // Normaliser le vecteur
        const length = Math.sqrt(dirX * dirX + dirY * dirY);
        if (length === 0) return { x: 0, y: 0 };
        
        return {
            x: dirX / length,
            y: dirY / length
        };
    }
    
    checkCollisions() {
        // Collision projectile-ennemi
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            
            if (projectile.source === 'player') {
                for (let j = this.enemies.length - 1; j >= 0; j--) {
                    const enemy = this.enemies[j];
                    
                    if (this.checkRectCollision(projectile, enemy)) {
                        // Les dégâts sont constants, c'est la pénétration qui change
                        const damage = this.player.projectileDamage || 1;
                        
                        // Déterminer si on doit appliquer des dégâts réduits
                        const isFinalTarget = projectile.enemiesHit >= this.player.piercingLevel;
                        const finalDamage = isFinalTarget ? damage * 0.5 : damage;
                        
                        const isDead = enemy.takeDamage(finalDamage);
                        
                        // Incrémenter le compteur d'ennemis touchés
                        projectile.enemiesHit++;
                        
                        // Détruire le projectile si :
                        // - Il n'a pas de pénétration (niveau 0) OU
                        // - Il a fait des dégâts réduits (c'était son dernier ennemi)
                        const shouldDestroy = this.player.piercingLevel === 0 || isFinalTarget;
                        
                        if (shouldDestroy) {
                            this.projectiles.splice(i, 1);
                        }
                        
                        if (isDead) {
                            this.enemies.splice(j, 1);
                            this.waveManager.onEnemyKilled();
                        }
                        
                        if (shouldDestroy) {
                            break;
                        }
                    }
                }
            }
            // Collision projectile ennemi - joueur
            else if (projectile.source === 'enemy' && !this.player.invulnerable) {
                if (this.checkRectCollision(projectile, this.player)) {
                    this.projectiles.splice(i, 1);
                    const isDead = this.player.takeDamage();
                    if (isDead) {
                        this.gameStateManager.endGame();
                    }
                }
            }
        }
        
        // Collision ennemi-joueur
        if (!this.player.invulnerable) {
            for (const enemy of this.enemies) {
                if (this.checkRectCollision(this.player, enemy)) {
                    const isDead = this.player.takeDamage();
                    if (isDead) {
                        this.gameStateManager.endGame();
                    }
                    break;
                }
            }
        }
    }
    
    checkRectCollision(rect1, rect2) {
        return (
            rect1.canvasX < rect2.canvasX + rect2.width &&
            rect1.canvasX + rect1.width > rect2.canvasX &&
            rect1.canvasY < rect2.canvasY + rect2.height &&
            rect1.canvasY + rect1.height > rect2.canvasY
        );
    }
    
    checkWallCollision(object) {
        let hasCollision = false;
        
        // Vérifie tous les murs et corrige chaque collision
        for (const wall of this.walls) {
            if (this.checkRectCollision(object, wall)) {
                // Collision détectée
                const overlapLeft = object.canvasX + object.width - wall.canvasX;
                const overlapRight = wall.canvasX + wall.width - object.canvasX;
                const overlapTop = object.canvasY + object.height - wall.canvasY;
                const overlapBottom = wall.canvasY + wall.height - object.canvasY;
                
                // Corriger sur la direction avec le moins de recouvrement
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
    
    checkEnemyCollisionsWithOthers(currentEnemy) {
        for (const otherEnemy of this.enemies) {
            if (currentEnemy !== otherEnemy) {
                if (this.checkRectCollision(currentEnemy, otherEnemy)) {
                    // Séparer les ennemis
                    const dx = currentEnemy.canvasX - otherEnemy.canvasX;
                    const dy = currentEnemy.canvasY - otherEnemy.canvasY;
                    
                    const length = Math.sqrt(dx * dx + dy * dy);
                    if (length < 1) { // Éviter division par zéro
                        currentEnemy.canvasX += 0.5;
                        currentEnemy.canvasY += 0.5;
                    } else {
                        const pushDistance = 1;
                        currentEnemy.canvasX += (dx / length) * pushDistance;
                        currentEnemy.canvasY += (dy / length) * pushDistance;
                    }
                }
            }
        }
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Fond
        this.ctx.save();
        this.ctx.fillStyle = '#222';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        
        // Murs
        this.ctx.save();
        this.ctx.fillStyle = 'gray';
        this.walls.forEach(wall => {
            this.ctx.fillRect(wall.canvasX, wall.canvasY, wall.width, wall.height);
        });
        this.ctx.restore();
        
        // Joueur
        this.player.render(this.ctx);
        
        // Ennemis
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        
        // Projectiles
        this.projectiles.forEach(projectile => projectile.render(this.ctx));
        
        // Informations de vague
        this.waveManager.render(this.ctx);
        
        // Expérience et niveau
        this.experienceManager.render(this.ctx);
    }
    
    reset() {
        this.loadLevel();
    }
}