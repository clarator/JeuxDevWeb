// Classe pour gérer les informations du joueur
export class Player {
    constructor() {
        this.lives = 10;
        this.gold = 100;
        this.score = 0;
    }
    
    takeDamage(amount = 1) {
        this.lives -= amount;
        return this.lives <= 0; // Retourne true si le joueur a perdu
    }
    
    addGold(amount) {
        this.gold += amount;
    }
    
    spendGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true;
        }
        return false;
    }
    
    canAfford(cost) {
        return this.gold >= cost;
    }
    
    addScore(points) {
        this.score += points;
    }
    
    getScore() {
        return this.score;
    }
    
    reset() {
        this.lives = 10;
        this.gold = 100;
        this.score = 0;
    }
}