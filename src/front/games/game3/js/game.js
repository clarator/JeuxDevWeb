import Map from './map.js';
import { InputManager } from './inputManager.js';
import Player from './player.js';
import Camera from './camera.js';
import GameStateManager from './gameStateManager.js';
import Snake from './snake.js';

export const CELL_SIZE = 40;

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.gameStateManager = new GameStateManager(this);
        
        this.map = new Map(canvas);
        this.player = new Player();
        this.snake = new Snake();
        this.inputManager = new InputManager(this);
        this.camera = new Camera(canvas);

        this.lastTime = 0;
        this.deltaTime = 0;

        this.fps = 0;
        this.frameCount = 0;
        this.fpsUpdateTime = 0;

        this.gameStatus = 'playing'; // 'playing', 'won', 'lost'

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.loopStarted = false;
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    loadLevel(level) {
        this.map.loadMap(level);
        this.player.startLevel(this.map.spawnX, this.map.spawnY);
        this.snake.startLevel(this.map.spawnX, this.map.spawnY);
        this.gameStatus = 'playing';
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
            this.deltaTime = now - this.lastTime;
            this.lastTime = now;
            
            this.frameCount++;
            if (now - this.fpsUpdateTime >= 1000) { // Mettre à jour le FPS toutes les secondes
                this.fps = this.frameCount;
                this.frameCount = 0;
                this.fpsUpdateTime = now;
            }

            this.update();

            this.render();
        }
        this.renderHUD();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    update() {
        // Ne pas mettre à jour si le jeu est terminé
        if (this.gameStatus !== 'playing') {
            // Permettre de retourner au menu après un court délai
            if ((this.gameStatus === 'won' || this.gameStatus === 'lost') && 
                this.inputManager.isKeyJustPressed('Space')) {
                this.gameStateManager.switchToMenu();
                return;
            }
            return;
        }

        // Vérifier si le joueur a atteint la sortie
        if (this.map.grid[
            Math.floor((this.player.canvasY + CELL_SIZE/2) / CELL_SIZE)
        ][
            Math.floor((this.player.canvasX + CELL_SIZE/2) / CELL_SIZE)
        ] === 3) {
            console.log('Vous avez gagné !');
            this.gameStatus = 'won';
            return;
        }

        const right = this.inputManager.isKeyJustPressed('ArrowRight') || this.inputManager.isKeyJustPressed('KeyD');
        const left = this.inputManager.isKeyJustPressed('ArrowLeft') || this.inputManager.isKeyJustPressed('KeyQ');
        const up = this.inputManager.isKeyJustPressed('ArrowUp') || this.inputManager.isKeyJustPressed('KeyZ');
        const down = this.inputManager.isKeyJustPressed('ArrowDown') || this.inputManager.isKeyJustPressed('KeyS');

        if (right && this.player.lastDirection !== 'right') {
            if (!this.player.isMoving) {
                this.player.speedX = this.player.speedValue;
                this.player.speedY = 0;
                this.player.lastDirection = 'right';
                this.player.isMoving = true;
            }
        }
        if (left && this.player.lastDirection !== 'left') {
            if (!this.player.isMoving) {
                this.player.speedX = -this.player.speedValue;
                this.player.speedY = 0;
                this.player.lastDirection = 'left';
                this.player.isMoving = true;
            }
        }
        if (up && this.player.lastDirection !== 'up') {
            if (!this.player.isMoving) {
                this.player.speedX = 0;
                this.player.speedY = -this.player.speedValue;
                this.player.lastDirection = 'up';
                this.player.isMoving = true;
            }
        }
        if (down && this.player.lastDirection !== 'down') {
            if (!this.player.isMoving) {
                this.player.speedX = 0;
                this.player.speedY = this.player.speedValue;
                this.player.lastDirection = 'down';
                this.player.isMoving = true;
            }
        }

        this.player.update();

        const gridXLeft = Math.floor((this.player.canvasX+1)/CELL_SIZE);
        const gridXRight = Math.floor((this.player.canvasX + CELL_SIZE-1)/CELL_SIZE);
        const gridYUp = Math.floor((this.player.canvasY+1)/CELL_SIZE);
        const gridYDown = Math.floor((this.player.canvasY + CELL_SIZE-1)/CELL_SIZE);

        this.checkCollectionsWithCollectibles(gridXLeft, gridXRight, gridYUp, gridYDown);
        this.checkCollisionsWithMap(gridXLeft, gridXRight, gridYUp, gridYDown);

        // Mettre à jour le serpent
        // Trouver la position de fin (exit)
        let endX = 0;
        let endY = 0;
        for (let y = 0; y < this.map.grid.length; y++) {
            for (let x = 0; x < this.map.grid[y].length; x++) {
                if (this.map.grid[y][x] === 3) {
                    endX = x;
                    endY = y;
                    break;
                }
            }
        }
        
        this.snake.update(this.deltaTime, this.map.grid, this.player, endX, endY);
        
        // Vérifier si le serpent a rattrapé le joueur
        if (this.snake.checkCollision(this.player.canvasX, this.player.canvasY)) {
            console.log('Le serpent vous a rattrapé ! Game over.');
            this.gameStatus = 'lost';
            return;
        }

        // Update camera to follow player
        this.camera.updateCameraPosition(this.player);
    }

    checkCollectionsWithCollectibles(gridXLeft, gridXRight, gridYUp, gridYDown) {
        const collectibles = this.map.collectibles;
        for (let i = collectibles.length - 1; i >= 0; i--) {
            const collectible = collectibles[i];    
            if (collectible.x >= gridXLeft && collectible.x <= gridXRight && 
                collectible.y >= gridYUp && collectible.y <= gridYDown) {
                this.map.collectibles.splice(i, 1);
                this.player.score += collectible.value;
            }
        }
    }

    checkCollisionsWithMap(gridXLeft, gridXRight, gridYUp, gridYDown) {
        const gridMap = this.map.grid;
        
        if (gridYDown != gridYUp && gridXLeft != gridXRight) {
            console.log('Erreur, mouvement lancé alors qu il n aurai pas du l etre');
        }        

        if (gridYDown == gridYUp) {
            if ((gridXLeft < 0 || gridXLeft >= gridMap[0].length)
                || (gridMap[gridYUp][gridXLeft] === 0 && gridMap[gridYUp][gridXRight] !== 0)) {
                this.player.canvasX = gridXRight * CELL_SIZE;
                this.player.stopMoving();
            } 
            else if ((gridXRight < 0 || gridXRight >= gridMap[0].length)
                || (gridMap[gridYUp][gridXLeft] !== 0 && gridMap[gridYUp][gridXRight] === 0)) {
                this.player.canvasX = gridXLeft * CELL_SIZE;
                this.player.stopMoving();
            }
        }

        if (gridXLeft == gridXRight) {
            if ((gridYUp < 0 || gridYUp >= gridMap.length)
                || (gridMap[gridYUp][gridXLeft] === 0 && gridMap[gridYDown][gridXLeft] !== 0)) {
                this.player.canvasY = gridYDown * CELL_SIZE;
                this.player.stopMoving();
            }
            else if ((gridYDown < 0 || gridYDown >= gridMap.length)
                || (gridMap[gridYUp][gridXLeft] !== 0 && gridMap[gridYDown][gridXLeft] === 0)) {
                this.player.canvasY = gridYUp * CELL_SIZE;
                this.player.stopMoving();
            }
        }
    }        

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.map.render(this.camera);
        this.snake.render(this.ctx, this.camera);
        this.player.render(this.ctx, this.camera);
        
        // Afficher un message de victoire ou de défaite
        if (this.gameStatus === 'won' || this.gameStatus === 'lost') {
            this.ctx.save();
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
    }

    renderHUD() {
        this.ctx.save();
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillText(`FPS: ${this.fps}`, 10, 30);
        this.ctx.fillText(`Score: ${this.player.score}`, 10, 50);
        this.ctx.restore();
    }
}