// Classe pour l'ennemi de base
import { Enemy } from './enemy.js';

export class BasicEnemy extends Enemy {
    constructor(game, x, y, health, speed, reward) {
        // Configuration par défaut pour l'ennemi de base
        const config = {
            color: '#CC3333',
            radius: 10,
            maxHealth: health || 30
        };
        
        super(game, x, y, health || 30, speed || 50, reward || 10, config);
        
        // Propriétés spécifiques à ce type d'ennemi
        this.type = 'basic';
    }
    
    // Surcharge de la méthode de dessin
    draw() {
        const canvas = this.game.canvas;
        
        // Dessiner le corps de l'ennemi
        canvas.drawCircle(this.x, this.y, this.radius, this.color);
        
        // Dessiner la barre de vie
        this.drawHealthBar();
        
        // Effet visuel si ralenti
        if (this.isSlowed) {
            canvas.ctx.globalAlpha = 0.5;
            canvas.drawCircle(this.x, this.y, this.radius + 3, '#6699FF');
            canvas.ctx.globalAlpha = 1;
        }
    }
}