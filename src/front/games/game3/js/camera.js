import { CELL_SIZE } from "./game.js";

export default class Camera {
    constructor(canvas) {
        this.canvas = canvas;

        this.cameraX = 0; // Position de la caméra sur l'axe X
        this.cameraY = 0; // Position de la caméra sur l'axe Y
        
        this.cameraSpeed = 0.1; // Facteur de lissage (0-1)
    }

    // Déplacer la caméra pour suivre le joueur
    updateCameraPosition(player) {
        // Calculer la position cible de la caméra (centrée sur le joueur)
        const targetCameraX = player.canvasX - this.canvas.width / 2 + CELL_SIZE / 2;
        const targetCameraY = player.canvasY - this.canvas.height / 2 + CELL_SIZE / 2;
        // Appliquer un mouvement lissé vers la position cible
        this.cameraX += (targetCameraX - this.cameraX) * this.cameraSpeed;
        this.cameraY += (targetCameraY - this.cameraY) * this.cameraSpeed;
        // console.log(this.cameraX, this.cameraY);
    }
}