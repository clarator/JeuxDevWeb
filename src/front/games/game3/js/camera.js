import { CELL_SIZE } from "./Game.js";

export default class Camera {
    constructor(canvas) {
        this.canvas = canvas;

        this.cameraX = 0; // Position de la caméra sur l'axe X
        this.cameraY = 0; // Position de la caméra sur l'axe Y
        
        this.cameraSpeed = 0.1; // Facteur de lissage (0-1)
    }

    updateCameraPosition(player, deltaTime) {
        // Calculer la position cible de la caméra (centrée sur le joueur)
        const targetCameraX = player.canvasX - this.canvas.width / 2 + CELL_SIZE / 2;
        const targetCameraY = player.canvasY - this.canvas.height / 2 + CELL_SIZE / 2;
        
        // Facteur de lissage adapté au delta time (plus cohérent à tous les FPS)
        const smoothFactor = 1.0 - Math.pow(0.9, deltaTime * 60);
        
        // Appliquer un mouvement lissé vers la position cible
        this.cameraX += (targetCameraX - this.cameraX) * smoothFactor;
        this.cameraY += (targetCameraY - this.cameraY) * smoothFactor;
    }
}