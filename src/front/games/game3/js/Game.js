import Map from './map.js';
import InputManager from '../../common/inputManager.js';
import Player from './player.js';
import Camera from './camera.js';
import GameStateManager from './gameStateManager.js';
import Snake from './snake.js';
import { saveScoreGame3 } from './score.js';
import { getCookie } from '../../common/cookie.js';

// Définition de la taille d'une cellule en pixels pour tout le jeu
export const CELL_SIZE = 40;

export default class Game {
    constructor(canvas) {
        // Élément canvas et contexte 2D pour le rendu
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Gestionnaire des états du jeu (menu, jeu, pause)
        this.gameStateManager = new GameStateManager(this);
        
        // Initialisation des composants du jeu
        this.map = new Map(canvas);
        this.player = new Player();
        this.inputManager = new InputManager(this);
        this.camera = new Camera(canvas);
        this.snake = new Snake();

        // Variables de temps pour la boucle de jeu
        this.lastTime = 0;
        this.deltaTime = 0;

        // Variables pour calculer et afficher les FPS
        this.fps = 0;
        this.frameCount = 0;
        this.fpsUpdateTime = 0;

        // État actuel du jeu : 'playing', 'won', 'lost'
        this.gameStatus = 'playing';

        // Redimensionne le canvas au démarrage et à chaque redimensionnement de la fenêtre
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.loopStarted = false;
        this.levelNumber = null;
    }
    
    // Ajuste la taille du canvas à celle de la fenêtre
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // Charge un niveau spécifique
    loadLevel(level, levelNumber) {
        this.map.loadMap(level);
        this.player.startLevel(this.map.spawnX, this.map.spawnY);
        this.snake.startLevel(this.map.spawnX, this.map.spawnY);
        this.gameStatus = 'playing';
        this.levelNumber = levelNumber;
    }

    // Démarre le jeu
    start() {
        this.gameStateManager.switchToMenu();
        this.lastTime = performance.now();
        this.loopStarted = true;
        this.gameLoop();
    }

