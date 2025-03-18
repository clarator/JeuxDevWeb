import Game from './Game.js';

let game;

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM chargé, lancement du jeu...");

    // Initialisation du jeu
    game = new Game();

    const menuButton = document.getElementById("menuButton");
    const menuContent = document.querySelector(".menuContent");

    // Toggle du menu lors du clic sur le bouton "Menu"
    menuButton.addEventListener("click", () => {
        menuContent.style.display = menuContent.style.display === "block" ? "none" : "block";
    });

    // Cacher le menu si on clique ailleurs sur la page
    document.addEventListener("click", (event) => {
        if (!menuButton.contains(event.target) && !menuContent.contains(event.target)) {
            menuContent.style.display = "none";
        }
    });

    // Ajout des événements pour les boutons du menu
    document.getElementById("getBack").addEventListener("click", () => {
        menuContent.style.display = "none"; // Ferme le menu
    });

    document.getElementById("reset").addEventListener("click", () => {
        if (confirm("Voulez-vous recommencer la partie ?")) {
            location.reload(); // Recharge la page pour réinitialiser le jeu
        }
        console.log("reset");
    });

    document.getElementById("exit").addEventListener("click", () => {
        if (confirm("Voulez-vous quitter le jeu ?")) {
            window.location.href = "/"; // Redirige vers la page d'accueil
        }
    });

    document.getElementById("sound").addEventListener("click", () => {
        alert("Fonctionnalité à implémenter pour activer/désactiver les sons !");
    });
});
