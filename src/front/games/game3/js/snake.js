import { CELL_SIZE } from "./Game.js";

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
        
        // Variables pour les segments du serpent
        this.segments = [];
        this.segmentCount = 5; // Nombre de segments
        this.direction = 'right'; // Direction actuelle du serpent
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
        
        // Réinitialiser complètement tous les segments
        this.segments = [];
        for (let i = 0; i < this.segmentCount; i++) {
            this.segments.push({
                x: this.canvasX,
                y: this.canvasY
            });
        }
        this.direction = 'right';
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
        
        // Mettre à jour les segments
        this.updateSegments();
        
        // Mettre à jour la direction
        this.updateDirection();

        this.checkTargetNodeCollision();
    }

    updateSegments() {
        // Déplacer chaque segment vers la position du segment précédent
        for (let i = this.segments.length - 1; i > 0; i--) {
            this.segments[i].x += (this.segments[i-1].x - this.segments[i].x) * 0.1;
            this.segments[i].y += (this.segments[i-1].y - this.segments[i].y) * 0.1;
        }
        
        // La tête suit la position actuelle
        this.segments[0].x = this.canvasX;
        this.segments[0].y = this.canvasY;
    }

    updateDirection() {
        // Déterminer la direction en fonction de la vitesse
        if (this.speedX > 0) this.direction = 'right';
        else if (this.speedX < 0) this.direction = 'left';
        else if (this.speedY > 0) this.direction = 'down';
        else if (this.speedY < 0) this.direction = 'up';
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
        
        // Dessiner les segments du serpent (du corps à la tête)
        for (let i = this.segments.length - 1; i >= 0; i--) {
            const segment = this.segments[i];
            const screenX = segment.x - camera.cameraX;
            const screenY = segment.y - camera.cameraY;
            
            // Dessiner un segment
            ctx.beginPath();
            ctx.fillStyle = i === 0 ? '#ff0000' : '#ff8888'; // Tête rouge vif, corps plus clair
            ctx.arc(
                screenX + CELL_SIZE / 2,
                screenY + CELL_SIZE / 2,
                (CELL_SIZE / 2) - 2,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            // Contour pour le segment
            ctx.strokeStyle = '#cc0000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Dessiner la tête avec les yeux orientés
        const headX = this.segments[0].x - camera.cameraX;
        const headY = this.segments[0].y - camera.cameraY;
        
        // Dessiner les yeux en fonction de la direction
        ctx.fillStyle = '#ffffff';
        const eyeSize = CELL_SIZE / 10;
        
        switch (this.direction) {
            case 'right':
                // Yeux regardant à droite
                ctx.fillRect(
                    headX + CELL_SIZE * 3/4 - eyeSize,
                    headY + CELL_SIZE / 4,
                    eyeSize, eyeSize
                );
                ctx.fillRect(
                    headX + CELL_SIZE * 3/4 - eyeSize,
                    headY + CELL_SIZE * 3/4 - eyeSize,
                    eyeSize, eyeSize
                );
                break;
            case 'left':
                // Yeux regardant à gauche
                ctx.fillRect(
                    headX + CELL_SIZE / 4,
                    headY + CELL_SIZE / 4,
                    eyeSize, eyeSize
                );
                ctx.fillRect(
                    headX + CELL_SIZE / 4,
                    headY + CELL_SIZE * 3/4 - eyeSize,
                    eyeSize, eyeSize
                );
                break;
            case 'up':
                // Yeux regardant en haut
                ctx.fillRect(
                    headX + CELL_SIZE / 4,
                    headY + CELL_SIZE / 4,
                    eyeSize, eyeSize
                );
                ctx.fillRect(
                    headX + CELL_SIZE * 3/4 - eyeSize,
                    headY + CELL_SIZE / 4,
                    eyeSize, eyeSize
                );
                break;
            case 'down':
                // Yeux regardant en bas
                ctx.fillRect(
                    headX + CELL_SIZE / 4,
                    headY + CELL_SIZE * 3/4 - eyeSize,
                    eyeSize, eyeSize
                );
                ctx.fillRect(
                    headX + CELL_SIZE * 3/4 - eyeSize,
                    headY + CELL_SIZE * 3/4 - eyeSize,
                    eyeSize, eyeSize
                );
                break;
        }
        
        // Ajouter les pupilles noires
        ctx.fillStyle = '#000000';
        const pupilSize = eyeSize / 2;
        
        switch (this.direction) {
            case 'right':
                ctx.fillRect(
                    headX + CELL_SIZE * 3/4 - eyeSize/2,
                    headY + CELL_SIZE / 4 + eyeSize/4,
                    pupilSize, pupilSize
                );
                ctx.fillRect(
                    headX + CELL_SIZE * 3/4 - eyeSize/2,
                    headY + CELL_SIZE * 3/4 - eyeSize + eyeSize/4,
                    pupilSize, pupilSize
                );
                break;
            case 'left':
                ctx.fillRect(
                    headX + CELL_SIZE / 4 + eyeSize/4,
                    headY + CELL_SIZE / 4 + eyeSize/4,
                    pupilSize, pupilSize
                );
                ctx.fillRect(
                    headX + CELL_SIZE / 4 + eyeSize/4,
                    headY + CELL_SIZE * 3/4 - eyeSize + eyeSize/4,
                    pupilSize, pupilSize
                );
                break;
            case 'up':
                ctx.fillRect(
                    headX + CELL_SIZE / 4 + eyeSize/4,
                    headY + CELL_SIZE / 4 + eyeSize/4,
                    pupilSize, pupilSize
                );
                ctx.fillRect(
                    headX + CELL_SIZE * 3/4 - eyeSize + eyeSize/4,
                    headY + CELL_SIZE / 4 + eyeSize/4,
                    pupilSize, pupilSize
                );
                break;
            case 'down':
                ctx.fillRect(
                    headX + CELL_SIZE / 4 + eyeSize/4,
                    headY + CELL_SIZE * 3/4 - eyeSize + eyeSize/4,
                    pupilSize, pupilSize
                );
                ctx.fillRect(
                    headX + CELL_SIZE * 3/4 - eyeSize + eyeSize/4,
                    headY + CELL_SIZE * 3/4 - eyeSize + eyeSize/4,
                    pupilSize, pupilSize
                );
                break;
        }
        
        ctx.restore();
    }
}