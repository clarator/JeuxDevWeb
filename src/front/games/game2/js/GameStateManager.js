import Utils from "./utils.js";

export default class GameStateManager {
    constructor(game) {
        this.game = game;
        this.states = {
            MENU: 'menu',
            PLAYING: 'playing',
            GAME_OVER: 'gameOver',
            PAUSE: 'pause'
        };
        
        // État initial
        this.currentState = this.states.MENU;
        
        // Statistiques de la partie
        this.stats = {
            score: 0,
            wave: 1,
            enemiesKilled: 0
        };
        
        // Référence au gestionnaire d'entrées
        this.inputHandler = game.inputHandler;
        
        // Éléments UI pour le menu et pause
        this.playButton = {
            x: 0, 
            y: 0, 
            width: 0, 
            height: 0,
            text: 'JOUER'
        };
        
        this.resumeButton = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            text: 'REPRENDRE'
        };
        
        this.menuButton = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            text: 'MENU'
        };
        
        // Au début, calculer la taille et position des boutons
        this.resizeUI();
        
        // Ajouter un écouteur d'événement pour la touche Échap (mettre en pause)
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
                if (this.currentState === this.states.PLAYING) {
                    this.pauseGame();
                } else if (this.currentState === this.states.PAUSE) {
                    this.resumeGame();
                }
            }
        });
    }
    
    // Mise à jour en fonction de l'état actuel
    update(deltaTime) {
        switch (this.currentState) {
            case this.states.MENU:
                this.updateMenu();
                break;
            case this.states.PLAYING:
                this.updatePlaying(deltaTime);
                break;
            case this.states.GAME_OVER:
                this.updateGameOver();
                break;
            case this.states.PAUSE:
                this.updatePause();
                break;
        }
    }
    
    // Mise à jour du menu
    updateMenu() {
        // Vérifier si le bouton jouer est cliqué
        if (this.inputHandler.justClicked) {
            const mouseX = this.inputHandler.mouseX;
            const mouseY = this.inputHandler.mouseY;
            
            if (
                mouseX >= this.playButton.x && 
                mouseX <= this.playButton.x + this.playButton.width &&
                mouseY >= this.playButton.y &&
                mouseY <= this.playButton.y + this.playButton.height
            ) {
                // Démarrer une nouvelle partie
                this.startNewGame();
            }
        }
    }
    
    // Mise à jour pendant le jeu
    updatePlaying(deltaTime) {
        // La logique principale du jeu est gérée dans Game.js
    }
    
    // Mise à jour de l'écran de game over
    updateGameOver() {
        // Vérifier si le bouton de retour au menu est cliqué
        if (this.inputHandler.justClicked) {
            const mouseX = this.inputHandler.mouseX;
            const mouseY = this.inputHandler.mouseY;
            
            if (
                mouseX >= this.menuButton.x && 
                mouseX <= this.menuButton.x + this.menuButton.width &&
                mouseY >= this.menuButton.y &&
                mouseY <= this.menuButton.y + this.menuButton.height
            ) {
                // Retour au menu
                this.currentState = this.states.MENU;
            }
        }
    }
    
    // Mise à jour pendant la pause
    updatePause() {
        if (this.inputHandler.justClicked) {
            const mouseX = this.inputHandler.mouseX;
            const mouseY = this.inputHandler.mouseY;
            
            // Vérifier si le bouton reprendre est cliqué
            if (
                mouseX >= this.resumeButton.x && 
                mouseX <= this.resumeButton.x + this.resumeButton.width &&
                mouseY >= this.resumeButton.y &&
                mouseY <= this.resumeButton.y + this.resumeButton.height
            ) {
                this.resumeGame();
            }
            
            // Vérifier si le bouton menu est cliqué
            if (
                mouseX >= this.menuButton.x && 
                mouseX <= this.menuButton.x + this.menuButton.width &&
                mouseY >= this.menuButton.y &&
                mouseY <= this.menuButton.y + this.menuButton.height
            ) {
                this.currentState = this.states.MENU;
            }
        }
    }
    
    // Dessiner en fonction de l'état actuel
    draw(ctx) {
        switch (this.currentState) {
            case this.states.MENU:
                this.drawMenu(ctx);
                break;
            case this.states.GAME_OVER:
                this.drawGameOver(ctx);
                break;
            case this.states.PAUSE:
                this.drawPause(ctx);
                break;
        }
    }
    
    // Dessiner le menu principal
    drawMenu(ctx) {
        const canvas = ctx.canvas;
        const scaleRatio = Utils.getScaleRatio(canvas.width, canvas.height);
        
        // Fond sombre
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Titre du jeu
        ctx.fillStyle = 'white';
        ctx.font = `${Math.floor(Utils.scaleValue(60, scaleRatio))}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('SUPER SHOOTER', canvas.width / 2, canvas.height / 3);
        
        // Dessiner le bouton jouer
        ctx.fillStyle = '#333';
        ctx.fillRect(this.playButton.x, this.playButton.y, this.playButton.width, this.playButton.height);
        
        ctx.fillStyle = 'white';
        ctx.font = `${Math.floor(Utils.scaleValue(30, scaleRatio))}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(
            this.playButton.text, 
            this.playButton.x + this.playButton.width / 2, 
            this.playButton.y + this.playButton.height / 2 + Utils.scaleValue(10, scaleRatio)
        );
        
        // Instructions
        ctx.font = `${Math.floor(Utils.scaleValue(20, scaleRatio))}px Arial`;
        ctx.fillText(
            'Déplacement: ZQSD - Tirer: Clic Souris - Pause: Échap/P', 
            canvas.width / 2, 
            canvas.height * 0.7
        );
    }
    
    // Dessiner l'écran de game over
    drawGameOver(ctx) {
        const canvas = ctx.canvas;
        const scaleRatio = Utils.getScaleRatio(canvas.width, canvas.height);
        
        // Fond semi-transparent
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Texte de Game Over
        ctx.fillStyle = 'white';
        ctx.font = `${Math.floor(Utils.scaleValue(60, scaleRatio))}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 3);
        
        // Score et vague
        ctx.font = `${Math.floor(Utils.scaleValue(30, scaleRatio))}px Arial`;
        ctx.fillText(
            `Score: ${this.stats.score} - Vague: ${this.stats.wave}`, 
            canvas.width / 2, 
            canvas.height / 2
        );
        
        // Bouton de retour au menu
        ctx.fillStyle = '#333';
        ctx.fillRect(
            this.menuButton.x, 
            this.menuButton.y, 
            this.menuButton.width, 
            this.menuButton.height
        );
        
        ctx.fillStyle = 'white';
        ctx.font = `${Math.floor(Utils.scaleValue(30, scaleRatio))}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(
            'MENU', 
            this.menuButton.x + this.menuButton.width / 2, 
            this.menuButton.y + this.menuButton.height / 2 + Utils.scaleValue(10, scaleRatio)
        );
    }
    
    // Dessiner l'écran de pause
    drawPause(ctx) {
        const canvas = ctx.canvas;
        const scaleRatio = Utils.getScaleRatio(canvas.width, canvas.height);
        
        // Fond semi-transparent
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Titre de pause
        ctx.fillStyle = 'white';
        ctx.font = `${Math.floor(Utils.scaleValue(60, scaleRatio))}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('PAUSE', canvas.width / 2, canvas.height / 3);
        
        // Vague et score actuels
        ctx.font = `${Math.floor(Utils.scaleValue(24, scaleRatio))}px Arial`;
        ctx.fillText(
            `Vague: ${this.stats.wave} - Score: ${this.stats.score}`, 
            canvas.width / 2, 
            canvas.height / 2 - Utils.scaleValue(30, scaleRatio)
        );
        
        // Bouton reprendre
        ctx.fillStyle = '#333';
        ctx.fillRect(
            this.resumeButton.x, 
            this.resumeButton.y, 
            this.resumeButton.width, 
            this.resumeButton.height
        );
        
        ctx.fillStyle = 'white';
        ctx.font = `${Math.floor(Utils.scaleValue(30, scaleRatio))}px Arial`;
        ctx.fillText(
            'REPRENDRE', 
            this.resumeButton.x + this.resumeButton.width / 2, 
            this.resumeButton.y + this.resumeButton.height / 2 + Utils.scaleValue(10, scaleRatio)
        );
        
        // Bouton menu
        ctx.fillStyle = '#333';
        ctx.fillRect(
            this.menuButton.x, 
            this.menuButton.y, 
            this.menuButton.width, 
            this.menuButton.height
        );
        
        ctx.fillStyle = 'white';
        ctx.fillText(
            'MENU', 
            this.menuButton.x + this.menuButton.width / 2, 
            this.menuButton.y + this.menuButton.height / 2 + Utils.scaleValue(10, scaleRatio)
        );
        
        // Instructions
        ctx.font = `${Math.floor(Utils.scaleValue(18, scaleRatio))}px Arial`;
        ctx.fillText(
            'Appuyez sur Échap ou P pour reprendre', 
            canvas.width / 2, 
            canvas.height - Utils.scaleValue(50, scaleRatio)
        );
    }
    
    // Redimensionner les éléments de l'interface
    resizeUI() {
        const canvas = this.game.canvas;
        const scaleRatio = Utils.getScaleRatio(canvas.width, canvas.height);
        
        // Redimensionner le bouton jouer
        this.playButton.width = Utils.scaleValue(200, scaleRatio);
        this.playButton.height = Utils.scaleValue(60, scaleRatio);
        this.playButton.x = canvas.width / 2 - this.playButton.width / 2;
        this.playButton.y = canvas.height / 2;
        
        // Redimensionner le bouton reprendre (pause)
        this.resumeButton.width = Utils.scaleValue(200, scaleRatio);
        this.resumeButton.height = Utils.scaleValue(60, scaleRatio);
        this.resumeButton.x = canvas.width / 2 - this.resumeButton.width / 2;
        this.resumeButton.y = canvas.height / 2 + Utils.scaleValue(20, scaleRatio);
        
        // Redimensionner le bouton menu (pause et game over)
        this.menuButton.width = Utils.scaleValue(200, scaleRatio);
        this.menuButton.height = Utils.scaleValue(60, scaleRatio);
        this.menuButton.x = canvas.width / 2 - this.menuButton.width / 2;
        this.menuButton.y = this.resumeButton.y + this.resumeButton.height + Utils.scaleValue(20, scaleRatio);
    }
    
    // Démarrer une nouvelle partie
    startNewGame() {
        // Réinitialiser les statistiques
        this.stats.score = 0;
        this.stats.wave = 1;
        this.stats.enemiesKilled = 0;
        
        // Dire au jeu de tout réinitialiser
        this.game.reset();
        
        // Changer l'état
        this.currentState = this.states.PLAYING;
    }
    
    // Mettre le jeu en pause
    pauseGame() {
        if (this.currentState === this.states.PLAYING) {
            this.currentState = this.states.PAUSE;
        }
    }
    
    // Reprendre le jeu
    resumeGame() {
        if (this.currentState === this.states.PAUSE) {
            this.currentState = this.states.PLAYING;
        }
    }
    
    // Terminer la partie
    endGame() {
        this.currentState = this.states.GAME_OVER;
    }
    
    // Ajouter des points au score
    addScore(points) {
        this.stats.score += points;
        this.stats.enemiesKilled++;
    }
    
    // Avancer à la vague suivante
    nextWave() {
        this.stats.wave++;
    }
    
    // Vérifier si le jeu est en cours
    isPlaying() {
        return this.currentState === this.states.PLAYING;
    }
}