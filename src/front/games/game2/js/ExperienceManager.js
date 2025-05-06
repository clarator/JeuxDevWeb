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
        
        // Améliorations débloquées
        this.obtainedUpgrades = {
            shield: false
        };
        
        // Zones cliquables pour le menu d'amélioration
        this.upgradeBoxes = [];
    }
    
    // Réinitialise le gestionnaire d'expérience
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
    
    // Redimensionne les éléments d'interface
    resize(scaleRatio) {
        this.scaleRatio = scaleRatio;
    }
    
    // Ajoute de l'expérience et gère le passage de niveau
    addExperience(amount) {
        this.experience += amount;
        this.totalExperience += amount;
        
        // Vérifie si le joueur a atteint le niveau suivant
        while (this.experience >= this.experienceForNextLevel) {
            this.levelUp();
        }
    }
    
    // Gère le passage au niveau supérieur
    levelUp() {
        this.experience -= this.experienceForNextLevel;
        this.level++;
        
        // Calcul de l'expérience nécessaire pour le niveau suivant (croissance exponentielle)
        this.experienceForNextLevel = Math.floor(100 * Math.pow(1.5, this.level - 1));
        
        // Génère les options d'amélioration et met en pause pour le choix
        this.levelUpPending = true;
        this.upgradeOptions = this.generateUpgradeOptions();
        this.game.pauseForLevelUp();
    }
    
    // Génère 3 options d'amélioration aléatoires pour le joueur
    generateUpgradeOptions() {
        // Liste de toutes les améliorations possibles
        const allUpgrades = [
            // Améliorations de santé/défense
            {
                id: 'heal',
                name: 'Soin',
                description: 'Restaure 3 points de vie',
                weight: 10, // Probabilité d'apparition
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
                available: () => !this.obtainedUpgrades.shield, // Disponible une seule fois
                apply: () => {
                    this.obtainedUpgrades.shield = true;
                    this.game.player.hasShield = true;
                    this.game.player.startShieldSystem();
                }
            },
            
            // Améliorations de tir
            {
                id: 'fire_rate',
                name: 'Tir Rapide',
                description: 'Réduit le temps de rechargement',
                weight: 8,
                apply: () => {
                    this.game.player.shootCooldownTime *= 0.8; // 20% plus rapide
                }
            },
            {
                id: 'powerful_shot',
                name: 'Tir Puissant',
                description: 'Augmente les dégâts',
                level: 1,
                maxLevel: 3, // Limite maximale
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
            
            // Améliorations de mobilité
            {
                id: 'speed_boost',
                name: 'Vitesse',
                description: 'Augmente la vitesse de déplacement',
                weight: 7,
                apply: () => {
                    this.game.player.speedValue *= 1.2; // 20% plus rapide
                }
            }
        ];
        
        // Filtrer les options disponibles (basé sur conditions et niveaux max)
        const availableUpgrades = allUpgrades.filter(upgrade => {
            if (upgrade.available && !upgrade.available()) return false;
            if (upgrade.level && this.getUpgradeLevel(upgrade.id) >= upgrade.maxLevel) return false;
            return true;
        });
        
        // Sélectionner 3 options avec un système de poids pour la diversité
        const options = this.selectUpgradesWithWeight(availableUpgrades, 3);
        
        // Mise à jour des niveaux actuels pour l'affichage
        options.forEach(option => {
            if (option.level) {
                option.currentLevel = this.getUpgradeLevel(option.id);
            }
        });
        
        return options;
    }
    
    // Sélectionne des améliorations avec un système de probabilité pondérée
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
                    available.splice(j, 1); // Retire l'amélioration sélectionnée
                    break;
                }
            }
        }
        
        return selected;
    }
    
    // Récupère le niveau actuel d'une amélioration
    getUpgradeLevel(upgradeId) {
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
    
    // Applique l'amélioration choisie
    chooseUpgrade(index) {
        if (this.upgradeOptions && this.upgradeOptions[index]) {
            this.upgradeOptions[index].apply();
            this.levelUpPending = false;
            this.upgradeOptions = null;
            this.upgradeBoxes = [];
            this.game.resumeGame();
        }
    }
    
    // Gère les clics sur le menu d'amélioration
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
    
    // Affiche la barre d'expérience et le menu de niveau supérieur
    render(ctx) {
        const scaleRatio = this.game.getScaleRatio();
        
        // Affichage de la barre d'expérience en bas
        ctx.save();
        const barWidth = 350 * scaleRatio;
        const barHeight = 25 * scaleRatio;
        const barX = (ctx.canvas.width - barWidth) / 2; // Centré horizontalement
        const barY = ctx.canvas.height - 50 * scaleRatio; // En bas
        
        // Fond semi-transparent
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Progression d'expérience
        const expProgress = this.experience / this.experienceForNextLevel;
        ctx.fillStyle = 'rgba(76, 175, 80, 0.6)'; // Vert semi-transparent
        ctx.fillRect(barX, barY, barWidth * expProgress, barHeight);
        
        // Bordure fine
        ctx.lineWidth = 1 * scaleRatio;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Texte niveau
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = `${Math.floor(18 * scaleRatio)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(`Niveau ${this.level}`, ctx.canvas.width / 2, barY - 8 * scaleRatio);
        
        // Texte expérience
        ctx.font = `${Math.floor(16 * scaleRatio)}px Arial`;
        ctx.fillText(`${this.experience}/${this.experienceForNextLevel}`, barX + barWidth / 2, barY + 17 * scaleRatio);
        ctx.restore();
        
        // Affichage du menu d'amélioration si niveau supérieur
        if (this.levelUpPending && this.upgradeOptions) {
            this.renderUpgradeMenu(ctx);
        }
    }
    
    // Affiche le menu d'amélioration avec les 3 options
    renderUpgradeMenu(ctx) {
        const scaleRatio = this.game.getScaleRatio();
        
        ctx.save();
        // Fond semi-transparent pour la pause
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Titre du menu
        ctx.fillStyle = '#4CAF50';
        ctx.font = `${Math.floor(40 * scaleRatio)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('NIVEAU SUPÉRIEUR !', ctx.canvas.width / 2, ctx.canvas.height / 5);
        
        // Configuration des options d'amélioration
        const optionWidth = 230 * scaleRatio;
        const optionHeight = 150 * scaleRatio;
        const optionSpacing = 50 * scaleRatio;
        const totalWidth = optionWidth * this.upgradeOptions.length + optionSpacing * (this.upgradeOptions.length - 1);
        const startX = (ctx.canvas.width - totalWidth) / 2;
        const startY = ctx.canvas.height / 2 - optionHeight / 2;
        
        this.upgradeBoxes = []; // Réinitialiser les zones cliquables
        
        // Dessiner chaque option d'amélioration
        this.upgradeOptions.forEach((option, index) => {
            const x = startX + index * (optionWidth + optionSpacing);
            const y = startY;
            
            // Enregistrer la zone cliquable
            this.upgradeBoxes.push({
                x: x,
                y: y,
                width: optionWidth,
                height: optionHeight
            });
            
            // Vérifier si la souris survole
            const isHovered = this.game.mouseX >= x && this.game.mouseX <= x + optionWidth &&
                             this.game.mouseY >= y && this.game.mouseY <= y + optionHeight;
            
            // Fond de l'option
            ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(x, y, optionWidth, optionHeight);
            
            // Bordure (jaune si survolée)
            ctx.strokeStyle = isHovered ? 'yellow' : 'white';
            ctx.lineWidth = 2 * scaleRatio;
            ctx.strokeRect(x, y, optionWidth, optionHeight);
            
            // Nom de l'amélioration
            ctx.font = `${Math.floor(22 * scaleRatio)}px Arial`;
            ctx.fillStyle = 'white';
            ctx.fillText(option.name, x + optionWidth / 2, y + 35 * scaleRatio);
            
            // Affichage du niveau pour les améliorations progressives
            if (option.level) {
                ctx.font = `${Math.floor(18 * scaleRatio)}px Arial`;
                const levelText = `Niveau ${option.currentLevel + 1}/${option.maxLevel}`;
                ctx.fillText(levelText, x + optionWidth / 2, y + 65 * scaleRatio);
            }
            
            // Description de l'amélioration (avec gestion multi-lignes si nécessaire)
            ctx.font = `${Math.floor(16 * scaleRatio)}px Arial`;
            const desc = option.description;
            const maxWidth = optionWidth - 20 * scaleRatio;
            
            // Si la description est trop longue, la couper en deux lignes
            if (ctx.measureText(desc).width > maxWidth) {
                const words = desc.split(' ');
                let line1 = '';
                let line2 = '';
                let i = 0;
                
                // Construction de la première ligne
                while (i < words.length && ctx.measureText(line1 + ' ' + words[i]).width <= maxWidth) {
                    line1 += (line1 ? ' ' : '') + words[i];
                    i++;
                }
                
                // Construction de la deuxième ligne
                while (i < words.length) {
                    line2 += (line2 ? ' ' : '') + words[i];
                    i++;
                }
                
                ctx.fillText(line1, x + optionWidth / 2, y + optionHeight - 45 * scaleRatio);
                ctx.fillText(line2, x + optionWidth / 2, y + optionHeight - 25 * scaleRatio);
            } else {
                // Si la description tient sur une ligne
                ctx.fillText(desc, x + optionWidth / 2, y + optionHeight - 35 * scaleRatio);
            }
            
            // Instruction pour la sélection
            ctx.font = `${Math.floor(16 * scaleRatio)}px Arial`;
            ctx.fillText('Cliquez pour sélectionner', x + optionWidth / 2, y + optionHeight + 25 * scaleRatio);
        });
        ctx.restore();
    }
}