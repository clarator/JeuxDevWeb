export default class Utils {
    // Dimensions de référence (1920x1080)
    static REFERENCE_WIDTH = 1920;
    static REFERENCE_HEIGHT = 1080;
    
    // Obtenir le ratio d'échelle actuel par rapport à la référence
    static getScaleRatio(canvasWidth, canvasHeight) {
        const widthRatio = canvasWidth / Utils.REFERENCE_WIDTH;
        const heightRatio = canvasHeight / Utils.REFERENCE_HEIGHT;
        
        // Utiliser le ratio le plus petit pour s'assurer que tout tient dans l'écran
        return Math.min(widthRatio, heightRatio);
    }
    
    // Mise à l'échelle d'une valeur en fonction du ratio actuel
    static scaleValue(value, ratio) {
        return value * ratio;
    }
    
    // Créer un vecteur de direction aléatoire normalisé
    static getRandomDirection() {
        const direction = {
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1
        };
        
        return Utils.normalizeVector(direction);
    }
    
    // Normaliser un vecteur
    static normalizeVector(vector) {
        const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        
        // Éviter la division par zéro
        if (length === 0) {
            return { x: 0, y: 0 };
        }
        
        return {
            x: vector.x / length,
            y: vector.y / length
        };
    }
    
    // Créer un vecteur de direction d'un point A vers un point B
    static getDirectionVector(fromX, fromY, toX, toY) {
        const direction = {
            x: toX - fromX,
            y: toY - fromY
        };
        
        return Utils.normalizeVector(direction);
    }
}