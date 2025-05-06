export default class InputManager {
    constructor() {
        // Objets pour stocker l'état des touches
        this.keys = {};
        this.keyWasPressed = {};
        
        // Écouteurs d'événements pour les touches du clavier
        window.addEventListener('keydown', (event) => {
            // Évite la répétition automatique quand une touche est maintenue
            if (!this.keys[event.code]) {
                this.keyWasPressed[event.code] = true;
            }
            this.keys[event.code] = true;
        });
        
        window.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
            this.keyWasPressed[event.code] = false;
        });
    }

    // Vérifie si une touche est actuellement enfoncée
    isKeyPressed(key) {
        return this.keys[key] || false;
    }
    
    // Vérifie si une touche vient juste d'être pressée (une seule fois)
    // Utile pour les actions qui ne doivent pas se répéter
    isKeyJustPressed(key) {
        const wasPressed = this.keyWasPressed[key] || false;
        this.keyWasPressed[key] = false;
        return wasPressed;
    }
}