    // Boucle principale du jeu
    gameLoop(timestamp) {
        // Calcul du temps écoulé depuis la dernière frame (en secondes)
        const now = timestamp || performance.now();
        this.deltaTime = (now - this.lastTime) / 1000;
        this.lastTime = now;
        
        // Calcul des images par seconde (FPS)
        this.frameCount++;
        if (now - this.fpsUpdateTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsUpdateTime = now;
        }
        
        // Comportement adapté à l'état actuel du jeu
        if (this.gameStateManager.currentState === 'game') {
            // Mode jeu : mise à jour et rendu
            this.update();
            this.render();
        } else if (this.gameStateManager.currentState === 'pause') {
            // Mode pause : seulement rendu (pas de mise à jour)
            this.render();
        }
        
        // Continue la boucle de jeu
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    // Met à jour l'état du jeu
    update() {
        // Ne pas mettre à jour si le jeu est terminé
        if (this.gameStatus !== 'playing') {
            // Permet de retourner au menu après la fin d'une partie
            if ((this.gameStatus === 'won' || this.gameStatus === 'lost') && 
                this.inputManager.isKeyJustPressed('Space')) {

                // Sauvegarde le score avant de revenir au menu
                const pseudo = getCookie('user');
                saveScoreGame3(pseudo, this.player.score, this.levelNumber);

                this.gameStateManager.switchToMenu();
                return;
            }
            return;
        }
    
        // Gestion de la mise en pause
        if (this.inputManager.isKeyPressed('Escape') || this.inputManager.isKeyPressed('KeyP')) {
            this.gameStateManager.switchToPause();
            return;
        }

        // Vérifie si le joueur a atteint la sortie
        if (this.map.grid[
            Math.floor((this.player.canvasY + CELL_SIZE/2) / CELL_SIZE)
        ][
            Math.floor((this.player.canvasX + CELL_SIZE/2) / CELL_SIZE)
        ] === 3) {
            console.log('Vous avez gagné !');
            this.gameStatus = 'won';
            return;
        }
    
        // Gestion des entrées utilisateur pour le déplacement du joueur
        const right = this.inputManager.isKeyJustPressed('ArrowRight') || this.inputManager.isKeyJustPressed('KeyD');
        const left = this.inputManager.isKeyJustPressed('ArrowLeft') || this.inputManager.isKeyJustPressed('KeyA');
        const up = this.inputManager.isKeyJustPressed('ArrowUp') || this.inputManager.isKeyJustPressed('KeyW');
        const down = this.inputManager.isKeyJustPressed('ArrowDown') || this.inputManager.isKeyJustPressed('KeyS');
    
        // Change la direction du joueur s'il n'est pas déjà en mouvement
        if (!this.player.isMoving) {
            if (right && this.player.lastDirection !== 'right') {
                this.player.speedX = this.player.speedValue;
                this.player.speedY = 0;
                this.player.lastDirection = 'right';
                this.player.isMoving = true;
            }
            if (left && this.player.lastDirection !== 'left') {
                this.player.speedX = -this.player.speedValue;
                this.player.speedY = 0;
                this.player.lastDirection = 'left';
                this.player.isMoving = true;
            }
            if (up && this.player.lastDirection !== 'up') {
                this.player.speedX = 0;
                this.player.speedY = -this.player.speedValue;
                this.player.lastDirection = 'up';
                this.player.isMoving = true;
            }
            if (down && this.player.lastDirection !== 'down') {
                this.player.speedX = 0;
                this.player.speedY = this.player.speedValue;
                this.player.lastDirection = 'down';
                this.player.isMoving = true;
            }
        }

        // Met à jour la position du joueur
        this.player.update(this.deltaTime);
    
        // Calcule les coordonnées de la grille pour les collisions
        const gridXLeft = Math.floor((this.player.canvasX+1)/CELL_SIZE);
        const gridXRight = Math.floor((this.player.canvasX + CELL_SIZE-1)/CELL_SIZE);
        const gridYUp = Math.floor((this.player.canvasY+1)/CELL_SIZE);
        const gridYDown = Math.floor((this.player.canvasY + CELL_SIZE-1)/CELL_SIZE);
    
        // Vérifie les collisions avec les objets collectables et les murs
        this.checkCollectionsWithCollectibles(gridXLeft, gridXRight, gridYUp, gridYDown);
        this.checkCollisionsWithMap(gridXLeft, gridXRight, gridYUp, gridYDown);
    
        // Met à jour le serpent et vérifie s'il a attrapé le joueur
        this.snake.update(this.deltaTime, this.player, this.map);
        
        if (this.snake.checkCollision(this.player.canvasX, this.player.canvasY)) {
            console.log('Le serpent vous a rattrapé !');
            this.gameStatus = 'lost';
            return;
        }
    
        // Met à jour la caméra pour suivre le joueur
        this.camera.updateCameraPosition(this.player, this.deltaTime);
    }
    
    // Vérifie les collisions avec les objets collectables
    checkCollectionsWithCollectibles(gridXLeft, gridXRight, gridYUp, gridYDown) {
        const collectibles = this.map.collectibles;
        // Parcourt les collectibles en sens inverse pour pouvoir les supprimer sans problème
        for (let i = collectibles.length - 1; i >= 0; i--) {
            const collectible = collectibles[i];    
            if (collectible.x >= gridXLeft && collectible.x <= gridXRight && 
                collectible.y >= gridYUp && collectible.y <= gridYDown) {
                // Collecte l'objet
                this.map.collectibles.splice(i, 1);
                this.player.score += collectible.value;
            }
        }
    }

    // Vérifie les collisions avec les murs de la carte
    checkCollisionsWithMap(gridXLeft, gridXRight, gridYUp, gridYDown) {
        const gridMap = this.map.grid;
        
        // Vérification de cohérence (débogage)
        if (gridYDown != gridYUp && gridXLeft != gridXRight) {
            console.log('Erreur, mouvement lancé alors qu\'il n\'aurait pas dû l\'être');
        }        

        // Gestion des collisions horizontales
        if (gridYDown == gridYUp) {
            if ((gridXLeft < 0 || gridXLeft >= gridMap[0].length)
                || (gridMap[gridYUp][gridXLeft] === 0 && gridMap[gridYUp][gridXRight] !== 0)) {
                // Collision à gauche, ajuste la position et arrête le mouvement
                this.player.canvasX = gridXRight * CELL_SIZE;
                this.player.stopMoving();
            } 
            else if ((gridXRight < 0 || gridXRight >= gridMap[0].length)
                || (gridMap[gridYUp][gridXLeft] !== 0 && gridMap[gridYUp][gridXRight] === 0)) {
                // Collision à droite, ajuste la position et arrête le mouvement
                this.player.canvasX = gridXLeft * CELL_SIZE;
                this.player.stopMoving();
            }
        }

        // Gestion des collisions verticales
        if (gridXLeft == gridXRight) {
            if ((gridYUp < 0 || gridYUp >= gridMap.length)
                || (gridMap[gridYUp][gridXLeft] === 0 && gridMap[gridYDown][gridXLeft] !== 0)) {
                // Collision en haut, ajuste la position et arrête le mouvement
                this.player.canvasY = gridYDown * CELL_SIZE;
                this.player.stopMoving();
            }
            else if ((gridYDown < 0 || gridYDown >= gridMap.length)
                || (gridMap[gridYUp][gridXLeft] !== 0 && gridMap[gridYDown][gridXLeft] === 0)) {
                // Collision en bas, ajuste la position et arrête le mouvement
                this.player.canvasY = gridYUp * CELL_SIZE;
                this.player.stopMoving();
            }
        }
    }        

    // Dessine tous les éléments du jeu
    render() {
        // Efface l'écran
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dessine la carte, le joueur et le serpent
        this.map.render(this.camera);
        this.player.render(this.ctx, this.camera);
        this.snake.render(this.ctx, this.camera);
        
        // Affiche un message de victoire ou de défaite si le jeu est terminé
        if (this.gameStatus === 'won' || this.gameStatus === 'lost') {
            this.ctx.save();
            // Fond semi-transparent
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.font = '36px Arial';
            this.ctx.textAlign = 'center';
            
            if (this.gameStatus === 'won') {
                this.ctx.fillStyle = '#00ff00';
                this.ctx.fillText('Vous avez gagné !', this.canvas.width / 2, this.canvas.height / 2);
            } else {
                this.ctx.fillStyle = '#ff0000';
                this.ctx.fillText('Le serpent vous a rattrapé !', this.canvas.width / 2, this.canvas.height / 2);
            }
            
            this.ctx.font = '20px Arial';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText('Appuyez sur ESPACE pour revenir au menu', this.canvas.width / 2, this.canvas.height / 2 + 50);
            
            this.ctx.restore();
        }
        
        // Affiche l'interface utilisateur (HUD)
        this.renderHUD();
    }

    // Affiche l'interface utilisateur avec les informations de jeu
    renderHUD() {
        this.ctx.save();
        this.ctx.font = '16px Arial';
        
        // Affiche les FPS et le score
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillText(`FPS: ${this.fps}`, 10, 30);
        this.ctx.fillText(`Score: ${this.player.score}`, 10, 50);
        
        // Rappel des touches pour mettre en pause
        this.ctx.fillStyle = '#aaaaaa';
        this.ctx.fillText('ESC/P: Pause', 10, 70);
        
        this.ctx.restore();
    }
}