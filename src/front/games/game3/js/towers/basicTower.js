// Classe pour la tour basique
import { Tower } from './tower.js';

export class BasicTower extends Tower {
    constructor(game, x, y, gridX, gridY, isPreview = false) {
        // Caractéristiques de la tour basique
        const config = {
            range: 120,        // Portée en pixels
            fireRate: 1,       // Tirs par seconde
            damage: 10,        // Dégâts par projectile
            cost: 25,          // Coût en or
            color: '#3366CC',  // Couleur de la tour
            upgradeOptions: [
                {
                    name: 'Augmenter la portée',
                    cost: 15,
                    effect: (tower) => { tower.range += 30; }
                },
                {
                    name: 'Augmenter la cadence',
                    cost: 20,
                    effect: (tower) => { tower.fireRate *= 1.2; }
                },
                {
                    name: 'Augmenter les dégâts',
                    cost: 25,
                    effect: (tower) => { tower.damage += 5; }
                }
            ]
        };
        
        super(game, x, y, gridX, gridY, config, isPreview);
        
        // Propriétés spécifiques à cette tour
        this.type = 'basic';
        this.projectileType = 'basic';
        this.projectileSpeed = 300;
        this.projectileColor = '#FF9933';
    }
    
    // Méthode spécifique pour dessiner la tour basique
    drawTower() {
        const canvas = this.game.canvas;
        
        // Dessiner la base de la tour
        canvas.drawRect(
            this.x - 15,
            this.y - 15,
            30,
            30,
            this.color
        );
        
        // Dessiner le canon
        if (this.target) {
            // Calculer l'angle vers la cible
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const angle = Math.atan2(dy, dx);
            
            // Dessiner le canon orienté vers la cible
            canvas.save();
            canvas.translate(this.x, this.y);
            canvas.rotate(angle);
            canvas.drawRect(0, -3, 20, 6, '#222222');
            canvas.restore();
        } else {
            // Canon par défaut (orienté vers la droite)
            canvas.drawRect(this.x, this.y - 3, 20, 6, '#222222');
        }
    }
    
    // Méthode pour créer un projectile
    createProjectile(target) {
        if (!target) return null;
        
        return {
            type: this.projectileType,
            x: this.x,
            y: this.y,
            targetX: target.x,
            targetY: target.y,
            speed: this.projectileSpeed,
            damage: this.damage,
            color: this.projectileColor,
            hitRadius: 5
        };
    }
}