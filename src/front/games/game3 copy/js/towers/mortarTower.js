// Classe pour la tour de mortier
import { Tower } from './tower.js';

export class MortarTower extends Tower {
    constructor(game, x, y, gridX, gridY, isPreview = false) {
        // Caractéristiques de la tour mortier
        const config = {
            range: 200,        // Portée en pixels (plus grande que la tour basique)
            fireRate: 0.5,     // Tirs par seconde (plus lent que la tour basique)
            damage: 25,        // Dégâts par projectile (plus élevés que la tour basique)
            cost: 50,          // Coût en or
            color: '#6B4226',  // Couleur de la tour (pour la prévisualisation)
            upgradeOptions: [
                {
                    name: 'Augmenter la portée',
                    cost: 30,
                    effect: (tower) => { tower.range += 40; }
                },
                {
                    name: 'Augmenter les dégâts',
                    cost: 35,
                    effect: (tower) => { tower.damage += 15; }
                },
                {
                    name: 'Dégâts de zone',
                    cost: 60,
                    effect: (tower) => { 
                        tower.hasAreaDamage = true; 
                        tower.areaRadius = 50;
                        tower.areaDamage = tower.damage * 0.5;
                    }
                }
            ]
        };
        
        super(game, x, y, gridX, gridY, config, isPreview);
        
        // Propriétés spécifiques à cette tour
        this.type = 'mortar';
        this.projectileType = 'mortar';
        this.projectileSpeed = 200;
        this.projectileColor = '#444444';
        
        // Propriétés pour l'animation
        this.isAnimating = false;
        this.animationTimer = 0;
        this.animationDuration = 0.5; // Durée de l'animation en secondes
        this.animationProgress = 0;   // Progression de l'animation (0 à 1)
        
        // États pour les parties mobiles
        this.leftPartOffset = { x: -8, y: 0 };
        this.rightPartOffset = { x: 8, y: 0 };
        
        // Dégâts de zone (activés via une amélioration)
        this.hasAreaDamage = false;
        this.areaRadius = 40;
        this.areaDamage = 10;
        
        // Chargement des images
        this.loadImages();
    }
    
    loadImages() {
        // Créer et charger les images
        this.baseImg = new Image();
        this.leftPartImg = new Image();
        this.rightPartImg = new Image();
        this.projectileImg = new Image();
        
        // Définir les chemins des images (à adapter selon votre structure)
        this.baseImg.src = '../../assets/img/game3/PNG/T1_lv1_1.png';
        this.leftPartImg.src = '../../assets/img/game3/PNG/T1_lv1_2.png';
        this.rightPartImg.src = '../../assets/img/game3/PNG/T1_lv1_3.png';
        this.projectileImg.src = '../../assets/img/game3/PNG/T1_ammo.png';
        
        // Définir les dimensions des images
        this.imgWidth = 40;
        this.imgHeight = 40;
    }
    
    update(deltaTime) {
        // Appel à la méthode parente
        super.update(deltaTime);
        
        // Mise à jour de l'animation si elle est en cours
        if (this.isAnimating) {
            this.animationTimer += deltaTime;
            
            // Calculer la progression de l'animation (0 à 1)
            this.animationProgress = Math.min(this.animationTimer / this.animationDuration, 1);
            
            // Si l'animation est terminée
            if (this.animationProgress >= 1) {
                this.isAnimating = false;
                this.animationTimer = 0;
                this.animationProgress = 0;
            }
        }
    }
    fire() {
        // Vérification que la cible existe
        if (!this.target) return;
        
        // Sauvegarder les coordonnées actuelles de la cible
        // au cas où elle serait détruite avant la création du projectile
        const targetX = this.target.x;
        const targetY = this.target.y;
        
        // Démarrer l'animation de tir
        this.isAnimating = true;
        this.animationTimer = 0;
        
        // Attendre que l'animation atteigne son point culminant pour créer le projectile
        // Utiliser setTimeout pour décaler la création du projectile
        setTimeout(() => {
            // Vérifier que la cible existe toujours ou utiliser les coordonnées sauvegardées
            let projectileTarget = this.target;
            
            // Si la cible n'existe plus, créer un objet temporaire avec les coordonnées sauvegardées
            if (!projectileTarget || projectileTarget.health <= 0 || projectileTarget.reachedEnd) {
                projectileTarget = {
                    x: targetX,
                    y: targetY
                };
            }
            
            // Créer un projectile dirigé vers la cible ou ses dernières coordonnées connues
            const projectile = this.createProjectile(projectileTarget);
            
            if (projectile) {
                // Ajouter le projectile au gestionnaire
                this.game.projectileManager.addProjectile(projectile);
            }
            
            // Reset du timer de tir dans la classe parente
            this.canFire = false;
            this.fireTimer = 0;
        }, this.animationDuration * 1000 * 0.5); // Créer le projectile à mi-chemin de l'animation
    }
    
