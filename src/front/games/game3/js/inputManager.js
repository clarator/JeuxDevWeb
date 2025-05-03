export class InputManager {
    constructor() {
        this.keys = {};
        this.keyWasPressed = {};
        
        window.addEventListener('keydown', (event) => {
            // Ne pas répéter l'événement si la touche est maintenue enfoncée
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

    isKeyPressed(key) {
        return this.keys[key] || false;
    }
    
    isKeyJustPressed(key) {
        const wasPressed = this.keyWasPressed[key] || false;
        this.keyWasPressed[key] = false;
        return wasPressed;
    }
}