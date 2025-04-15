// Gestionnaire des effets visuels
export class EffectsManager {
    constructor(game) {
        this.game = game;
        this.effects = []; // Liste des effets actifs
    }
    
    update(deltaTime) {
        // Mettre à jour tous les effets et supprimer ceux qui sont terminés
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            
            // Mettre à jour le temps de vie de l'effet
            effect.timeAlive += deltaTime;
            
            // Supprimer l'effet s'il a dépassé sa durée de vie
            if (effect.timeAlive >= effect.lifetime) {
                this.effects.splice(i, 1);
            }
        }
    }
    
    draw() {
        const ctx = this.game.canvas.ctx;
        
        // Dessiner tous les effets
        for (const effect of this.effects) {
            // Sauvegarder le contexte pour l'opacité
            ctx.save();
            
            // Calculer la progression de l'effet (0 à 1)
            const progress = effect.timeAlive / effect.lifetime;
            
            // Dessiner en fonction du type d'effet
            switch(effect.type) {
                case 'explosion':
                    this.drawExplosion(effect, progress);
                    break;
                    
                case 'text':
                    this.drawFloatingText(effect, progress);
                    break;
                    
                case 'particle':
                    this.drawParticle(effect, progress);
                    break;
                
                default:
                    // Pour les effets génériques
                    this.drawGenericEffect(effect, progress);
            }
            
            // Restaurer le contexte
            ctx.restore();
        }
    }
    
        // Méthode améliorée pour ajouter un effet
    addEffect(effect) {
        // Vérifier que l'effet a les propriétés minimales requises
        if (!effect || typeof effect.x !== 'number' || typeof effect.y !== 'number') {
            console.warn("Tentative d'ajout d'un effet sans coordonnées valides");
            return null;
        }
        
        // Assurer que l'effet a les propriétés de base nécessaires
        effect.timeAlive = effect.timeAlive || 0;
        effect.lifetime = effect.lifetime || 1; // Durée de vie par défaut: 1 seconde
        effect.type = effect.type || 'generic';
        
        // Ajouter des propriétés par défaut en fonction du type
        switch (effect.type) {
            case 'explosion':
                effect.radius = effect.radius || 30;
                effect.maxRadius = effect.maxRadius || effect.radius * 2;
                effect.color = effect.color || '#FF9900';
                effect.secondaryColor = effect.secondaryColor || '#FF5500';
                effect.alpha = effect.alpha || 0.8;
                break;
                
            case 'text':
                effect.text = effect.text || '';
                effect.color = effect.color || '#FFFFFF';
                effect.font = effect.font || '18px Arial';
                effect.speed = effect.speed || 40;
                effect.direction = effect.direction || -Math.PI / 2; // Vers le haut
                break;
                
            case 'particle':
                effect.radius = effect.radius || 3;
                effect.color = effect.color || '#FFCC00';
                effect.speed = effect.speed || 100;
                effect.direction = effect.direction || 0;
                effect.gravity = effect.gravity || 200;
                break;
        }
        
        this.effects.push(effect);
        return effect;
    }
    
    // Méthode pour créer et ajouter un effet d'explosion
    createExplosion(x, y, radius, color) {
        return this.addEffect({
            type: 'explosion',
            x: x,
            y: y,
            radius: radius * 0.3,
            maxRadius: radius,
            color: color || '#FF9900',
            secondaryColor: '#FF5500',
            alpha: 0.8,
            lifetime: 0.6
        });
    }
    
    // Méthode pour créer un texte flottant (pour les dégâts, par exemple)
    createFloatingText(x, y, text, color) {
        return this.addEffect({
            type: 'text',
            x: x,
            y: y,
            text: text,
            color: color || '#FFFFFF',
            font: '18px Arial',
            lifetime: 1,
            speed: 40,
            direction: -Math.PI / 2 // Vers le haut
        });
    }
    
    // Méthode pour créer un système de particules simple
    createParticleSystem(x, y, count, color, speed, angle, spread) {
        for (let i = 0; i < count; i++) {
            // Calculer un angle aléatoire dans l'éventail spécifié
            const particleAngle = angle + (Math.random() - 0.5) * spread;
            
            // Créer la particule
            this.addEffect({
                type: 'particle',
                x: x,
                y: y,
                radius: 2 + Math.random() * 3,
                color: color || '#FFCC00',
                speed: speed * (0.7 + Math.random() * 0.6),
                direction: particleAngle,
                lifetime: 0.5 + Math.random() * 0.5,
                gravity: 200
            });
        }
    }
        
    // Méthode améliorée pour dessiner une explosion
    drawExplosion(effect, progress) {
        // Vérifier que l'effet est valide
        if (!effect || typeof effect.x !== 'number' || typeof effect.y !== 'number' || 
            !effect.radius || !effect.maxRadius) {
            return;
        }
        
        const ctx = this.game.canvas.ctx;
        
        // Calculer le rayon actuel
        const radius = effect.radius + (effect.maxRadius - effect.radius) * progress;
        
        // Calculer l'alpha (diminue avec le temps)
        const alpha = (effect.alpha || 0.8) * (1 - progress);
        
        // Dessiner le cercle principal de l'explosion
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
        
        // Créer un dégradé radial pour l'explosion
        const gradient = ctx.createRadialGradient(
            effect.x, effect.y, radius * 0.3,
            effect.x, effect.y, radius
        );
        
        gradient.addColorStop(0, effect.secondaryColor || '#FF5500');
        gradient.addColorStop(0.7, effect.color || '#FF9900');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Restaurer l'opacité
        ctx.globalAlpha = 1;
    }
    
    // Méthode améliorée pour dessiner un texte flottant
    drawFloatingText(effect, progress) {
        // Vérifier que l'effet est valide
        if (!effect || typeof effect.x !== 'number' || typeof effect.y !== 'number' || !effect.text) {
            return;
        }
        
        const ctx = this.game.canvas.ctx;
        
        // Calculer la position actuelle (déplacement vers le haut)
        const y = effect.y - (effect.speed || 40) * progress;
        
        // Calculer l'alpha (reste à 1 pendant la moitié, puis diminue)
        const alpha = progress < 0.7 ? 1 : 1 - ((progress - 0.7) / 0.3);
        
        // Définir l'opacité
        ctx.globalAlpha = alpha;
        
        // Dessiner le texte
        ctx.font = effect.font || '18px Arial';
        ctx.fillStyle = effect.color || '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(effect.text, effect.x, y);
    }
    
   
    // Méthode améliorée pour dessiner une particule
    drawParticle(effect, progress) {
        // Vérifier que l'effet est valide
        if (!effect || typeof effect.x !== 'number' || typeof effect.y !== 'number' || 
            typeof effect.direction !== 'number' || typeof effect.speed !== 'number') {
            return;
        }
        
        const ctx = this.game.canvas.ctx;
        
        // Calculer la position en fonction de la vitesse, direction et gravité
        const x = effect.x + Math.cos(effect.direction) * effect.speed * progress;
        const y = effect.y + Math.sin(effect.direction) * effect.speed * progress + 
                0.5 * (effect.gravity || 200) * progress * progress;
        
        // Calculer la taille (diminue avec le temps)
        const radius = (effect.radius || 3) * (1 - progress * 0.5);
        
        // Calculer l'alpha (diminue vers la fin)
        const alpha = progress < 0.7 ? 1 : 1 - ((progress - 0.7) / 0.3);
        
        // Dessiner la particule
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = effect.color || '#FFCC00';
        ctx.fill();
    }
    
    // Méthode pour dessiner un effet générique
    drawGenericEffect(effect, progress) {
        const ctx = this.game.canvas.ctx;
        
        // Si l'effet est un cercle simple
        if (effect.radius) {
            // Calculer le rayon actuel et l'opacité en fonction de la progression
            const radius = effect.radius + (effect.maxRadius || effect.radius) * progress;
            const alpha = effect.alpha ? effect.alpha * (1 - progress) : 1 - progress;
            
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = effect.color || '#FFFFFF';
            ctx.fill();
        }
    }
    
    // Supprimer tous les effets
    clear() {
        this.effects = [];
    }
}