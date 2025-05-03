import { CELL_SIZE } from "./game.js";

export default class Snake {
    constructor(startX, startY) {
        this.segments = [{ x: startX, y: startY }];
        this.color = '#ff0000';
        this.speed = 2; // Plus lent que le joueur
        this.moveTimer = 0;
        this.moveInterval = 500; // En millisecondes, à ajuster selon la difficulté
        this.path = [];
        this.isMoving = false;
    }

    startLevel(x, y) {
        this.segments = [{ x: x, y: y }];
        this.moveTimer = 0;
        this.path = [];
        this.isMoving = true;
    }

    findPath(grid, targetX, targetY) {
        // Implémentation simple de A* pour trouver un chemin
        const openSet = [];
        const closedSet = [];
        const start = { 
            x: this.segments[0].x, 
            y: this.segments[0].y,
            f: 0,
            g: 0,
            h: 0,
            parent: null
        };
        
        openSet.push(start);
        
        while (openSet.length > 0) {
            // Trouver le nœud avec le coût f le plus bas
            let lowestIndex = 0;
            for (let i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[lowestIndex].f) {
                    lowestIndex = i;
                }
            }
            
            const current = openSet[lowestIndex];
            
            // Si nous avons atteint la destination
            if (current.x === targetX && current.y === targetY) {
                let temp = current;
                this.path = [];
                while (temp.parent) {
                    this.path.push({ x: temp.x, y: temp.y });
                    temp = temp.parent;
                }
                this.path.reverse();
                return;
            }
            
            // Supprimer le nœud actuel de openSet et l'ajouter à closedSet
            openSet.splice(lowestIndex, 1);
            closedSet.push(current);
            
            // Vérifier tous les voisins
            const neighbors = [
                { x: current.x + 1, y: current.y },
                { x: current.x - 1, y: current.y },
                { x: current.x, y: current.y + 1 },
                { x: current.x, y: current.y - 1 }
            ];
            
            for (let i = 0; i < neighbors.length; i++) {
                const neighbor = neighbors[i];
                
                // Vérifier si le voisin est valide
                if (neighbor.x < 0 || neighbor.y < 0 || 
                    neighbor.y >= grid.length || 
                    neighbor.x >= grid[0].length || 
                    grid[neighbor.y][neighbor.x] === 0) {
                    continue;
                }
                
                // Vérifier si le voisin est déjà dans closedSet
                let inClosedSet = false;
                for (let j = 0; j < closedSet.length; j++) {
                    if (neighbor.x === closedSet[j].x && neighbor.y === closedSet[j].y) {
                        inClosedSet = true;
                        break;
                    }
                }
                
                if (inClosedSet) {
                    continue;
                }
                
                // Calculer g, h et f pour ce voisin
                const gScore = current.g + 1;
                const hScore = Math.abs(neighbor.x - targetX) + Math.abs(neighbor.y - targetY);
                const fScore = gScore + hScore;
                
                // Vérifier si le voisin est déjà dans openSet
                let inOpenSet = false;
                for (let j = 0; j < openSet.length; j++) {
                    if (neighbor.x === openSet[j].x && neighbor.y === openSet[j].y) {
                        inOpenSet = true;
                        // Si nouveau chemin est meilleur, mettre à jour
                        if (gScore < openSet[j].g) {
                            openSet[j].g = gScore;
                            openSet[j].f = fScore;
                            openSet[j].parent = current;
                        }
                        break;
                    }
                }
                
                // Si pas dans openSet, l'ajouter
                if (!inOpenSet) {
                    const newNode = {
                        x: neighbor.x,
                        y: neighbor.y,
                        f: fScore,
                        g: gScore,
                        h: hScore,
                        parent: current
                    };
                    openSet.push(newNode);
                }
            }
        }
        
        // Aucun chemin trouvé
        this.path = [];
    }

    update(deltaTime, grid, player, endX, endY) {
        if (!this.isMoving) return;
        
        this.moveTimer += deltaTime;
        
        // Si le joueur a bougé significativement ou si nous n'avons pas de chemin
        if (this.path.length === 0 || this.moveTimer >= this.moveInterval) {
            // Calculer le chemin vers la cible (joueur ou fin selon la difficulté)
            this.findPath(grid, endX, endY);
            this.moveTimer = 0;
            
            // Avancer dans le chemin
            if (this.path.length > 0) {
                const nextPos = this.path.shift();
                this.segments.unshift({ x: nextPos.x, y: nextPos.y });
                
                // Limiter la longueur du serpent
                if (this.segments.length > 5) {
                    this.segments.pop();
                }
            }
        }
    }

    checkCollision(playerX, playerY) {
        // Vérifier si la tête du serpent est sur la même case que le joueur
        const head = this.segments[0];
        return (Math.floor(playerX / CELL_SIZE) === head.x && 
                Math.floor(playerY / CELL_SIZE) === head.y);
    }

    render(ctx, camera) {
        if (this.segments.length === 0) return;
        
        ctx.save();
        
        // Dessiner chaque segment du serpent
        for (let i = 0; i < this.segments.length; i++) {
            const segment = this.segments[i];
            const screenX = segment.x * CELL_SIZE - camera.cameraX;
            const screenY = segment.y * CELL_SIZE - camera.cameraY;
            
            // Couleur dégradée du rouge au noir pour l'effet serpent
            const alpha = 1 - (i / this.segments.length) * 0.7;
            ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
            
            // Dessiner le segment
            ctx.fillRect(
                screenX + 5, 
                screenY + 5, 
                CELL_SIZE - 10, 
                CELL_SIZE - 10
            );
            
            // Pour la tête, ajouter des "yeux"
            if (i === 0) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(
                    screenX + CELL_SIZE / 4, 
                    screenY + CELL_SIZE / 4, 
                    CELL_SIZE / 10, 
                    CELL_SIZE / 10
                );
                ctx.fillRect(
                    screenX + CELL_SIZE * 3/4 - CELL_SIZE / 10, 
                    screenY + CELL_SIZE / 4, 
                    CELL_SIZE / 10, 
                    CELL_SIZE / 10
                );
            }
        }
        
        ctx.restore();
    }
}