import { CELL_SIZE } from "./Game.js";

export default class Camera {
    constructor(canvas) {
        this.canvas = canvas;

        // Position de la caméra dans le monde du jeu
        this.cameraX = 0; 
        this.cameraY = 0; 
        
        // Facteur de lissage pour les mouvements de caméra (entre 0 et 1)
        // 0 = pas de mouvement, 1 = mouvement instantané
        this.cameraSpeed = 0.1; 
    }

    // Met à jour la position de la caméra pour suivre le joueur avec un effet de lissage
    updateCameraPosition(player, deltaTime) {
        // Calcul de la position cible de la caméra (centrée sur le joueur)
        const targetCameraX = player.canvasX - this.canvas.width / 2 + CELL_SIZE / 2;
        const targetCameraY = player.canvasY - this.canvas.height / 2 + CELL_SIZE / 2;
        
        // Facteur de lissage adapté au deltaTime pour une animation cohérente à tous les FPS
        const smoothFactor = 1.0 - Math.pow(0.9, deltaTime * 60);
        
        // Applique un mouvement progressif vers la position cible (effet de caméra douce)
        this.cameraX += (targetCameraX - this.cameraX) * smoothFactor;
        this.cameraY += (targetCameraY - this.cameraY) * smoothFactor;
    }
}