    // Correction pour la méthode createProjectile dans MortarTower
    createProjectile(target) {
        // Vérification supplémentaire
        if (!target || typeof target.x !== 'number' || typeof target.y !== 'number') {
            console.warn("Cible invalide pour la création d'un projectile");
            return null;
        }
        
        // Calculer la position de départ du projectile (au-dessus de la tour)
        const startX = this.x;
        const startY = this.y - 20; // Positionner le projectile au-dessus de la tour
        
        // Calculer la trajectoire en arc
        const projectile = {
            type: this.projectileType,
            x: startX,
            y: startY,
            targetX: target.x,
            targetY: target.y,
            startX: startX,
            startY: startY,
            speed: this.projectileSpeed,
            damage: this.damage,
            color: this.projectileColor,
            hitRadius: 8,
            
            // Propriétés pour la trajectoire parabolique
            gravity: 300,           // Force de gravité simulée
            timeInAir: 0,           // Temps écoulé depuis le lancement
            initialVelocity: {      // Vitesse initiale calculée pour atteindre la cible
                x: 0,
                y: -150             // Valeur négative pour aller vers le haut
            },
            
            // Propriétés pour les dégâts de zone (si activés)
            areaEffect: this.hasAreaDamage,
            areaRadius: this.areaRadius,
            areaDamage: this.areaDamage,
            
            // Référence à l'image du projectile
            img: this.projectileImg
        };
        
        // Calculer l'angle de tir vers la cible
        const dx = target.x - startX;
        const dy = target.y - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculer la vitesse initiale pour atteindre la cible
        // Formule simplifiée pour une trajectoire parabolique
        const time = distance / projectile.speed;
        projectile.initialVelocity.x = dx / time;
        
        return projectile;
    }

    // Correction pour la méthode drawTower
    drawTower() {
        const canvas = this.game.canvas;
        const ctx = canvas.ctx;
        
        // Position de dessin (centre de la tour)
        const drawX = this.x - this.imgWidth / 2;
        const drawY = this.y - this.imgHeight / 2;
        
        // Si les images ne sont pas encore chargées, dessiner une version simplifiée
        if (!this.baseImg || !this.baseImg.complete) {
            canvas.drawRect(
                this.x - 15,
                this.y - 15,
                30,
                30,
                this.color
            );
            return;
        }
        
        // Dessiner la base de la tour (toujours au même endroit)
        ctx.drawImage(this.baseImg, drawX, drawY, this.imgWidth, this.imgHeight);
        
        // Calculer la position des parties mobiles en fonction de l'animation
        let offsetY = 0;
        
        if (this.isAnimating) {
            // Animation en deux temps : monter puis descendre
            if (this.animationProgress < 0.5) {
                // Phase de montée (0 à -15 pixels)
                offsetY = -30 * (this.animationProgress * 2); // * 2 pour atteindre -15 à mi-chemin
            } else {
                // Phase de descente (-15 à 0 pixels)
                offsetY = -30 * (1 - (this.animationProgress - 0.5) * 2);
            }
        }
        
        // Sauvegarder le contexte pour les transformations
        ctx.save();
        
        // Translater vers le centre de la tour
        ctx.translate(this.x, this.y);
        
        // Si la tour a une cible, orienter les parties mobiles vers elle
        if (this.target && !this.target.reachedEnd && this.target.health > 0) {
            // Calculer l'angle vers la cible
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const angle = Math.atan2(dy, dx);
            
            // Appliquer la rotation
            ctx.rotate(angle);
        }
        
        // Dessiner les parties mobiles
        if (this.leftPartImg && this.leftPartImg.complete) {
            ctx.drawImage(
                this.leftPartImg,
                this.leftPartOffset.x - this.imgWidth / 2,
                this.leftPartOffset.y - this.imgHeight / 2 + offsetY,
                this.imgWidth,
                this.imgHeight
            );
        }
        
        if (this.rightPartImg && this.rightPartImg.complete) {
            ctx.drawImage(
                this.rightPartImg,
                this.rightPartOffset.x - this.imgWidth / 2,
                this.rightPartOffset.y - this.imgHeight / 2 + offsetY,
                this.imgWidth,
                this.imgHeight
            );
        }
        
        // Restaurer le contexte
        ctx.restore();
    }

    // Méthode pour prévisualisation de la tour
    drawPreview(mouseX, mouseY) {
        // Utiliser la méthode de base pour la prévisualisation
        super.drawPreview(mouseX, mouseY);
    }
}