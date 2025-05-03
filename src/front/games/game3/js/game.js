import Map from './map.js';
import { InputManager } from './inputManager.js';
import Player from './player.js';
import Camera from './camera.js';

export const CELL_SIZE = 40;

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
                
        this.map = new Map(canvas);
        this.player = null;
        this.inputManager = new InputManager(this);
        this.camera = new Camera(canvas);

        this.lastTime = 0;

        this.isRunning = false;
        
        this.fps = 0;
        this.frameCount = 0;
        this.fpsUpdateTime = 0;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        const grid = [
            [2,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0],
            [0,0,0,1,0,0,0,1,0,0,0,1,0,1,1,1],
            [0,0,1,1,1,1,1,1,1,0,0,1,0,1,0,0],
            [0,0,1,1,0,0,0,1,1,0,0,1,0,1,1,0],
            [0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,0],
            [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0],
        ];
        this.map.loadMap(grid);
        
        this.player = new Player(this.map.spawnX, this.map.spawnY);
        this.isRunning = true;

        this.lastTime = performance.now();
        this.gameLoop();
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return; // Si le jeu n'est pas en cours, ne rien faire
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

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    update() {
        this.camera.updateCameraPosition(this.player)

        if (this.inputManager.isKeyPressed('ArrowUp')) {
            console.log('up');
        }
        if (this.inputManager.isKeyPressed('ArrowDown')) {
            console.log('down');
        }
        if (this.inputManager.isKeyPressed('ArrowLeft')) {
            console.log('left');
        }
        if (this.inputManager.isKeyPressed('ArrowRight')) {
            console.log('right');
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