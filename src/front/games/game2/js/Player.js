// src/front/games/game2/js/Player.js
export default class Player {
    constructor(scaleRatio) {
        this.canvasX = 0;
        this.canvasY = 0;
        this.width = 50 * scaleRatio;
        this.height = 50 * scaleRatio;
        this.speedX = 0;
        this.speedY = 0;
        this.speedValue = 300 * scaleRatio;
        this.color = '#ff5555';
        this.shootCooldown = 0;
        this.shootCooldownTime = 0.2;
        this.health = 6;
        this.maxHealth = 6;
        this.invulnerable = false;
        this.invulnerableTime = 0;
        this.scaleRatio = scaleRatio;
        
        // Valeurs de base pour le reset
        this.baseSpeedValue = 300 * scaleRatio;
        this.baseShootCooldownTime = 0.2;
        
        // Améliorations
        this.projectileDamage = 1;
        this.multiShot = 1;
        this.piercingLevel = 0;
    
        // Système de bouclier
        this.hasShield = false;
        this.shieldActive = false;
        this.shieldActiveTime = 0; // Durée actuelle du shield
        this.shieldDuration = 1.0; // Durée totale du shield
        this.shieldTimer = 0; // Timer entre les shields
        this.shieldMinCooldown = 4.0;
        this.shieldMaxCooldown = 6.0;
        
        // État d'invulnérabilité due aux dégâts
        this.damagedInvulnerable = false;
        this.damagedInvulnerableTime = 0;
        
        // Pour la rotation
        this.angle = 0; // Angle en radians
        
        // Image du joueur
        this.image = new Image();
        this.image.src = '/assets/img/game2/player.png'; 
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
    }

    reset() {
        // Réinitialiser toutes les améliorations
        this.speedValue = this.baseSpeedValue;
        this.shootCooldownTime = this.baseShootCooldownTime;
        this.projectileDamage = 1;
        this.multiShot = 1;
        this.piercingLevel = 0;
        
        // Réinitialiser le bouclier
        this.hasShield = false;
        this.shieldActive = false;
        this.shieldActiveTime = 0;
        this.shieldTimer = 0;
        
        // Réinitialiser la santé
        this.health = 6;
        this.maxHealth = 6;
        this.invulnerable = false;
        this.invulnerableTime = 0;
        this.damagedInvulnerable = false;
        this.damagedInvulnerableTime = 0;
        
        // Réinitialiser le position et mouvement
        this.speedX = 0;
        this.speedY = 0;
        this.shootCooldown = 0;
        this.angle = 0;
    }
    
    resize(scaleRatio) {
        this.width = 50 * scaleRatio;
        this.height = 50 * scaleRatio;
        // Garder le ratio de vitesse
        const speedRatio = this.speedValue / this.scaleRatio;
        this.speedValue = speedRatio * scaleRatio;
        this.baseSpeedValue = 300 * scaleRatio;
        this.scaleRatio = scaleRatio;
    }
    
    update(deltaTime, mouseX, mouseY) {
        this.canvasX += this.speedX * deltaTime;
        this.canvasY += this.speedY * deltaTime;
        
        if (this.shootCooldown > 0) {
            this.shootCooldown -= deltaTime;
        }
        
        // Calculer l'angle basé sur la position de la souris
        if (mouseX !== undefined && mouseY !== undefined) {
            const center = this.getCenter();
            this.angle = Math.atan2(mouseY - center.y, mouseX - center.x);
        }
        
        // Gestion de l'invulnérabilité due aux dégâts
        if (this.damagedInvulnerable) {
            this.damagedInvulnerableTime -= deltaTime;
            if (this.damagedInvulnerableTime <= 0) {
                this.damagedInvulnerable = false;
                // Si le shield n'est pas actif non plus, on est plus invulnérable
                if (!this.shieldActive) {
                    this.invulnerable = false;
                }
            }
        }
        
        // Gestion du bouclier
        if (this.hasShield) {
            if (this.shieldActive) {
                // Le shield est actif, on compte le temps
                this.shieldActiveTime += deltaTime;
                
                // Le shield dure 1 seconde
                if (this.shieldActiveTime >= this.shieldDuration) {
                    this.shieldActive = false;
                    this.shieldActiveTime = 0;
                    
                    // Désactive le bouclier et programme le prochain
                    this.shieldTimer = this.shieldMinCooldown + 
                        Math.random() * (this.shieldMaxCooldown - this.shieldMinCooldown);
                    
                    // Si on n'est pas invulnérable à cause des dégâts, on redevient vulnérable
                    if (!this.damagedInvulnerable) {
                        this.invulnerable = false;
                    }
                }
            } else {
                // Le shield n'est pas actif, on attend le prochain
                this.shieldTimer -= deltaTime;
                if (this.shieldTimer <= 0) {
                    this.shieldActive = true;
                    this.shieldActiveTime = 0;
                    this.invulnerable = true;
                }
            }
        }
    }
    
