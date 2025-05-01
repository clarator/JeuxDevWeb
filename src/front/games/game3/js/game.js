import Map from './map.js';

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.map = new Map(canvas);
    }

    start() {
        this.gameLoop();
        this.map.loadMap([
            [0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 1, 0, 1, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0]
        ]);
    }

    gameLoop() {

        this.map.render();

        requestAnimationFrame(() => this.gameLoop());
    }

}