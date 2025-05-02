export default class Player {
    constructor(map, x, y) {
        this.map = map;
        this.gridX = x; // Position sur la grille (pas en pixels)
        this.gridY = y;
        this.targetX = x; // Position cible lors d'un déplacement
        this.targetY = y;
        this.isMoving = false;
        
        // Couleur du joueur
        this.color = '#ff5555';
        
        // Vitesse de déplacement (cellules par seconde)
        this.moveSpeed = 8;
        
        // Position visuelle actuelle (en pixels)
        this.visualX = this.gridX * this.map.cellSize;
        this.visualY = this.gridY * this.map.cellSize;
    }
    
    // Tente de déplacer le joueur dans une direction (jusqu'à un mur)
    move(dirX, dirY) {
        // Si le joueur est déjà en mouvement, ne pas accepter de nouvelle direction
        if (this.isMoving) return false;
        
        // Direction de déplacement courante
        this.currentDirX = dirX;
        this.currentDirY = dirY;
        
        // Trouver la position la plus éloignée possible dans cette direction jusqu'à un mur
        let newX = this.gridX;
        let newY = this.gridY;
        
        // On continue à avancer dans la direction tant qu'on ne rencontre pas de mur
        while (this.isValidPosition(newX + dirX, newY + dirY)) {
            newX += dirX;
            newY += dirY;
        }
        
        // Si la nouvelle position est différente de la position actuelle
        if (newX !== this.gridX || newY !== this.gridY) {
            this.targetX = newX;
            this.targetY = newY;
            this.isMoving = true;
            return true;
        }
        
        return false;
    }
    
    // Vérifie si une position est valide pour le déplacement
    isValidPosition(x, y) {
        // Vérifier les limites de la carte
        if (x < 0 || y < 0 || y >= this.map.grid.length || x >= this.map.grid[y].length) {
            return false;
        }
        
        // Vérifier si la case est un espace vide (valeur 1) ou un point de spawn (valeur 2)
        return this.map.grid[y][x] === 1 || this.map.grid[y][x] === 2;
    }
    
    // Mettre à jour la position visuelle du joueur (animation de déplacement)
    update(deltaTime) {
        if (this.isMoving) {
            // Calculer les positions cibles en pixels
            const targetPixelX = this.targetX * this.map.cellSize;
            const targetPixelY = this.targetY * this.map.cellSize;
            
            // Calculer la distance à parcourir
            const dx = targetPixelX - this.visualX;
            const dy = targetPixelY - this.visualY;
            
            // Calculer la distance totale
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 1) {
                // Arrivé à destination
                this.visualX = targetPixelX;
                this.visualY = targetPixelY;
                this.gridX = this.targetX;
                this.gridY = this.targetY;
                this.isMoving = false;
            } else {
                // Se déplacer vers la cible à une vitesse constante, mais plus rapide
                // pour compenser les longues distances
                const moveAmount = this.moveSpeed * this.map.cellSize * deltaTime / 1000;
                const moveRatio = moveAmount / distance;
                
                // Augmenter la vitesse en fonction de la distance totale
                const speedMultiplier = Math.min(2, 1 + distance / (this.map.cellSize * 3));
                
                this.visualX += dx * moveRatio * speedMultiplier;
                this.visualY += dy * moveRatio * speedMultiplier;
            }
        }
    }
    
    // Dessiner le joueur
    render(ctx, cameraX, cameraY) {
        const screenX = this.visualX - cameraX;
        const screenY = this.visualY - cameraY;
        
        // Dessiner le joueur comme un carré rouge
        ctx.fillStyle = this.color;
        ctx.fillRect(
            screenX + 2, 
            screenY + 2, 
            this.map.cellSize - 4, 
            this.map.cellSize - 4
        );
        
        // Ajouter un contour
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            screenX + 2, 
            screenY + 2, 
            this.map.cellSize - 4, 
            this.map.cellSize - 4
        );
    }
}