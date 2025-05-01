export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.player = { x: 50, y: 50, size: 20 };
        this.enemies = [];
        this.score = 0;
        this.gameOver = false;
    }

    start() {
        this.gameLoop();
    }

    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
    }

}