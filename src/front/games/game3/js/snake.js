import { CELL_SIZE } from "./Game.js";

export default class Snake {
    constructor() {
        this.color = '#ff0000';
        
        // Délai d'activation du serpent pour laisser au joueur un peu d'avance
        this.activationTimer = 0;
        this.activationDelay = 1000; // Délai en millisecondes
        this.isActive = false;
        this.playerHasMoved = false;
        
        // Position et mouvement du serpent
        this.canvasX = 0;
        this.canvasY = 0;
        this.isMoving = false;
        this.speedX = 0;
        this.speedY = 0;
        this.speedValue = 150; // Vitesse en pixels par seconde
        
        // Variables pour le pathfinding
        this.path = [];
        this.targetNode = null;
        
        // Segments du corps du serpent
        this.segments = [];
        this.segmentCount = 5; // Nombre de segments formant le corps
        this.direction = 'right'; // Direction actuelle du serpent
        this.followSpeed = 10.0; // Vitesse à laquelle les segments suivent la tête
    }
    
    // Initialise le serpent au début d'un niveau
    startLevel(x, y) {
        // Position initiale identique à celle du joueur
        this.canvasX = x * CELL_SIZE;
        this.canvasY = y * CELL_SIZE;
        
        // Réinitialisation des variables d'activation
        this.activationTimer = 0;
        this.isActive = false;
        this.playerHasMoved = false;
        this.isMoving = false;
        this.speedX = 0;
        this.speedY = 0;
        this.path = [];
        this.targetNode = null;
        
        // Réinitialisation des segments du corps
        this.segments = [];
        for (let i = 0; i < this.segmentCount; i++) {
            this.segments.push({
                x: this.canvasX,
                y: this.canvasY
            });
        }
        this.direction = 'right';
    }

    // Met à jour l'état du serpent à chaque frame
    update(deltaTime, player, map) {
        // Active le timer quand le joueur commence à bouger
        if (!this.playerHasMoved && player.isMoving) {
            this.playerHasMoved = true;
        }
    
        // Compteur d'activation après le premier mouvement du joueur
        if (this.playerHasMoved && !this.isActive) {
            this.activationTimer += deltaTime * 1000; // Conversion en millisecondes
            if (this.activationTimer >= this.activationDelay) {
                this.isActive = true;
            }
            return;
        }
        if (!this.isActive) return;
    
        // Convertit les positions en coordonnées de la grille
        const snakeGridX = Math.floor(this.canvasX / CELL_SIZE);
        const snakeGridY = Math.floor(this.canvasY / CELL_SIZE);
        const playerGridX = Math.floor(player.canvasX / CELL_SIZE);
        const playerGridY = Math.floor(player.canvasY / CELL_SIZE);
        
        // Calcule un nouveau chemin vers le joueur si le serpent n'est pas déjà en déplacement
        if (!this.isMoving) {
            this.findPath(snakeGridX, snakeGridY, playerGridX, playerGridY, map.grid);
        }
    
        // Déplace le serpent vers sa prochaine cible
        this.moveToTargetNode();
    
        // Met à jour la position de la tête du serpent
        this.canvasX += this.speedX * deltaTime;
        this.canvasY += this.speedY * deltaTime;
        
        // Met à jour les segments du corps
        this.updateSegments(deltaTime);
        
        // Met à jour la direction visuelle du serpent
        this.updateDirection();
    
        // Vérifie si le serpent a atteint son prochain point de déplacement
        this.checkTargetNodeCollision();
    }

    // Met à jour la position des segments du corps pour qu'ils suivent la tête
    updateSegments(deltaTime) {
        // Facteur de suivi adapté au deltaTime pour des mouvements fluides
        const followFactor = 1.0 - Math.pow(0.5, deltaTime * this.followSpeed);
        
        // Déplace chaque segment vers la position du segment précédent
        for (let i = this.segments.length - 1; i > 0; i--) {
            this.segments[i].x += (this.segments[i-1].x - this.segments[i].x) * followFactor;
            this.segments[i].y += (this.segments[i-1].y - this.segments[i].y) * followFactor;
        }
        
        // La tête du serpent suit directement la position actuelle
        this.segments[0].x = this.canvasX;
        this.segments[0].y = this.canvasY;
    }

    // Met à jour la direction visuelle en fonction de la vitesse
    updateDirection() {
        if (this.speedX > 0) this.direction = 'right';
        else if (this.speedX < 0) this.direction = 'left';
        else if (this.speedY > 0) this.direction = 'down';
        else if (this.speedY < 0) this.direction = 'up';
    }

    // Configure le déplacement vers le prochain nœud du chemin
    moveToTargetNode() {
        if (this.isMoving) return;
        if (this.path.length === 0) {
            this.stopMoving();
            return;
        }
        if (this.targetNode === null) {
            this.targetNode = this.path[0];
        }
        
        // Détermine la vitesse en fonction de la direction vers le nœud cible
        this.speedX = (this.targetNode.x - Math.floor(this.canvasX / CELL_SIZE)) * this.speedValue;        
        this.speedY = (this.targetNode.y - Math.floor(this.canvasY / CELL_SIZE)) * this.speedValue;
        this.isMoving = true;
    }

