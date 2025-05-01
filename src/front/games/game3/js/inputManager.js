export class InputManager {
    constructor(scene) {
        this.keys = {};
        
        scene.onKeyboardObservable.add((info) => {
            this.keys[info.event.code] = info.type === 1 ? true : false;
        });
        
    }

    isKeyPressed(key) {
        return this.keys[key] || false;
    }
}