// Classe pour gérer les entrées clavier et souris
class InputHandler {
    constructor(canvas) {
        this.canvas = canvas;
        
        this.keys = {
            z: false,
            q: false,
            s: false,
            d: false,
            p: false,
            escape: false
        };
        
        // Position de la souris relative au canvas
        this.mouseX = 0;
        this.mouseY = 0;
        this.mousePressed = false;
        this.justClicked = false; // Pour détecter les nouveaux clics
        
        // Écouteurs d'événements pour les touches
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Écouteurs d'événements pour la souris
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
        
        // Pour les appareils tactiles
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    }
    
    // Gestion des touches enfoncées
    handleKeyDown(e) {
        switch(e.key.toLowerCase()) {
            case 'z':
                this.keys.z = true;
                break;
            case 'q':
                this.keys.q = true;
                break;
            case 's':
                this.keys.s = true;
                break;
            case 'd':
                this.keys.d = true;
                break;
            case 'p':
                this.keys.p = true;
                break;
            case 'escape':
                this.keys.escape = true;
                break;
        }
    }
    
    // Gestion des touches relâchées
    handleKeyUp(e) {
        switch(e.key.toLowerCase()) {
            case 'z':
                this.keys.z = false;
                break;
            case 'q':
                this.keys.q = false;
                break;
            case 's':
                this.keys.s = false;
                break;
            case 'd':
                this.keys.d = false;
                break;
            case 'p':
                this.keys.p = false;
                break;
            case 'escape':
                this.keys.escape = false;
                break;
        }
    }
    
    // Gestion des mouvements de la souris
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }
    
    // Gestion de l'appui sur le bouton de la souris
    handleMouseDown(e) {
        if (e.button === 0) { // Bouton gauche
            this.mousePressed = true;
            this.justClicked = true;
        }
    }
    
    // Gestion du relâchement du bouton de la souris
    handleMouseUp(e) {
        if (e.button === 0) { // Bouton gauche
            this.mousePressed = false;
        }
    }
    
    // Gestion de la sortie de la souris du canvas
    handleMouseLeave() {
        this.mousePressed = false;
    }
    
    // Gestion des événements tactiles
    handleTouchStart(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.mouseX = touch.clientX - rect.left;
        this.mouseY = touch.clientY - rect.top;
        this.mousePressed = true;
        this.justClicked = true;
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.mouseX = touch.clientX - rect.left;
        this.mouseY = touch.clientY - rect.top;
    }
    
    handleTouchEnd() {
        this.mousePressed = false;
    }
    
    // Obtenir la direction actuelle du joueur basée sur les touches enfoncées
    getDirection() {
        let dirX = 0;
        let dirY = 0;
        
        if (this.keys.z) dirY = -1;
        if (this.keys.s) dirY = 1;
        if (this.keys.q) dirX = -1;
        if (this.keys.d) dirX = 1;
        
        return { x: dirX, y: dirY };
    }
    
    // Vérifier si la souris est enfoncée et réinitialiser le flag justClicked
    isFiring() {
        // Si justClicked était vrai, le réinitialiser à false et retourner true
        if (this.justClicked) {
            this.justClicked = false;
            return true;
        }
        
        // Sinon, renvoyer l'état de mousePressed
        return this.mousePressed;
    }
    
    // Calculer la direction de tir vers la position de la souris
    getShootingDirection(playerX, playerY, playerWidth, playerHeight) {
        // Calculer le centre du joueur
        const playerCenterX = playerX + playerWidth / 2;
        const playerCenterY = playerY + playerHeight / 2;
        
        // Calculer le vecteur direction vers la souris
        let dirX = this.mouseX - playerCenterX;
        let dirY = this.mouseY - playerCenterY;
        
        // Normaliser le vecteur direction
        const length = Math.sqrt(dirX * dirX + dirY * dirY);
        if (length !== 0) {
            dirX /= length;
            dirY /= length;
        }
        
        return { x: dirX, y: dirY };
    }
}