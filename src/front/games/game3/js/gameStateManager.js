import Game from './Game.js';

export default class GameStateManager {
    constructor(game) {
        this.canvas = game.canvas;
        this.game = game;
        this.currentState = null; // État actuel : 'game', 'menu' ou 'pause'
        this.menuElement = null;
        this.pauseMenuElement = null;
        
        // Configuration des boutons du menu pause
        const resumeButton = document.getElementById('resumeButton');
        const returnToMenuButton = document.getElementById('returnToMenuButton');
        if (resumeButton) {
            resumeButton.addEventListener('click', () => {
                this.switchToGame();
            });
        }
        
        if (returnToMenuButton) {
            returnToMenuButton.addEventListener('click', () => {
                this.switchToMenu();
            });
        }
    }

    // Passe à l'état menu
    switchToMenu() {
        this.currentState = 'menu';
        // Efface le canvas
        this.game.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.style.display = 'none';
        
        // Récupère les éléments du DOM si nécessaire
        if (!this.menuElement) {
            this.menuElement = document.getElementById('menu');
        }
        if (!this.pauseMenuElement) {
            this.pauseMenuElement = document.getElementById('pauseMenu');
        }
        
        // Affiche le menu et cache le menu de pause
        this.menuElement.style.display = 'block';
        this.pauseMenuElement.style.display = 'none';

        // Génère dynamiquement les boutons de niveau
        const levelsElement = document.getElementById("levels");
        levelsElement.innerHTML = "";

        Object.keys(levels).forEach((levelKey) => {
            const button = document.createElement('button');
            button.textContent = `Level ${levelKey}`;
            button.addEventListener('click', () => {
            this.game.loadLevel(levels[levelKey], levelKey);
            this.switchToGame();
            });
            levelsElement.appendChild(button);
        });
    }

    // Passe à l'état jeu
    switchToGame() {
        this.currentState = 'game';
        this.canvas.style.display = 'block';
        
        // Récupère les éléments du DOM si nécessaire
        if (!this.menuElement) {
            this.menuElement = document.getElementById('menu');
        }
        if (!this.pauseMenuElement) {
            this.pauseMenuElement = document.getElementById('pauseMenu');
        }
        
        // Cache les deux menus
        this.menuElement.style.display = 'none';
        this.pauseMenuElement.style.display = 'none';
    }
    
    // Passe à l'état pause
    switchToPause() {
        this.currentState = 'pause';
        
        if (!this.pauseMenuElement) {
            this.pauseMenuElement = document.getElementById('pauseMenu');
        }
        
        // Affiche le menu de pause
        this.pauseMenuElement.style.display = 'flex';
    }
}

