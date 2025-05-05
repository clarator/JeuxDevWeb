// src/front/games/game2/js/ExperienceManager.js
export default class ExperienceManager {
    constructor(game) {
        this.game = game;
        this.level = 1;
        this.experience = 0;
        this.experienceForNextLevel = 100;
        this.totalExperience = 0;
        this.levelUpPending = false;
        this.upgradeOptions = null;
        this.scaleRatio = this.game.getScaleRatio();
        
        // Upgrades obtenues
        this.obtainedUpgrades = {
            shield: false
        };
        
        // Pour la détection de clic
        this.upgradeBoxes = [];
    }
    
    reset() {
        this.level = 1;
        this.experience = 0;
        this.experienceForNextLevel = 100;
        this.totalExperience = 0;
        this.levelUpPending = false;
        this.upgradeOptions = null;
        this.obtainedUpgrades = {
            shield: false
        };
        this.upgradeBoxes = [];
    }
    
    resize(scaleRatio) {
        this.scaleRatio = scaleRatio;
    }
    
    addExperience(amount) {
        this.experience += amount;
        this.totalExperience += amount;
        
        while (this.experience >= this.experienceForNextLevel) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.experience -= this.experienceForNextLevel;
        this.level++;
        
        // Calcul de l'expérience nécessaire pour le niveau suivant
        this.experienceForNextLevel = Math.floor(100 * Math.pow(1.5, this.level - 1));
        
        // Générer les options d'amélioration
        this.levelUpPending = true;
        this.upgradeOptions = this.generateUpgradeOptions();
        
        // Mettre le jeu en pause pour le choix
        this.game.pauseForLevelUp();
    }
    
    generateUpgradeOptions() {
        const allUpgrades = [
            // Upgrades de santé/défense
            {
                id: 'heal',
                name: 'Soin',
                description: 'Restaure 3 points de vie',
                weight: 10,
                apply: () => {
                    const healAmount = Math.min(3, this.game.player.maxHealth - this.game.player.health);
                    this.game.player.health += healAmount;
                }
            },
            {
                id: 'max_health',
                name: 'Vie Maximum',
                description: 'Augmente la vie maximale de 1',
                weight: 7,
                apply: () => {
                    this.game.player.maxHealth++;
                    this.game.player.health++;
                }
            },
            {
                id: 'shield',
                name: 'Bouclier',
                description: 'Active les boucliers protecteurs',
                weight: 5,
                available: () => !this.obtainedUpgrades.shield,
                apply: () => {
                    this.obtainedUpgrades.shield = true;
                    this.game.player.hasShield = true;
                    this.game.player.startShieldSystem();
                }
            },
            
            // Upgrades de tir
            {
                id: 'fire_rate',
                name: 'Tir Rapide',
                description: 'Réduit le temps de rechargement',
                weight: 8,
                apply: () => {
                    this.game.player.shootCooldownTime *= 0.8;
                }
            },
            {
                id: 'powerful_shot',
                name: 'Tir Puissant',
                description: 'Augmente les dégâts',
                level: 1,
                maxLevel: 3,
                weight: 8,
                apply: () => {
                    this.game.player.projectileDamage = (this.game.player.projectileDamage || 1) + 1;
                }
            },
            {
                id: 'multi_shot',
                name: 'Tir Multiple',
                description: 'Tire des projectiles supplémentaires',
                level: 1,
                maxLevel: 3,
                weight: 8,
                apply: () => {
                    this.game.player.multiShot = (this.game.player.multiShot || 1) + 1;
                }
            },
            {
                id: 'piercing_shot',
                name: 'Pénétration',
                description: 'Projectiles peuvent traverser',
                level: 1,
                maxLevel: 5,
                weight: 8,
                apply: () => {
                    this.game.player.piercingLevel = (this.game.player.piercingLevel || 0) + 1;
                }
            },
            
            // Upgrades de mobilité
            {
                id: 'speed_boost',
                name: 'Vitesse',
                description: 'Augmente la vitesse de déplacement',
                weight: 7,
                apply: () => {
                    this.game.player.speedValue *= 1.2;
                }
            }
        ];
        
        // Filtrer les options disponibles
        const availableUpgrades = allUpgrades.filter(upgrade => {
            if (upgrade.available && !upgrade.available()) return false;
            if (upgrade.level && this.getUpgradeLevel(upgrade.id) >= upgrade.maxLevel) return false;
            return true;
        });
        
        // Sélectionner 3 options avec des poids
        const options = this.selectUpgradesWithWeight(availableUpgrades, 3);
        
        // Mettre à jour les niveaux actuels pour l'affichage
        options.forEach(option => {
            if (option.level) {
                option.currentLevel = this.getUpgradeLevel(option.id);
            }
        });
        
        return options;
    }
    
    selectUpgradesWithWeight(upgrades, count) {
        const selected = [];
        const available = [...upgrades];
        
        for (let i = 0; i < count && available.length > 0; i++) {
            const totalWeight = available.reduce((sum, up) => sum + up.weight, 0);
            let random = Math.random() * totalWeight;
            
            for (let j = 0; j < available.length; j++) {
                random -= available[j].weight;
                if (random <= 0) {
                    selected.push(available[j]);
                    available.splice(j, 1);
                    break;
                }
            }
        }
        
        return selected;
    }
    
