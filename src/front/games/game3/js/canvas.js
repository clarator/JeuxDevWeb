// Classe pour gérer le canvas et fournir des méthodes de dessin utiles
export class Canvas {
    constructor(id, width, height) {
        this.canvas = document.getElementById(id);
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    
    drawRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }
    
    drawCircle(x, y, radius, color) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawLine(x1, y1, x2, y2, color, width = 1) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
    
    drawText(text, x, y, color, font = '16px Arial', align = 'left') {
        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.textAlign = align;
        this.ctx.fillText(text, x, y);
    }
    
    drawImage(image, x, y, width, height) {
        this.ctx.drawImage(image, x, y, width, height);
    }
    
    // Méthode pour dessiner un sprite à partir d'une spritesheet
    drawSprite(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight) {
        this.ctx.drawImage(
            image,
            sourceX, sourceY,
            sourceWidth, sourceHeight,
            destX, destY,
            destWidth, destHeight
        );
    }
    
    // Utilitaire pour mesurer le texte
    measureText(text, font = '16px Arial') {
        this.ctx.font = font;
        return this.ctx.measureText(text);
    }
    
    // Sauvegarde/restauration du contexte
    save() {
        this.ctx.save();
    }
    
    restore() {
        this.ctx.restore();
    }
    
    // Méthodes de transformation
    translate(x, y) {
        this.ctx.translate(x, y);
    }
    
    rotate(angle) {
        this.ctx.rotate(angle);
    }
    
    scale(x, y) {
        this.ctx.scale(x, y);
    }
}