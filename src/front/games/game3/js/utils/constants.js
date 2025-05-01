// constants.js - Constantes utilisées dans tout le jeu

// Dimensions du jeu
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

// Configuration de la grille
export const GRID_SIZE = 40; // Taille d'une cellule en pixels
export const GRID_COLS = 16; // Nombre de colonnes dans la grille
export const GRID_ROWS = 12; // Nombre de lignes dans la grille

// Couleurs
export const COLORS = {
    BACKGROUND: '#1a1a2e',
    GRID: '#16213e',
    WALL: '#0f3460',
    PLAYER: '#e94560',
    COLLECTIBLE: '#ffbd69',
    OBSTACLE: '#ff5e78',
    TEXT: '#ffffff'
};

// États de cellule
export const CELL_TYPE = {
    EMPTY: 0,
    WALL: 1,
    COLLECTIBLE: 2,
    SPIKE: 3,
    EXIT: 4
};

// Direction de mouvement
export const DIRECTION = {
    NONE: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4
};

// Paramètres du joueur
export const PLAYER = {
    SPEED: 5, // Cellules par seconde
    SIZE: 0.8 // Ratio de la taille de la cellule
};

// Seuils de glissement pour l'entrée tactile
export const SWIPE_THRESHOLD = 50; // Distance minimale en pixels pour un swipe