// Gestionnaire des projectiles
export class ProjectileManager {
    constructor(game) {
        this.game = game;
        this.projectiles = [];
    }
    
    update(deltaTime) {
        // Mise à jour de tous les projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            
            // Déplacer le projectile
            this.moveProjectile(projectile, deltaTime);
            
            // Vérifier la durée de vie
            projectile.lifetime -= deltaTime;
            if (projectile.lifetime <= 0) {
                this.projectiles.splice(i, 1);
            }
        }
    }
    
    draw() {
        // Dessiner tous les projectiles
        for (const projectile of this.projectiles) {
            this.drawProjectile(projectile);
        }
    }
    
    addProjectile(projectileConfig) {
        // Créer un nouveau projectile
        const projectile = {
            // Position et mouvement
            x: projectileConfig.x,
            y: projectileConfig.y,
            targetX: projectileConfig.targetX,
            targetY: projectileConfig.targetY,
            speed: projectileConfig.speed,
            
            // Apparence
            color: projectileConfig.color || '#FFCC00',
            radius: projectileConfig.radius || 4,
            
            // Effets
            damage: projectileConfig.damage || 10,
            hitRadius: projectileConfig.hitRadius || 5,
            
            // Type et comportement
            type: projectileConfig.type || 'basic',
            homing: projectileConfig.homing || false,
            target: projectileConfig.target || null,
            
            // État
            lifetime: projectileConfig.lifetime || 3, // durée de vie en secondes
            hit: false
        };
        
        // Direction initiale
        const dx = projectile.targetX - projectile.x;
        const dy = projectile.targetY - projectile.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        projectile.dirX = dx / distance;
        projectile.dirY = dy / distance;
        
        this.projectiles.push(projectile);
        return projectile;
    }
    
    // Méthode pour déplacer les projectiles de manière sécurisée
    moveProjectile(projectile, deltaTime) {
        // Vérification que le projectile est valide
        if (!projectile || typeof projectile.x !== 'number' || typeof projectile.y !== 'number') {
            console.warn("Projectile invalide détecté");
            return;
        }
        
        // Traitement spécifique pour les projectiles de type mortier (trajectoire parabolique)
        if (projectile.type === 'mortar') {
            // Vérifier que toutes les propriétés nécessaires sont présentes
            if (!projectile.startX || !projectile.startY || !projectile.initialVelocity) {
                console.warn("Propriétés manquantes pour un projectile de type mortier");
                return;
            }
            
            // Mise à jour du temps en vol
            projectile.timeInAir += deltaTime;
            
            // Calculer la nouvelle position selon une trajectoire parabolique
            // Position X : mouvement linéaire depuis le point de départ
            projectile.x = projectile.startX + projectile.initialVelocity.x * projectile.timeInAir;
            
            // Position Y : mouvement parabolique (équation : y = y0 + v0*t + 0.5*g*t^2)
            projectile.y = projectile.startY + 
                        projectile.initialVelocity.y * projectile.timeInAir + 
                        0.5 * projectile.gravity * projectile.timeInAir * projectile.timeInAir;
            
            // Calculer l'angle de rotation pour dessiner le projectile dans la bonne direction
            const velocity = {
                x: projectile.initialVelocity.x,
                y: projectile.initialVelocity.y + projectile.gravity * projectile.timeInAir
            };
            
            // Angle basé sur la vitesse actuelle
            projectile.angle = Math.atan2(velocity.y, velocity.x);
            
            // Vérifier que targetX et targetY sont définis avant de calculer la distance
            if (typeof projectile.targetX === 'number' && typeof projectile.targetY === 'number') {
                // Vérifier si le projectile a atteint sa cible (proximité de la position cible)
                const dx = projectile.x - projectile.targetX;
                const dy = projectile.y - projectile.targetY;
                const distanceToTarget = Math.sqrt(dx * dx + dy * dy);
                
                if (distanceToTarget < 10) {
                    // Marquer le projectile comme ayant touché sa cible
                    projectile.hit = true;
                    
                    // Gérer les effets de zone si nécessaire
                    if (projectile.areaEffect) {
                        this.handleAreaEffect(projectile);
                    }
                }
            }
        }
        // Si le projectile a un comportement de suivi et une cible
        else if (projectile.homing && projectile.target) {
            // Vérifier que la cible est valide et active
            if (projectile.target.reachedEnd || projectile.target.health <= 0 || 
                typeof projectile.target.x !== 'number' || typeof projectile.target.y !== 'number') {
                // La cible n'est plus valide, passer en mode standard
                projectile.homing = false;
            } else {
                // Mettre à jour la direction vers la cible
                const dx = projectile.target.x - projectile.x;
                const dy = projectile.target.y - projectile.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Éviter la division par zéro
                if (distance > 0) {
                    // Mettre à jour la direction avec un facteur de lissage
                    const smoothFactor = 0.1; // Plus petit = virage plus serré
                    projectile.dirX = projectile.dirX * (1 - smoothFactor) + (dx / distance) * smoothFactor;
                    projectile.dirY = projectile.dirY * (1 - smoothFactor) + (dy / distance) * smoothFactor;
                    
                    // Normaliser la direction
                    const dirLength = Math.sqrt(projectile.dirX * projectile.dirX + projectile.dirY * projectile.dirY);
                    projectile.dirX /= dirLength;
                    projectile.dirY /= dirLength;
                }
            }
            
            // Déplacer le projectile
            projectile.x += projectile.dirX * projectile.speed * deltaTime;
            projectile.y += projectile.dirY * projectile.speed * deltaTime;
        }
        // Projectile standard (mouvement linéaire)
        else {
            // Vérifier que dirX et dirY sont définis
            if (typeof projectile.dirX !== 'number' || typeof projectile.dirY !== 'number') {
                // Si non définis, définir une direction par défaut (vers la droite)
                projectile.dirX = 1;
                projectile.dirY = 0;
            }
            
            // Déplacer le projectile
            projectile.x += projectile.dirX * projectile.speed * deltaTime;
            projectile.y += projectile.dirY * projectile.speed * deltaTime;
        }
        
        // Vérifier si le projectile est sorti de l'écran
        const margin = 50; // Marge supplémentaire pour être sûr
        if (projectile.x < -margin || projectile.x > this.game.canvas.width + margin || 
            projectile.y < -margin || projectile.y > this.game.canvas.height + margin) {
            projectile.lifetime = 0; // Marquer pour suppression
        }
    }

    // Méthode pour dessiner les projectiles de manière sécurisée
    drawProjectile(projectile) {
        // Vérification que le projectile est valide
        if (!projectile || typeof projectile.x !== 'number' || typeof projectile.y !== 'number') {
            return; // Ne pas tenter de dessiner un projectile invalide
        }
        
        const canvas = this.game.canvas;
        const ctx = canvas.ctx;
        
        switch (projectile.type) {
            case 'basic':
                // Projectile basique (cercle)
                canvas.drawCircle(projectile.x, projectile.y, projectile.radius || 4, projectile.color || '#FF9933');
                break;
                
            case 'mortar':
                // Projectile de mortier (image avec rotation)
                if (projectile.img && projectile.img.complete) {
                    ctx.save();
                    ctx.translate(projectile.x, projectile.y);
                    ctx.rotate(projectile.angle || 0);
                    ctx.drawImage(
                        projectile.img,
                        -(projectile.radius || 8),
                        -(projectile.radius || 8),
                        (projectile.radius || 8) * 2,
                        (projectile.radius || 8) * 2
                    );
                    ctx.restore();
                    
                    // Dessiner une ombre sous le projectile si les coordonnées cibles sont définies
                    if (typeof projectile.targetX === 'number' && typeof projectile.targetY === 'number') {
                        ctx.globalAlpha = 0.3;
                        canvas.drawCircle(
                            projectile.targetX,
                            projectile.targetY,
                            4 + (1 - Math.min(
                                Math.abs(projectile.x - projectile.targetX) / 100,
                                Math.abs(projectile.y - projectile.targetY) / 100,
                                1
                            )) * 6,
                            '#000000'
                        );
                        ctx.globalAlpha = 1;
                    }
                } else {
                    // Fallback si l'image n'est pas chargée
                    canvas.drawCircle(projectile.x, projectile.y, projectile.radius || 8, projectile.color || '#444444');
                }
                break;
                
            case 'laser':
                // Laser (ligne)
                if (typeof projectile.dirX === 'number' && typeof projectile.dirY === 'number') {
                    const length = 15;
                    const endX = projectile.x + projectile.dirX * length;
                    const endY = projectile.y + projectile.dirY * length;
                    
                    canvas.drawLine(projectile.x, projectile.y, endX, endY, projectile.color || '#00FFFF', 2);
                } else {
                    // Fallback si les directions ne sont pas définies
                    canvas.drawCircle(projectile.x, projectile.y, projectile.radius || 4, projectile.color || '#00FFFF');
                }
                break;
                
            case 'missile':
                // Missile (rectangle orienté)
                if (typeof projectile.dirX === 'number' && typeof projectile.dirY === 'number') {
                    canvas.save();
                    canvas.translate(projectile.x, projectile.y);
                    
                    // Calculer l'angle de rotation
                    const angle = Math.atan2(projectile.dirY, projectile.dirX);
                    canvas.rotate(angle);
                    
                    // Dessiner le missile
                    canvas.drawRect(0, -2, 8, 4, projectile.color || '#FF6600');
                    
                    canvas.restore();
                } else {
                    // Fallback si les directions ne sont pas définies
                    canvas.drawCircle(projectile.x, projectile.y, projectile.radius || 4, projectile.color || '#FF6600');
                }
                break;
                
            default:
                // Projectile par défaut (cercle)
                canvas.drawCircle(projectile.x, projectile.y, projectile.radius || 4, projectile.color || '#FFFFFF');
        }
    }

    // Méthode pour gérer les effets de zone de manière sécurisée
    handleAreaEffect(projectile) {
        // Vérifier que les paramètres nécessaires sont définis
        if (!projectile || typeof projectile.x !== 'number' || typeof projectile.y !== 'number' ||
            !projectile.areaRadius || !projectile.areaDamage) {
            console.warn("Paramètres insuffisants pour l'effet de zone");
            return;
        }
        
        // Appliquer des dégâts de zone aux ennemis proches
        if (this.game && this.game.enemyManager) {
            this.game.enemyManager.applyAreaDamage(
                projectile.x,
                projectile.y,
                projectile.areaRadius,
                projectile.areaDamage
            );
        }
        
        // Créer un effet visuel d'explosion
        if (this.game && this.game.effectsManager) {
            this.game.effectsManager.createExplosion(
                projectile.x, 
                projectile.y, 
                projectile.areaRadius
            );
        }
    }
    
    // Méthode pour créer un effet visuel d'explosion
    createExplosionEffect(x, y, radius) {
        // Créer plusieurs cercles qui s'agrandissent puis disparaissent
        for (let i = 0; i < 3; i++) {
            const delay = i * 100; // Délai entre chaque cercle
            
            setTimeout(() => {
                const explosion = {
                    x: x,
                    y: y,
                    radius: radius * 0.3,
                    maxRadius: radius,
                    alpha: 0.8,
                    color: i === 0 ? '#FF5500' : (i === 1 ? '#FF9500' : '#FFD700'),
                    lifetime: 0.5, // Durée de vie en secondes
                    timeAlive: 0
                };
                
                // Ajouter l'explosion à une liste d'effets visuels (à implémenter)
                if (this.game.effectsManager) {
                    this.game.effectsManager.addEffect(explosion);
                }
                // Alternative si vous n'avez pas d'EffectsManager
                else {
                    // Créer un canvas temporaire pour l'effet
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = radius * 2 + 20;
                    tempCanvas.height = radius * 2 + 20;
                    tempCanvas.style.position = 'absolute';
                    tempCanvas.style.left = (x - radius - 10) + 'px';
                    tempCanvas.style.top = (y - radius - 10) + 'px';
                    tempCanvas.style.pointerEvents = 'none';
                    tempCanvas.style.zIndex = '5';
                    document.getElementById('gameContainer').appendChild(tempCanvas);
                    
                    const tempCtx = tempCanvas.getContext('2d');
                    let animFrame;
                    
                    const animate = (timestamp) => {
                        if (!explosion.startTime) explosion.startTime = timestamp;
                        const elapsed = (timestamp - explosion.startTime) / 1000;
                        
                        if (elapsed < explosion.lifetime) {
                            // Calculer le rayon actuel et l'opacité
                            const progress = elapsed / explosion.lifetime;
                            const currentRadius = explosion.radius + (explosion.maxRadius - explosion.radius) * progress;
                            const alpha = explosion.alpha * (1 - progress);
                            
                            // Effacer le canvas
                            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
                            
                            // Dessiner l'explosion
                            tempCtx.globalAlpha = alpha;
                            tempCtx.beginPath();
                            tempCtx.arc(tempCanvas.width / 2, tempCanvas.height / 2, currentRadius, 0, Math.PI * 2);
                            tempCtx.fillStyle = explosion.color;
                            tempCtx.fill();
                            
                            animFrame = requestAnimationFrame(animate);
                        } else {
                            // Supprimer le canvas temporaire
                            tempCanvas.remove();
                            cancelAnimationFrame(animFrame);
                        }
                    };
                    
                    animFrame = requestAnimationFrame(animate);
                }
            }, delay);
        }
    }
    
    reset() {
        this.projectiles = [];
    }
}