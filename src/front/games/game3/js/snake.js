import { CELL_SIZE } from "./game.js";

export default class Snake {
    constructor() {
        this.color = '#ff0000';
        this.activationTimer = 0;
        this.activationDelay = 1000;
        this.isActive = false;
        this.playerHasMoved = false;
        
        this.canvasX = 0;
        this.canvasY = 0;
        this.isMoving = false;
        this.speedX = 0;
        this.speedY = 0;
        this.speedValue = 1;
        
        this.path = [];
        this.targetNode = null;
    }

    startLevel(x, y) {
        this.canvasX = x * CELL_SIZE;
        this.canvasY = y * CELL_SIZE;
        this.activationTimer = 0;
        this.isActive = false;
        this.playerHasMoved = false;
        this.isMoving = false;
        this.speedX = 0;
        this.speedY = 0;
        this.path = [];
        this.targetNode = null;
    }

    update(deltaTime, player, map) {
        // Vérifier si le joueur a bougé pour démarrer le timer d'activation
        if (!this.playerHasMoved && player.isMoving) {
            this.playerHasMoved = true;
        }

        // Ne pas mettre à jour si le serpent n'est pas encore activé
        if (this.playerHasMoved && !this.isActive) {
            this.activationTimer += deltaTime;
            if (this.activationTimer >= this.activationDelay) {
                this.isActive = true;
            }
            return;
        }
        if (!this.isActive) return;

        const snakeGridX = Math.floor(this.canvasX / CELL_SIZE);
        const snakeGridY = Math.floor(this.canvasY / CELL_SIZE);
        const playerGridX = Math.floor(player.canvasX / CELL_SIZE);
        const playerGridY = Math.floor(player.canvasY / CELL_SIZE);
        
        if (!this.isMoving) {
            this.findPath(snakeGridX, snakeGridY, playerGridX, playerGridY, map.grid);
        }

        this.moveToTargetNode();

        // Mettre à jour la position du serpent
        this.canvasX += this.speedX;
        this.canvasY += this.speedY;

        this.checkTargetNodeCollision();
    }

    moveToTargetNode() {
        if (this.isMoving) return;
        if (this.path.length === 0) {
            this.stopMoving();
            return;
        }
        if (this.targetNode === null) {
            this.targetNode = this.path[0];
        }
        this.speedX = (this.targetNode.x - Math.floor(this.canvasX / CELL_SIZE)) * this.speedValue;        
        this.speedY = (this.targetNode.y - Math.floor(this.canvasY / CELL_SIZE)) * this.speedValue;
        this.isMoving = true;
    }

    checkTargetNodeCollision() {
        if (this.targetNode === null) return;

        var targetReached = false;

        if (this.targetNode.x * CELL_SIZE === this.canvasX &&
            this.targetNode.y * CELL_SIZE === this.canvasY) {
            targetReached = true;
        }
        
        if (!targetReached && (
            this.speedX>0 && this.canvasX >= this.targetNode.x * CELL_SIZE ||
            this.speedX<0 && this.canvasX <= this.targetNode.x * CELL_SIZE ||
            this.speedY>0 && this.canvasY >= this.targetNode.y * CELL_SIZE ||
            this.speedY<0 && this.canvasY <= this.targetNode.y * CELL_SIZE
        )) {
            targetReached = true;
            this.canvasX = this.targetNode.x * CELL_SIZE;
            this.canvasY = this.targetNode.y * CELL_SIZE;
        }

        if (targetReached) {
            this.path.shift();
            this.targetNode = null;
            this.stopMoving();
        }
    }

    stopMoving() {
        this.speedX = 0;
        this.speedY = 0;
        this.isMoving = false;
    }

    // Algorithme de pathfinding A* // Fais par l'ia
    findPath(startX, startY, targetX, targetY, grid) {
        // Ignorer si déjà à la cible
        if (startX === targetX && startY === targetY) {
            this.path = [];
            return;
        }

        // Créer les listes ouvertes et fermées
        const openList = [];
        const closedList = [];
        const startNode = {
            x: startX,
            y: startY,
            g: 0,
            h: this.heuristic(startX, startY, targetX, targetY),
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
            if (currentNode.x === targetX && currentNode.y === targetY) {
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
                const hCost = this.heuristic(neighborX, neighborY, targetX, targetY);
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
        const playerGridX = Math.floor(playerX / CELL_SIZE);
        const playerGridY = Math.floor(playerY / CELL_SIZE);
        const snakeGridX = Math.floor(this.canvasX / CELL_SIZE);
        const snakeGridY = Math.floor(this.canvasY / CELL_SIZE);
        
        return (playerGridX === snakeGridX && playerGridY === snakeGridY);
    }

    render(ctx, camera) {
        if (!this.isActive) return;
        
        ctx.save();
        
        // Dessiner la tête du serpent à sa position canvas
        const screenX = this.canvasX - camera.cameraX;
        const screenY = this.canvasY - camera.cameraY;
        
        // Dessiner le serpent
        ctx.fillStyle = this.color;
        ctx.fillRect(
            screenX + 5, 
            screenY + 5, 
            CELL_SIZE - 10, 
            CELL_SIZE - 10
        );
        
        // Ajouter des "yeux" à la tête
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
        
        // // Débogage : Dessiner le chemin planifié
        // if (this.path.length > 0) {
        //     ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        //     for (const node of this.path) {
        //         const nodeScreenX = node.x * CELL_SIZE - camera.cameraX;
        //         const nodeScreenY = node.y * CELL_SIZE - camera.cameraY;
        //         ctx.fillRect(
        //             nodeScreenX + 10, 
        //             nodeScreenY + 10, 
        //             CELL_SIZE - 20, 
        //             CELL_SIZE - 20
        //         );
        //     }
        // }
        
        ctx.restore();
    }
}