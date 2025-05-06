export default class Player {
    constructor(scaleRatio) {
        // Position et dimensions
        this.canvasX = 0;
        this.canvasY = 0;
        this.width = 50 * scaleRatio;
        this.height = 50 * scaleRatio;
        
        // Vitesse et direction
        this.speedX = 0;
        this.speedY = 0;
        this.speedValue = 300 * scaleRatio;
        
        // Apparence et combat
        this.color = '#ff5555';
        this.shootCooldown = 0;
        this.shootCooldownTime = 0.2;
        
        // Santé et invulnérabilité
        this.health = 6;
        this.maxHealth = 6;
        this.invulnerable = false;
        this.invulnerableTime = 0;
        
        // Mise à l'échelle
        this.scaleRatio = scaleRatio;
        
        // Valeurs de base pour la réinitialisation
        this.baseSpeedValue = 300 * scaleRatio;
        this.baseShootCooldownTime = 0.2;
        
        // Améliorations des armes
        this.projectileDamage = 1;
        this.multiShot = 1;
        this.piercingLevel = 0;
    
        // Système de bouclier
        this.hasShield = false;
        this.shieldActive = false;
        this.shieldActiveTime = 0; // Durée actuelle du bouclier
        this.shieldDuration = 1.0; // Durée totale du bouclier
        this.shieldTimer = 0; // Temps entre les boucliers
        this.shieldMinCooldown = 4.0; // Temps minimum avant réactivation
        this.shieldMaxCooldown = 6.0; // Temps maximum avant réactivation
        
        // Invulnérabilité après dégâts
        this.damagedInvulnerable = false;
        this.damagedInvulnerableTime = 0;
        
        // Rotation
        this.angle = 0; // Angle en radians
        
        // Image du joueur
        this.image = new Image();
        this.image.src = '../../../public/assets/img/game2/player.png'; 
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
    }

    // Réinitialise le joueur au début d'une nouvelle partie
    reset() {
        // Réinitialisation des améliorations
        this.speedValue = this.baseSpeedValue;
        this.shootCooldownTime = this.baseShootCooldownTime;
        this.projectileDamage = 1;
        this.multiShot = 1;
        this.piercingLevel = 0;
        
        // Réinitialisation du bouclier
        this.hasShield = false;
        this.shieldActive = false;
        this.shieldActiveTime = 0;
        this.shieldTimer = 0;
        
        // Réinitialisation de la santé
        this.health = 6;
        this.maxHealth = 6;
        this.invulnerable = false;
        this.invulnerableTime = 0;
        this.damagedInvulnerable = false;
        this.damagedInvulnerableTime = 0;
        
        // Réinitialisation de la position et mouvement
        this.speedX = 0;
        this.speedY = 0;
        this.shootCooldown = 0;
        this.angle = 0;
    }
    
    // Redimensionne le joueur lors du changement de taille d'écran
    resize(scaleRatio) {
        this.width = 50 * scaleRatio;
        this.height = 50 * scaleRatio;
        // Maintient le ratio de vitesse
        const speedRatio = this.speedValue / this.scaleRatio;
        this.speedValue = speedRatio * scaleRatio;
        this.baseSpeedValue = 300 * scaleRatio;
        this.scaleRatio = scaleRatio;
    }
    
    // Mise à jour du joueur à chaque frame
    update(deltaTime, mouseX, mouseY) {
        // Déplacement selon la vitesse
        this.canvasX += this.speedX * deltaTime;
        this.canvasY += this.speedY * deltaTime;
        
        // Réduction du temps de recharge du tir
        if (this.shootCooldown > 0) {
            this.shootCooldown -= deltaTime;
        }
        
        // Calcul de l'angle en fonction de la position de la souris
        if (mouseX !== undefined && mouseY !== undefined) {
            const center = this.getCenter();
            this.angle = Math.atan2(mouseY - center.y, mouseX - center.x);
        }
        
        // Gestion de l'invulnérabilité après dégâts
        if (this.damagedInvulnerable) {
            this.damagedInvulnerableTime -= deltaTime;
            if (this.damagedInvulnerableTime <= 0) {
                this.damagedInvulnerable = false;
                // Fin de l'invulnérabilité si le bouclier n'est pas actif
                if (!this.shieldActive) {
                    this.invulnerable = false;
                }
            }
        }
        
        // Gestion du système de bouclier
        if (this.hasShield) {
            if (this.shieldActive) {
                // Le bouclier est actif, on compte la durée
                this.shieldActiveTime += deltaTime;
                
                // Le bouclier dure 1 seconde
                if (this.shieldActiveTime >= this.shieldDuration) {
                    this.shieldActive = false;
                    this.shieldActiveTime = 0;
                    
                    // Programme le prochain bouclier
                    this.shieldTimer = this.shieldMinCooldown + 
                        Math.random() * (this.shieldMaxCooldown - this.shieldMinCooldown);
                    
                    // Désactive l'invulnérabilité si pas de dégâts récents
                    if (!this.damagedInvulnerable) {
                        this.invulnerable = false;
                    }
                }
            } else {
                // Le bouclier n'est pas actif, on attend le prochain
                this.shieldTimer -= deltaTime;
                if (this.shieldTimer <= 0) {
                    this.shieldActive = true;
                    this.shieldActiveTime = 0;
                    this.invulnerable = true;
                }
            }
        }
    }
    
    // Initialise le système de bouclier
    startShieldSystem() {
        this.shieldTimer = this.shieldMinCooldown;
        this.shieldActive = false;
    }
    
    // Gère les dégâts infligés au joueur
    takeDamage() {
        if (!this.invulnerable) {
            this.health--;
            this.invulnerable = true;
            this.damagedInvulnerable = true;
            this.invulnerableTime = 1.0;
            this.damagedInvulnerableTime = 1.0;
            return this.health <= 0; // Indique si le joueur est mort
        }
        return false; // Le joueur n'a pas été touché
    }
    
    // Retourne le centre du joueur
    getCenter() {
        return {
            x: this.canvasX + this.width / 2,
            y: this.canvasY + this.height / 2
        };
    }
    
    // Affichage du joueur et de son bouclier
    render(ctx) {
        ctx.save();
        
        const center = this.getCenter();
        
        // Affichage du bouclier si actif
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
        
        // Rotation et affichage du joueur
        ctx.translate(center.x, center.y);
        ctx.rotate(this.angle);
        
        if (this.imageLoaded) {
            // Si l'image est chargée, l'afficher
            ctx.drawImage(
                this.image,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
        } else {
            // Sinon, afficher un rectangle avec effet de clignotement si invulnérable
            if (this.damagedInvulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
                ctx.fillStyle = 'rgba(255, 85, 85, 0.5)';
            } else {
                ctx.fillStyle = this.color;
            }
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }
        
        ctx.restore();
        
        // Affichage de la barre de vie
        this.renderHealth(ctx);
    }
    
    // Affiche les coeurs de vie du joueur
    renderHealth(ctx) {
        ctx.save();
        const heartSize = 40 * this.scaleRatio;
        const startX = 20 * this.scaleRatio;
        const startY = 20 * this.scaleRatio;
        const spacing = 10 * this.scaleRatio;
        
        // Dessin des coeurs pour représenter la vie
        for (let i = 0; i < this.maxHealth; i++) {
            const x = startX + (i % 6) * (heartSize + spacing);
            const y = startY + Math.floor(i / 6) * (heartSize + spacing);
            
            // Contour des coeurs
            ctx.lineWidth = 2 * this.scaleRatio;
            ctx.strokeStyle = 'white';
            
            // Dessin d'un coeur stylisé
            this.drawHeart(ctx, x + heartSize / 2, y + heartSize / 2, heartSize / 2, heartSize / 2);
            
            // Couleur selon l'état du coeur
            if (i < this.health) {
                // Coeur plein
                ctx.fillStyle = '#ff3333';
            } else {
                // Coeur vide
                ctx.fillStyle = 'rgba(150, 0, 0, 0.5)';
            }
            
            ctx.fill();
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    // Dessine un coeur avec des courbes de Bézier
    drawHeart(ctx, x, y, width, height) {
        const topCurveHeight = height * 0.3;
        
        ctx.beginPath();
        // Côté gauche du coeur
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
            x - width * 0.5, y - topCurveHeight, 
            x - width, y + height * 0.3, 
            x, y + height
        );
        
        // Côté droit du coeur
        ctx.bezierCurveTo(
            x + width, y + height * 0.3, 
            x + width * 0.5, y - topCurveHeight, 
            x, y
        );
        
        ctx.closePath();
    }
}