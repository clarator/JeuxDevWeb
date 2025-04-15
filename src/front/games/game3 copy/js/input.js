// Classe pour gérer toutes les entrées utilisateur
export class InputHandler {
    constructor(game) {
        this.game = game;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;
        
        // Référence au canvas
        this.canvas = game.canvas.canvas;
        
        // Mise en place des écouteurs d'événements
        this.setupEventListeners();
        
        // Configuration des boutons de l'interface
        // Nous attendons que le DOM soit complètement chargé avant d'initialiser les boutons
        if (document.readyState === 'complete') {
            this.setupUIButtons();
        } else {
            window.addEventListener('load', () => {
                this.setupUIButtons();
            });
        }
    }
    
    setupEventListeners() {
        // Gestion de la souris
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        
        // Gestion du clavier
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        // Empêcher le menu contextuel
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.handleRightClick(e);
        });
    }
    
    setupUIButtons() {
        // Vérification que les éléments existent
        const basicTowerBtn = document.getElementById('basicTower');
        const mortarTowerBtn = document.getElementById('mortarTower');
        
        if (basicTowerBtn) {
            basicTowerBtn.addEventListener('click', () => {
                this.game.selectTower({ 
                    type: 'basic', 
                    cost: 25
                });
            });
        }
        
        if (mortarTowerBtn) {
            mortarTowerBtn.addEventListener('click', () => {
                this.game.selectTower({ 
                    type: 'mortar', 
                    cost: 50
                });
            });
        }
        
        // Mise à jour initiale de l'état des boutons
        this.updateButtonStates();
    }
    
    // Méthode pour mettre à jour l'état des boutons
    updateButtonStates() {
        // Vérification que game et player sont définis
        if (!this.game || !this.game.player) {
            console.warn("Le jeu ou le joueur n'est pas encore initialisé");
            return;
        }
        
        const gold = this.game.player.gold;
        
        // Récupérer les boutons
        const basicTowerBtn = document.getElementById('basicTower');
        const mortarTowerBtn = document.getElementById('mortarTower');
        
        // Vérifier que les boutons existent avant de les manipuler
        if (basicTowerBtn) {
            basicTowerBtn.disabled = gold < 25;
        }
        
        if (mortarTowerBtn) {
            mortarTowerBtn.disabled = gold < 50;
        }
    }
    
    // Convertir les coordonnées du monde en coordonnées de la grille
    getGridCoordinates(x, y) {
        const tileSize = this.game.map.tileSize;
        return {
            gridX: Math.floor(x / tileSize),
            gridY: Math.floor(y / tileSize)
        };
    }
    
    handleMouseMove(e) {
        // Obtenir les coordonnées correctes par rapport au canvas
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }
    
    handleMouseDown(e) {
        this.mouseDown = true;
    }
    
    handleMouseUp(e) {
        this.mouseDown = false;
    }
    
    handleClick(e) {
        // Obtenir les coordonnées correctes par rapport au canvas
        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Si en mode placement de tour, on tente de placer la tour
        if (this.game.placingTower) {
            const { gridX, gridY } = this.getGridCoordinates(clickX, clickY);
            const placed = this.game.placeTower(gridX, gridY);
            
            if (!placed) {
                console.log("Impossible de placer une tour ici!");
            }
        }
    }
    
    handleRightClick(e) {
        // Annuler le placement de tour en cas de clic droit
        if (this.game.placingTower) {
            this.game.cancelPlacingTower();
        }
    }
    
    handleKeyDown(e) {
        switch (e.key) {
            case 'Escape':
                // Annuler le placement de tour
                if (this.game.placingTower) {
                    this.game.cancelPlacingTower();
                }
                break;
            case 'p':
                // Mettre en pause / reprendre le jeu
                if (this.game.isPaused) {
                    this.game.resume();
                } else {
                    this.game.pause();
                }
                break;
            case 'r':
                // Redémarrer le jeu en cas de game over
                if (this.game.gameOver) {
                    this.game.restart();
                }
                break;
        }
    }
    
    handleKeyUp(e) {
        // Gestion des relâchements de touches si nécessaire
    }
}