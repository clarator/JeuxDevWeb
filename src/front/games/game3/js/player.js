import { CELL_SIZE } from "./game.js";

export default class Player {
    constructor(imageSource) {
        this.score = 0;

        this.isMoving = false;
        

        // Position visuelle actuelle (en pixels)
        this.canvasX = null;
        this.canvasY = null;
    
        this.lastDirection = null;

        this.speedX = 0;
        this.speedY = 0;

        this.speedValue = 6;

        this.image = new Image();
        this.image.src = imageSource;
    } 

    startLevel(x, y) {
        this.canvasX = x * CELL_SIZE;
        this.canvasY = y * CELL_SIZE;
        this.speedX = 0;
        this.speedY = 0;
        this.isMoving = false;
        this.lastDirection = null;
    }

    update() {
        this.canvasX += this.speedX;
        this.canvasY += this.speedY;
    }

    stopMoving() {
        this.speedX = 0;
        this.speedY = 0;
        this.isMoving = false;
    }

    //dessine l'iamge du joueur
    render(ctx, camera) {
        ctx.save();

        const screenX = this.canvasX - camera.cameraX;
        const screenY = this.canvasY - camera.cameraY;

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
