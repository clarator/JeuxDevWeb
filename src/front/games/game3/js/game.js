import Map from './map.js';
import { InputManager } from './inputManager.js';
import Player from './player.js';
import Camera from './camera.js';
import GameStateManager from './gameStateManager.js';

export const CELL_SIZE = 40;

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.gameStateManager = new GameStateManager(this);
        
        this.map = new Map(canvas);
        this.player = null;
        this.inputManager = new InputManager(this);
        this.camera = new Camera(canvas);

        this.lastTime = 0;

        this.fps = 0;
        this.frameCount = 0;
        this.fpsUpdateTime = 0;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.loopStarted = false;
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    loadLevel(grid) { 
        this.map.loadMap(grid);
        this.player = new Player(this.map.spawnX, this.map.spawnY);
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
            const deltaTime = now - this.lastTime;
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
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    update() {
        if (this.map.grid[
            Math.floor((this.player.canvasY+1)/CELL_SIZE)
        ][
            Math.floor((this.player.canvasX+1)/CELL_SIZE)
        ] === 3) {
            console.log('Vous avez gagné !');
            this.gameStateManager.switchToMenu();
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
        if (this.inputManager.isKeyJustPressed('Space')) {
            this.player.stopMoving();
        }
         
        this.player.update();

        this.checkCollisionWithMap();

        // Update camera to follow player
        this.camera.updateCameraPosition(this.player);
    }

    checkCollisionWithMap() {
        const gridMap = this.map.grid;
        
        const gridXLeft = Math.floor((this.player.canvasX+1)/CELL_SIZE);
        const gridXRight = Math.floor((this.player.canvasX + CELL_SIZE-1)/CELL_SIZE);
        const gridYUp = Math.floor((this.player.canvasY+1)/CELL_SIZE);
        const gridYDown = Math.floor((this.player.canvasY + CELL_SIZE-1)/CELL_SIZE);

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
        this.player.render(this.ctx, this.camera);

        this.renderFPS();
    }
    
    renderFPS() {
        this.ctx.save();
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillText(`FPS: ${this.fps}`, 10, 30);
        this.ctx.restore();
    }
}