    // Vérifie si le serpent a atteint son nœud cible
    checkTargetNodeCollision() {
        if (this.targetNode === null) return;

        var targetReached = false;

        // Vérifie si la position actuelle correspond exactement à la cible
        if (this.targetNode.x * CELL_SIZE === this.canvasX &&
            this.targetNode.y * CELL_SIZE === this.canvasY) {
            targetReached = true;
        }
        
        // Vérifie si le serpent a dépassé la cible (selon sa direction)
        if (!targetReached && (
            this.speedX>0 && this.canvasX >= this.targetNode.x * CELL_SIZE ||
            this.speedX<0 && this.canvasX <= this.targetNode.x * CELL_SIZE ||
            this.speedY>0 && this.canvasY >= this.targetNode.y * CELL_SIZE ||
            this.speedY<0 && this.canvasY <= this.targetNode.y * CELL_SIZE
        )) {
            targetReached = true;
            // Ajuste la position exactement sur la cible pour éviter les décalages
            this.canvasX = this.targetNode.x * CELL_SIZE;
            this.canvasY = this.targetNode.y * CELL_SIZE;
        }

        // Si la cible est atteinte, passe au nœud suivant
        if (targetReached) {
            this.path.shift();
            this.targetNode = null;
            this.stopMoving();
        }
    }

    // Arrête le mouvement du serpent
    stopMoving() {
        this.speedX = 0;
        this.speedY = 0;
        this.isMoving = false;
    }

    // Algorithme de recherche de chemin A* pour trouver le chemin vers le joueur
    findPath(startX, startY, targetX, targetY, grid) {
        // Ignore si déjà à la cible
        if (startX === targetX && startY === targetY) {
            this.path = [];
            return;
        }

        // Initialisation des listes pour l'algorithme A*
        const openList = [];
        const closedList = [];
        const startNode = {
            x: startX,
            y: startY,
            g: 0, // Coût depuis le départ
            h: this.heuristic(startX, startY, targetX, targetY), // Estimation vers la cible
            f: 0, // Score total (g + h)
            parent: null
        };
        startNode.f = startNode.g + startNode.h;
        
        openList.push(startNode);
        
        // Boucle principale de l'algorithme A*
        while (openList.length > 0) {
            // Trouve le nœud avec le meilleur score f dans la liste ouverte
            let currentIndex = 0;
            for (let i = 0; i < openList.length; i++) {
                if (openList[i].f < openList[currentIndex].f) {
                    currentIndex = i;
                }
            }
            
            const currentNode = openList[currentIndex];
            
            // Retire le nœud actuel de la liste ouverte et l'ajoute à la liste fermée
            openList.splice(currentIndex, 1);
            closedList.push(currentNode);
            
            // Si on a atteint la cible, reconstruit le chemin en remontant les parents
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
            
            // Analyse les 4 directions possibles (haut, droite, bas, gauche)
            const directions = [
                { x: 0, y: -1 }, // Haut
                { x: 1, y: 0 },  // Droite
                { x: 0, y: 1 },  // Bas
                { x: -1, y: 0 }  // Gauche
            ];
            
            for (const dir of directions) {
                const neighborX = currentNode.x + dir.x;
                const neighborY = currentNode.y + dir.y;
                
                // Ignore les cellules hors limites de la grille
                if (neighborY < 0 || neighborY >= grid.length || 
                    neighborX < 0 || neighborX >= grid[0].length) {
                    continue;
                }
                
                // Ignore les murs et les nœuds déjà visités
                if (grid[neighborY][neighborX] === 0 || 
                    closedList.some(node => node.x === neighborX && node.y === neighborY)) {
                    continue;
                }
                
                // Calcule les scores pour ce voisin
                const gCost = currentNode.g + 1;
                const hCost = this.heuristic(neighborX, neighborY, targetX, targetY);
                const fCost = gCost + hCost;
                
                // Vérifie si ce nœud est déjà dans la liste ouverte avec un meilleur chemin
                const existingNode = openList.find(node => node.x === neighborX && node.y === neighborY);
                if (existingNode && gCost >= existingNode.g) {
                    continue;
                }
                
                // Ajoute ce nœud à la liste ouverte
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
        
        // Si aucun chemin n'a été trouvé, renvoie un tableau vide
        this.path = [];
    }
    
    // Calcule l'heuristique (distance de Manhattan) entre deux points
    heuristic(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    // Vérifie si le serpent est en collision avec le joueur
    checkCollision(playerX, playerY) {
        if (!this.isActive) return false;
        
        // Conversion des positions en coordonnées de la grille
        const playerGridX = Math.floor(playerX / CELL_SIZE);
        const playerGridY = Math.floor(playerY / CELL_SIZE);
        const snakeGridX = Math.floor(this.canvasX / CELL_SIZE);
        const snakeGridY = Math.floor(this.canvasY / CELL_SIZE);
        
        // Vérifie si le joueur et le serpent sont sur la même case
        return (playerGridX === snakeGridX && playerGridY === snakeGridY);
    }

    // Dessine le serpent à l'écran
    render(ctx, camera) {
        if (!this.isActive) return;
        ctx.save();
        
        // Dessine les segments du corps du serpent (du dernier au premier)
        for (let i = this.segments.length - 1; i >= 0; i--) {
            const segment = this.segments[i];
            const screenX = segment.x - camera.cameraX;
            const screenY = segment.y - camera.cameraY;
            
            // Dessine un segment circulaire
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
            
            // Ajoute un contour pour chaque segment
            ctx.strokeStyle = '#cc0000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Dessine les yeux sur la tête du serpent
        const headX = this.segments[0].x - camera.cameraX;
        const headY = this.segments[0].y - camera.cameraY;
        
        // Ajuste la position des yeux selon la direction
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
        
        // Ajoute les pupilles des yeux
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