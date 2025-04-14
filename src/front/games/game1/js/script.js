import Game from './Game.js';

let game;

// Fonction d'initialisation du jeu et des améliorations
function init() {
    console.log("DOM chargé, lancement du jeu...");
    game = new Game();
}
init()

const goldPicture = document.getElementById("goldPicture");
const explosionContainer = document.querySelector(".explosion");

goldPicture.addEventListener("click", () => {
    for (let i = 0; i < 15; i++) {
        const pepite = document.createElement("div");
        pepite.classList.add("explosion-pepite");

        // Position de départ : centre de la pépite
        const rect = goldPicture.getBoundingClientRect();
        const containerRect = explosionContainer.getBoundingClientRect();

        pepite.style.left = (rect.left + rect.width / 2 - containerRect.left) + "px";
        pepite.style.top = (rect.top + rect.height / 2 - containerRect.top) + "px";

        // Déplacement aléatoire
        const dx = (Math.random() - 0.5) * 200 + "px";
        const dy = (Math.random() - 0.5) * 200 + "px";
        pepite.style.setProperty("--dx", dx);
        pepite.style.setProperty("--dy", dy);

        explosionContainer.appendChild(pepite);

        // Supprime la pépite après l'animation
        setTimeout(() => {
            pepite.remove();
        }, 600);
    }
});
