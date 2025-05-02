export class InputManager {
    constructor() {
        this.keys = {};
        
        // Écouteurs d'événements pour le clavier
        window.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });
        
        window.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });
    }

    isKeyPressed(key) {
        return this.keys[key] || false;
    }
}