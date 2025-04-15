// Gestionnaire des ennemis
import { BasicEnemy } from './basicEnemy.js';

export class EnemyManager {
    constructor(game) {
        this.game = game;
        this.enemies = [];
        
        // Types d'ennemis disponibles
        this.enemyTypes = {
            'basic': BasicEnemy
        };
    }
    
    update(deltaTime) {
        // Mise à jour de tous les ennemis
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Vérifier si l'ennemi est mort ou a atteint la fin
            if (enemy.health <= 0) {
                // Ennemi tué
                this.game.enemyKilled(enemy);
                continue; // L'ennemi a déjà été retiré par enemyKilled
            }
            
            if (enemy.reachedEnd) {
                // Ennemi arrivé à la fin du chemin
                this.game.enemyReachedEnd(enemy);
                continue; // L'ennemi a déjà été retiré par enemyReachedEnd
            }
            
            // Mise à jour normale
            enemy.update(deltaTime);
        }
    }
    
    draw() {
        // Dessiner tous les ennemis
        for (const enemy of this.enemies) {
            enemy.draw();
        }
    }
    
    // Ajouter un nouvel ennemi
    spawnEnemy(type, health, speed, reward) {
        const EnemyClass = this.enemyTypes[type];
        
        if (!EnemyClass) {
            console.error(`Type d'ennemi inconnu: ${type}`);
            return null;
        }
        
        // Obtenir le point de départ du chemin
        const startPoint = this.game.map.getStartPoint();
        
        // Créer l'ennemi
        const enemy = new EnemyClass(
            this.game,
            startPoint.x,
            startPoint.y,
            health,
            speed,
            reward
        );
        
        this.enemies.push(enemy);
        return enemy;
    }
    
    // Retirer un ennemi du jeu
    removeEnemy(enemy) {
        const index = this.enemies.indexOf(enemy);
        if (index !== -1) {
            this.enemies.splice(index, 1);
            return true;
        }
        return false;
    }
    
    // Vider la liste d'ennemis
    reset() {
        this.enemies = [];
    }
    
    // Méthode pour ajouter un nouveau type d'ennemi (utile pour les extensions futures)
    registerEnemyType(typeName, EnemyClass) {
        this.enemyTypes[typeName] = EnemyClass;
    }
    
    // Compter le nombre d'ennemis actifs
    getEnemyCount() {
        return this.enemies.length;
    }
    
    // Appliquer des dégâts de zone à tous les ennemis dans un rayon
    applyAreaDamage(x, y, radius, damage) {
        let hitCount = 0;
        
        for (const enemy of this.enemies) {
            const dx = enemy.x - x;
            const dy = enemy.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= radius) {
                enemy.takeDamage(damage);
                hitCount++;
            }
        }
        
        return hitCount;
    }
    
    // Ralentir tous les ennemis dans un rayon
    applySlowEffect(x, y, radius, slowFactor, duration) {
        let affectedCount = 0;
        
        for (const enemy of this.enemies) {
            const dx = enemy.x - x;
            const dy = enemy.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= radius) {
                enemy.applySlow(slowFactor, duration);
                affectedCount++;
            }
        }
        
        return affectedCount;
    }
}