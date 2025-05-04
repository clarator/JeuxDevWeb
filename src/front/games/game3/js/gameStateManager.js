import Game from './game.js';

export default class GameStateManager {
    constructor(game) {
        this.canvas = game.canvas;
        this.game = game;
        this.currentState = null; // 'game' ou 'menu'
        this.menuElement = null;
    }

    switchToMenu() {
        this.currentState = 'menu';
        this.game.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.style.display = 'none';
        if (!this.menuElement) {
            this.menuElement = document.getElementById('menu');
        }
        this.menuElement.style.display = 'block';

        const levelsElement = document.getElementById("levels");
        levelsElement.innerHTML = "";

        const levels = [
            {
                grid : [
                    [2,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0],
                    [0,0,0,1,0,0,0,1,0,0,0,1,0,1,1,3],
                    [0,0,1,1,1,1,1,1,1,0,0,1,0,1,0,0],
                    [0,0,1,1,0,0,0,1,1,0,0,1,0,1,1,0],
                    [0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,0],
                    [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0],
                ],
                collectibles : [
                    { x:1, y:0, value : 2 },
                    { x:2, y:0, value : 2 },
                    { x:3, y:0, value : 2 },
                    { x:3, y:1, value : 2 },
                    { x:3, y:2, value : 2 },
                ]
            },
        ];

        levels.forEach((level, index) => {
            const button = document.createElement('button');
            button.textContent = `Level ${index + 1}`;
            button.addEventListener('click', () => {
                this.game.loadLevel(level);
                this.switchToGame();
            });
            levelsElement.appendChild(button);
        });
    }

    switchToGame() {
        this.currentState = 'game';
        this.canvas.style.display = 'block';
        this.menuElement.style.display = 'none';
    }
}