    getUpgradeLevel(upgradeId) {
        // Retour des niveaux actuels des upgrades
        switch(upgradeId) {
            case 'powerful_shot':
                return (this.game.player.projectileDamage || 1) - 1;
            case 'multi_shot':
                return (this.game.player.multiShot || 1) - 1;
            case 'piercing_shot':
                return this.game.player.piercingLevel || 0;
            default:
                return 0;
        }
    }
    
    chooseUpgrade(index) {
        if (this.upgradeOptions && this.upgradeOptions[index]) {
            this.upgradeOptions[index].apply();
            this.levelUpPending = false;
            this.upgradeOptions = null;
            this.upgradeBoxes = [];
            this.game.resumeGame();
        }
    }
    
    // Nouvelle méthode pour gérer les clics
    handleClick(mouseX, mouseY) {
        if (!this.levelUpPending) return;
        
        for (let i = 0; i < this.upgradeBoxes.length; i++) {
            const box = this.upgradeBoxes[i];
            if (mouseX >= box.x && mouseX <= box.x + box.width &&
                mouseY >= box.y && mouseY <= box.y + box.height) {
                this.chooseUpgrade(i);
                break;
            }
        }
    }
    
    render(ctx) {
        const scaleRatio = this.game.getScaleRatio();
        
        // Afficher la barre d'expérience
        ctx.save();
        const barWidth = 200 * scaleRatio;
        const barHeight = 20 * scaleRatio;
        const barX = 10 * scaleRatio;
        const barY = ctx.canvas.height - 40 * scaleRatio;
        
        // Fond de la barre
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Barre d'expérience
        const expProgress = this.experience / this.experienceForNextLevel;
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(barX, barY, barWidth * expProgress, barHeight);
        
        // Bordure
        ctx.strokeStyle = 'white';
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Texte niveau
        ctx.fillStyle = 'white';
        ctx.font = `${Math.floor(16 * scaleRatio)}px Arial`;
        ctx.fillText(`Niveau ${this.level}`, barX, barY - 5 * scaleRatio);
        
        // Texte expérience
        ctx.font = `${Math.floor(12 * scaleRatio)}px Arial`;
        ctx.fillText(`${this.experience}/${this.experienceForNextLevel}`, barX + 5 * scaleRatio, barY + 15 * scaleRatio);
        ctx.restore();
        
        // Afficher le menu de niveau si une amélioration est en attente
        if (this.levelUpPending && this.upgradeOptions) {
            this.renderUpgradeMenu(ctx);
        }
    }
    
    renderUpgradeMenu(ctx) {
        const scaleRatio = this.game.getScaleRatio();
        
        ctx.save();
        // Fond semi-transparent
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Titre
        ctx.fillStyle = 'white';
        ctx.font = `${Math.floor(40 * scaleRatio)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('NIVEAU SUPÉRIEUR !', ctx.canvas.width / 2, ctx.canvas.height / 5);
        
        // Options d'amélioration
        const optionWidth = 200 * scaleRatio;
        const optionHeight = 120 * scaleRatio;
        const optionSpacing = 50 * scaleRatio;
        const totalWidth = optionWidth * 3 + optionSpacing * 2;
        const startX = (ctx.canvas.width - totalWidth) / 2;
        const startY = ctx.canvas.height / 2 - optionHeight / 2;
        
        this.upgradeBoxes = []; // Réinitialiser les zones cliquables
        
        this.upgradeOptions.forEach((option, index) => {
            const x = startX + index * (optionWidth + optionSpacing);
            const y = startY;
            
            // Sauvegarder la zone cliquable
            this.upgradeBoxes.push({
                x: x,
                y: y,
                width: optionWidth,
                height: optionHeight
            });
            
            // Changer la couleur si la souris survole
            const isHovered = this.game.mouseX >= x && this.game.mouseX <= x + optionWidth &&
                             this.game.mouseY >= y && this.game.mouseY <= y + optionHeight;
            
            // Fond de l'option
            ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(x, y, optionWidth, optionHeight);
            
            // Bordure
            ctx.strokeStyle = isHovered ? 'yellow' : 'white';
            ctx.lineWidth = 2 * scaleRatio;
            ctx.strokeRect(x, y, optionWidth, optionHeight);
            
            // Nom
            ctx.font = `${Math.floor(18 * scaleRatio)}px Arial`;
            ctx.fillStyle = 'white';
            ctx.fillText(option.name, x + optionWidth / 2, y + 30 * scaleRatio);
            
            // Niveau pour les améliorations à niveaux
            if (option.level) {
                ctx.font = `${Math.floor(14 * scaleRatio)}px Arial`;
                const levelText = `Niveau ${option.currentLevel + 1}/${option.maxLevel}`;
                ctx.fillText(levelText, x + optionWidth / 2, y + 50 * scaleRatio);
            }
            
            // Description
            ctx.font = `${Math.floor(12 * scaleRatio)}px Arial`;
            ctx.fillText(option.description, x + optionWidth / 2, y + optionHeight - 20 * scaleRatio);
            
            // Instruction (cliquez)
            ctx.font = `${Math.floor(16 * scaleRatio)}px Arial`;
            ctx.fillText('Cliquez pour sélectionner', x + optionWidth / 2, y + optionHeight + 30 * scaleRatio);
        });
        ctx.restore();
    }
}