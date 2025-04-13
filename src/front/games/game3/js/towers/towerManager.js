// Gestionnaire des tours
import { BasicTower } from './basicTower.js';

export class TowerManager {
    constructor(game) {
        this.game = game;
        this.towers = [];
        this.towerTypes = {
            'basic': BasicTower
        };
    }
    
    update(deltaTime) {
        // Mettre à jour toutes les tours
        for (const tower of this.towers) {
            tower.update(deltaTime);
        }
    }
    
    draw() {
        // Dessiner toutes les tours
        for (const tower of this.towers) {
            tower.draw();
        }
    }
    
    // Créer une tour au point spécifié
    addTower(type, gridX, gridY) {
        const TowerClass = this.towerTypes[type];
        
        if (!TowerClass) {
            console.error(`Type de tour inconnu: ${type}`);
            return null;
        }
        
        // Convertir les coordonnées de la grille en coordonnées du monde
        const { x, y } = this.game.map.gridToWorld(gridX, gridY);
        
        // Marquer la case comme occupée par une tour
        this.game.map.placeTower(gridX, gridY);
        
        // Créer la nouvelle tour
        const tower = new TowerClass(this.game, x, y, gridX, gridY);
        this.towers.push(tower);
        
        return tower;
    }
    
    // Créer une prévisualisation de tour pour le placement
    createTowerPreview(towerInfo) {
        const TowerClass = this.towerTypes[towerInfo.type];
        
        if (!TowerClass) {
            console.error(`Type de tour inconnu: ${towerInfo.type}`);
            return null;
        }
        
        // Créer une instance de prévisualisation
        const preview = new TowerClass(this.game, 0, 0, -1, -1, true);
        preview.type = towerInfo.type;
        preview.cost = towerInfo.cost;
        
        return preview;
    }
    
    // Supprimer une tour
    removeTower(tower) {
        const index = this.towers.indexOf(tower);
        if (index !== -1) {
            // Marquer la case comme libre
            this.game.map.removeTower(tower.gridX, tower.gridY);
            
            // Retirer la tour de la liste
            this.towers.splice(index, 1);
            return true;
        }
        return false;
    }
    
    // Récupérer une tour aux coordonnées spécifiées
    getTowerAt(gridX, gridY) {
        return this.towers.find(tower => tower.gridX === gridX && tower.gridY === gridY);
    }
    
    // Vérifier si une position est dans la portée d'une tour
    isInTowerRange(x, y, tower) {
        const dx = tower.x - x;
        const dy = tower.y - y;
        return (dx * dx + dy * dy) <= (tower.range * tower.range);
    }
    
    // Récupérer toutes les tours qui peuvent atteindre une position
    getTowersInRange(x, y) {
        return this.towers.filter(tower => this.isInTowerRange(x, y, tower));
    }
    
    // Réinitialiser le gestionnaire de tours
    reset() {
        this.towers = [];
    }
    
    // Méthode pour ajouter un nouveau type de tour (utile pour les extensions futures)
    registerTowerType(typeName, TowerClass) {
        this.towerTypes[typeName] = TowerClass;
    }
}