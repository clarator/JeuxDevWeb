import { CELL_SIZE } from "./Game.js";

export default class Player {
    constructor() {
        // Score du joueur
        this.score = 0;
        
        // État du mouvement
        this.isMoving = false;
        
        // Position actuelle en pixels sur le canvas
        this.canvasX = null;
        this.canvasY = null;
    
        // Dernière direction empruntée
        this.lastDirection = null;
    
        // Vitesse de déplacement en pixels/seconde
        this.speedX = 0;
        this.speedY = 0;
        this.speedValue = 750; // Valeur de base de la vitesse
    
        // Chargement de l'image du joueur
        this.image = new Image();
        this.image.src = "../../../assets/img/game3/chevalier.png";
    }

    // Initialise le joueur au début d'un niveau
    startLevel(x, y) {
        // Conversion des coordonnées de la grille en pixels
        this.canvasX = x * CELL_SIZE;
        this.canvasY = y * CELL_SIZE;
        
        // Réinitialisation des variables de mouvement
        this.speedX = 0;
        this.speedY = 0;
        this.isMoving = false;
        this.lastDirection = null;
    }

    // Met à jour la position du joueur à chaque frame
    update(deltaTime) {
        // Déplacement basé sur le temps écoulé pour une vitesse constante quel que soit le FPS
        this.canvasX += this.speedX * deltaTime;
        this.canvasY += this.speedY * deltaTime;
    }

    // Arrête le mouvement du joueur (lors d'une collision avec un mur)
    stopMoving() {
        this.speedX = 0;
        this.speedY = 0;
        this.isMoving = false;
    }

    // Dessine le joueur à l'écran en tenant compte de la position de la caméra
    render(ctx, camera) {
        ctx.save();

        // Calcul de la position à l'écran en fonction de la caméra
        const screenX = this.canvasX - camera.cameraX;
        const screenY = this.canvasY - camera.cameraY;

        // Dessin de l'image du joueur avec une légère marge pour l'esthétique
        ctx.drawImage(
            this.image,                   
            0, 0,                         
            this.image.width,             
            this.image.height,         
            screenX + 2,                 
            screenY + 2,               
            CELL_SIZE - 4,            
            CELL_SIZE - 4            
        );

        ctx.restore();
    }
}