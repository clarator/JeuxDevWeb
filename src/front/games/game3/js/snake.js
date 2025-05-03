import { CELL_SIZE } from "./game.js";

export default class Snake {
    constructor() {
        this.segments = [];
        this.color = '#ff0000';
        this.speed = 2; // Plus lent que le joueur
        this.activationTimer = 0;
        this.activationDelay = 1000; // Délai d'activation en millisecondes
        this.isActive = false;
        this.playerHasMoved = false;
        
        // Propriétés du pathfinding
        this.path = [];
        this.currentNode = null;
        this.moveTimer = 0;
        this.moveDelay = 300; // Temps entre les mouvements en millisecondes
        this.gridX = 0; // Position actuelle sur la grille
        this.gridY = 0;
        this.targetX = 0; // Position cible (joueur)
        this.targetY = 0;
        this.isMoving = false;
        this.directionX = 0;
        this.directionY = 0;
    }

    startLevel(x, y) {
        this.segments = [{ x: x, y: y }];
        this.activationTimer = 0;
        this.isActive = false;
        this.playerHasMoved = false;
        this.path = [];
        this.gridX = x;
        this.gridY = y;
        this.isMoving = false;
        this.directionX = 0;
        this.directionY = 0;
    }

    update(deltaTime, player, map) {
        // Vérifier si le joueur a bougé pour démarrer le timer d'activation du serpent
        if (!this.playerHasMoved && player.isMoving) {
            this.playerHasMoved = true;
        }

        if (this.playerHasMoved) {
            if (!this.isActive) {
                this.activationTimer += deltaTime;
                
                // Activer le serpent après le délai
                if (this.activationTimer >= this.activationDelay) {
                    this.isActive = true;
                    this.gridX = this.segments[0].x;
                    this.gridY = this.segments[0].y;
                }
                
                return; // Ne pas mettre à jour le serpent tant qu'il n'est pas activé
            }

            // Obtenir la position du joueur sur la grille
            this.targetX = Math.floor((player.canvasX + CELL_SIZE/2) / CELL_SIZE);
            this.targetY = Math.floor((player.canvasY + CELL_SIZE/2) / CELL_SIZE);

            if (player.isMoving) {
                this.findPath(map.grid);
            }

        }
    }

    // Algorithme de pathfinding A*
    findPath(grid) {
        // Ignorer si déjà à la cible
        if (this.gridX === this.targetX && this.gridY === this.targetY) {
            this.path = [];
            return;
        }

        // Créer les listes ouvertes et fermées
        const openList = [];
        const closedList = [];
        const startNode = {
            x: this.gridX,
            y: this.gridY,
            g: 0,
            h: this.heuristic(this.gridX, this.gridY, this.targetX, this.targetY),
            f: 0,
            parent: null
        };
        startNode.f = startNode.g + startNode.h;
        
        openList.push(startNode);
        
        // Traiter les nœuds jusqu'à trouver le chemin ou épuiser toutes les possibilités
        while (openList.length > 0) {
            // Trouver le nœud avec le score f le plus bas
            let currentIndex = 0;
            for (let i = 0; i < openList.length; i++) {
                if (openList[i].f < openList[currentIndex].f) {
                    currentIndex = i;
                }
            }
            
            const currentNode = openList[currentIndex];
            
            // Retirer le nœud actuel de la liste ouverte et l'ajouter à la liste fermée
            openList.splice(currentIndex, 1);
            closedList.push(currentNode);
            
            // Si nous avons atteint la cible, retracer le chemin
            if (currentNode.x === this.targetX && currentNode.y === this.targetY) {
                const path = [];
                let current = currentNode;
                
                while (current.parent) {
                    path.unshift({ x: current.x, y: current.y });
                    current = current.parent;
                }
                
                this.path = path;
                return;
            }
            
            // Vérifier les voisins
            const directions = [
                { x: 0, y: -1 }, // Haut
                { x: 1, y: 0 },  // Droite
                { x: 0, y: 1 },  // Bas
                { x: -1, y: 0 }  // Gauche
            ];
            
            for (const dir of directions) {
                const neighborX = currentNode.x + dir.x;
                const neighborY = currentNode.y + dir.y;
                
                // Ignorer si hors limites
                if (neighborY < 0 || neighborY >= grid.length || 
                    neighborX < 0 || neighborX >= grid[0].length) {
                    continue;
                }
                
                // Ignorer si mur ou dans la liste fermée
                if (grid[neighborY][neighborX] === 0 || 
                    closedList.some(node => node.x === neighborX && node.y === neighborY)) {
                    continue;
                }
                
                // Calculer les coûts
                const gCost = currentNode.g + 1;
                const hCost = this.heuristic(neighborX, neighborY, this.targetX, this.targetY);
                const fCost = gCost + hCost;
                
                // Vérifier si déjà dans la liste ouverte avec un meilleur chemin
                const existingNode = openList.find(node => node.x === neighborX && node.y === neighborY);
                if (existingNode && gCost >= existingNode.g) {
                    continue;
                }
                
                // Ajouter à la liste ouverte
                openList.push({
                    x: neighborX,
                    y: neighborY,
                    g: gCost,
                    h: hCost,
                    f: fCost,
                    parent: currentNode
                });
            }
        }
        
        // Si nous arrivons ici, aucun chemin n'a été trouvé
        this.path = [];
    }
    
    // Heuristique de distance de Manhattan
    heuristic(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    checkCollision(playerX, playerY) {
        if (!this.isActive) return false;
        // Vérifier si la tête du serpent est sur la même case que le joueur
        const head = this.segments[0];
        return (Math.floor(playerX / CELL_SIZE) === head.x && 
                Math.floor(playerY / CELL_SIZE) === head.y);
    }

    render(ctx, camera) {
        if (this.segments.length === 0 || !this.isActive) return;
        
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
        
        // Débogage : Dessiner le chemin
        if (this.path.length > 0) {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
            for (const node of this.path) {
                const screenX = node.x * CELL_SIZE - camera.cameraX;
                const screenY = node.y * CELL_SIZE - camera.cameraY;
                ctx.fillRect(
                    screenX + 10, 
                    screenY + 10, 
                    CELL_SIZE - 20, 
                    CELL_SIZE - 20
                );
            }
        }
        
        ctx.restore();
    }
}