const levels = {
    1 : {
        grid: [
        [0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,1,1,0,0,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,1,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,0,0,0,1,1,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,0,1,1,1,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,1,1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,0,1,1,0,1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,1,0,1,0,1,1,0,1,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,1,0,1,1,1,1,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,0,0,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,0,1,0,0,1,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,0,1,1,1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ],
        collectibles: [
        {"x":2,"y":24,"value":2},
        {"x":2,"y":25,"value":2},
        {"x":8,"y":18,"value":2},
        {"x":9,"y":19,"value":2},
        {"x":9,"y":18,"value":2},
        {"x":9,"y":17,"value":2},
        {"x":3,"y":14,"value":2},
        {"x":3,"y":13,"value":2},
        {"x":3,"y":12,"value":2},
        {"x":14,"y":19,"value":2},
        {"x":11,"y":27,"value":2},
        {"x":12,"y":27,"value":2},
        {"x":15,"y":23,"value":2},
        {"x":2,"y":1,"value":2},
        {"x":12,"y":4,"value":2},
        {"x":11,"y":4,"value":2},
        {"x":11,"y":5,"value":2},
        {"x":11,"y":6,"value":2},
        {"x":12,"y":6,"value":2},
        {"x":1,"y":20,"value":2},
        {"x":1,"y":21,"value":2},
        {"x":2,"y":21,"value":2},
        {"x":15,"y":24,"value":2},
        {"x":15,"y":25,"value":2},
        {"x":18,"y":22,"value":2},
        {"x":18,"y":23,"value":2},
        {"x":16,"y":16,"value":2},
        {"x":16,"y":17,"value":2},
        {"x":14,"y":18,"value":2},
        {"x":5,"y":4,"value":2},
        {"x":5,"y":5,"value":2},
        {"x":6,"y":5,"value":2}
        ]
    },
    2: {
        grid: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0],
            [0,0,0,0,0,1,1,1,2,1,0,1,1,1,1,1,1,1,1,0,1,0,0,0,1,1,1],
            [0,0,0,0,0,1,1,1,1,1,0,1,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1],
            [0,0,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,1,1,1],
            [0,0,0,0,0,1,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,1,1,1],
            [0,0,0,0,0,0,1,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [0,0,0,0,0,0,1,0,0,1,0,1,1,1,0,0,0,1,1,1,0,0,1,1,1,0,1],
            [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1,1,1,1,0,1,0,1,0,1],
            [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,3,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,0]
            ],
            collectibles: [
            {"x":5,"y":4,"value":2},
            {"x":5,"y":3,"value":2},
            {"x":5,"y":2,"value":2},
            {"x":5,"y":1,"value":2},
            {"x":6,"y":4,"value":2},
            {"x":6,"y":3,"value":2},
            {"x":6,"y":2,"value":2},
            {"x":6,"y":1,"value":2},
            {"x":8,"y":9,"value":2},
            {"x":7,"y":9,"value":2},
            {"x":7,"y":8,"value":2},
            {"x":8,"y":8,"value":2},
            {"x":13,"y":5,"value":2},
            {"x":13,"y":6,"value":2},
            {"x":12,"y":6,"value":2},
            {"x":11,"y":2,"value":2},
            {"x":11,"y":1,"value":2},
            {"x":12,"y":1,"value":2},
            {"x":17,"y":1,"value":2},
            {"x":18,"y":1,"value":2},
            {"x":18,"y":2,"value":2},
            {"x":26,"y":2,"value":2},
            {"x":26,"y":3,"value":2},
            {"x":26,"y":4,"value":2},
            {"x":26,"y":1,"value":2},
            {"x":25,"y":1,"value":2},
            {"x":18,"y":6,"value":2},
            {"x":17,"y":6,"value":2},
            {"x":17,"y":7,"value":2},
            {"x":17,"y":8,"value":2},
            {"x":18,"y":8,"value":2},
            {"x":18,"y":7,"value":2},
            {"x":19,"y":6,"value":2},
            {"x":19,"y":7,"value":2},
            {"x":24,"y":7,"value":2},
            {"x":23,"y":8,"value":2},
            {"x":22,"y":7,"value":2},
            {"x":23,"y":6,"value":2}
            ]
        },
    3 : {
        grid: [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,0,0,0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,0,0,0,0],
        [0,1,2,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,0],
        [0,1,1,1,0,0,0,0,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,0,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,0,0],
        [0,0,0,0,0,0,0,0,1,0,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,1,1,0,1,1,1,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,1,0,0,0],
        [0,0,0,0,0,0,0,0,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,0,1,0,0,0],
        [0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,1,0,1,0,1,1,1,0,1,1,0,1,0,0,0],
        [0,0,0,0,0,0,0,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,1,1,0,1,0,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0],
        [0,0,0,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,0,1,0,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,0],
        [0,0,0,1,1,0,0,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,3,1,0],
        [0,0,0,1,0,1,0,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],
        [0,0,0,1,0,1,0,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,0,0,1,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,0,0,0,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ],
        collectibles: [
        {"x":8,"y":1,"value":2},
        {"x":13,"y":4,"value":2},
        {"x":13,"y":5,"value":2},
        {"x":10,"y":11,"value":2},
        {"x":8,"y":5,"value":2},
        {"x":16,"y":11,"value":2},
        {"x":14,"y":10,"value":2},
        {"x":16,"y":10,"value":2},
        {"x":19,"y":19,"value":2},
        {"x":25,"y":10,"value":2},
        {"x":19,"y":12,"value":2},
        {"x":13,"y":1,"value":2},
        {"x":21,"y":5,"value":2},
        {"x":25,"y":1,"value":2},
        {"x":22,"y":1,"value":2},
        {"x":22,"y":4,"value":2},
        {"x":26,"y":3,"value":2},
        {"x":26,"y":4,"value":2},
        {"x":14,"y":13,"value":2},
        {"x":15,"y":13,"value":2},
        {"x":17,"y":13,"value":2},
        {"x":17,"y":20,"value":2},
        {"x":18,"y":20,"value":2},
        {"x":15,"y":19,"value":2},
        {"x":13,"y":20,"value":2},
        {"x":13,"y":17,"value":2},
        {"x":21,"y":20,"value":2},
        {"x":20,"y":13,"value":2},
        {"x":26,"y":20,"value":2},
        {"x":25,"y":12,"value":2},
        {"x":22,"y":6,"value":2},
        {"x":19,"y":6,"value":2},
        {"x":24,"y":6,"value":2},
        {"x":8,"y":12,"value":2},
        {"x":9,"y":15,"value":2},
        {"x":8,"y":19,"value":2},
        {"x":10,"y":20,"value":2}
        ]
    }
    };