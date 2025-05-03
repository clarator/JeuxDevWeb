import { getCookie } from "../../js/cookie.js";
import { getBestScore } from "../../js/score.js"; 

window.soundEnabled = window.soundEnabled || true;

export function setupMenu() {
    const exitButton = document.getElementById("exit");
    const soundIcon = document.getElementById("iconSound"); 
    const bestScore = document.getElementById("bestScore");

    exitButton.addEventListener("click", () => {
        if (confirm("Quitter le jeu ?")) {
            // Sauvegarde du score avant de quitter
            const gameInstance = window.gameInstance; // Doit être rendu accessible globalement
            if (gameInstance) {
                gameInstance.saveScoreFinal();
            }
            //window.location.href = "/"; // Désactiver si on ne veut pas rediriger
        }
    });

    soundIcon.addEventListener("click", () => {
        window.soundEnabled = !window.soundEnabled;
        console.log("Sound enabled:", window.soundEnabled);

        if (window.soundEnabled) {
            console.log("Changement d'image vers sonON.png");
            soundIcon.src = "../../assets/img/game1/sonON.png";
        } else {
            console.log("Changement d'image vers sonOff.png");
            soundIcon.src = "../../assets/img/game1/sonOff.png";
        }
    });

    // Mets à jour le meilleur score
    const pseudo = getCookie("user");
    const gameName = "game1"; 

    getBestScore(pseudo, gameName)
        .then(data => {
            if (data.bestScore !== null) {
                bestScore.textContent = data.bestScore;
            } else {
                bestScore.textContent = "Aucun score";
            }
        })
        .catch(err => {
            console.error("Erreur de récupération du meilleur score :", err);
            bestScore.textContent = "Erreur";
        });
}
