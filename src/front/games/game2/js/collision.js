// Classe pour gérer les collisions
class Collision {
    // Détecte la collision entre deux rectangles
    static checkRectCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }
    
    // Vérifie et résout la collision d'un objet avec les murs
    static handleWallCollision(object, walls) {
        for (const wall of walls) {
            if (this.checkRectCollision(object, wall)) {
                // Déterminer la direction de la collision
                const overlapLeft = object.x + object.width - wall.x;
                const overlapRight = wall.x + wall.width - object.x;
                const overlapTop = object.y + object.height - wall.y;
                const overlapBottom = wall.y + wall.height - object.y;
                
                // Trouver la plus petite distance de recouvrement
                const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
                
                // Déplacer l'objet en fonction de la plus petite distance
                if (minOverlap === overlapLeft) {
                    object.x = wall.x - object.width;
                    return { axis: 'x', direction: 'left' };
                } else if (minOverlap === overlapRight) {
                    object.x = wall.x + wall.width;
                    return { axis: 'x', direction: 'right' };
                } else if (minOverlap === overlapTop) {
                    object.y = wall.y - object.height;
                    return { axis: 'y', direction: 'top' };
                } else if (minOverlap === overlapBottom) {
                    object.y = wall.y + wall.height;
                    return { axis: 'y', direction: 'bottom' };
                }
            }
        }
        
        return null; // Pas de collision
    }
}