    startShieldSystem() {
        // Initialise le système de bouclier
        this.shieldTimer = this.shieldMinCooldown;
        this.shieldActive = false;
    }
    
    takeDamage() {
        if (!this.invulnerable) {
            this.health--;
            this.invulnerable = true;
            this.damagedInvulnerable = true;
            this.invulnerableTime = 1.0;
            this.damagedInvulnerableTime = 1.0;
            return this.health <= 0;
        }
        return false;
    }
    
    getCenter() {
        return {
            x: this.canvasX + this.width / 2,
            y: this.canvasY + this.height / 2
        };
    }
    
    render(ctx) {
        ctx.save();
        
        const center = this.getCenter();
        
        // Dessiner le bouclier si actif (toujours visible, jamais clignotant)
        if (this.shieldActive) {
            ctx.strokeStyle = 'cyan';
            ctx.lineWidth = 5 * this.scaleRatio;
            ctx.beginPath();
            ctx.arc(
                center.x,
                center.y,
                (this.width / 2) + 10 * this.scaleRatio,
                0,
                Math.PI * 2
            );
            ctx.stroke();
        }
        
        // Appliquer la rotation et dessiner l'image si chargée
        ctx.translate(center.x, center.y);
        ctx.rotate(this.angle);
        
        if (this.imageLoaded) {
            // Si l'image est chargée, la dessiner
            ctx.drawImage(
                this.image,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
        } else {
            // Sinon, dessiner un rectangle pour le fallback
            // Clignoter uniquement si invulnérable à cause des dégâts (pas du shield)
            if (this.damagedInvulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
                ctx.fillStyle = 'rgba(255, 85, 85, 0.5)';
            } else {
                ctx.fillStyle = this.color;
            }
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }
        
        ctx.restore();
        
        // Dessiner la barre de vie
        this.renderHealth(ctx);
    }
    renderHealth(ctx) {
        ctx.save();
        const heartSize = 40 * this.scaleRatio; // Taille des coeurs encore plus grande
        const startX = 20 * this.scaleRatio; // Position un peu plus éloignée du bord
        const startY = 20 * this.scaleRatio; // Position un peu plus éloignée du bord
        const spacing = 10 * this.scaleRatio; // Espace entre les coeurs
        
        // Dessiner les coeurs plus visibles avec une meilleure forme
        for (let i = 0; i < this.maxHealth; i++) {
            const x = startX + (i % 6) * (heartSize + spacing);
            const y = startY + Math.floor(i / 6) * (heartSize + spacing);
            
            // Dessiner un contour pour tous les coeurs
            ctx.lineWidth = 2 * this.scaleRatio;
            ctx.strokeStyle = 'white';
            
            // Dessiner une forme de coeur au lieu d'un rectangle
            ctx.beginPath();
            const centerX = x + heartSize / 2;
            const centerY = y + heartSize / 2;
            const radiusX = heartSize / 2;
            const radiusY = heartSize / 2;
            
            // Dessiner un coeur stylisé
            this.drawHeart(ctx, centerX, centerY, radiusX, radiusY);
            
            // Remplir avec la couleur appropriée
            if (i < this.health) {
                // Coeur plein
                ctx.fillStyle = '#ff3333'; // Rouge vif
            } else {
                // Coeur vide
                ctx.fillStyle = 'rgba(150, 0, 0, 0.5)'; // Rouge foncé semi-transparent
            }
            
            ctx.fill();
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    // Ajouter cette nouvelle méthode à la classe Player
    drawHeart(ctx, x, y, width, height) {
        const topCurveHeight = height * 0.3;
        
        ctx.beginPath();
        // Dessiner le côté gauche du coeur
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
            x - width * 0.5, y - topCurveHeight, 
            x - width, y + height * 0.3, 
            x, y + height
        );
        
        // Dessiner le côté droit du coeur
        ctx.bezierCurveTo(
            x + width, y + height * 0.3, 
            x + width * 0.5, y - topCurveHeight, 
            x, y
        );
        
        ctx.closePath();
    }
}