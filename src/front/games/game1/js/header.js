import { getCookie } from "../../common/cookie.js";

window.soundEnabled = window.soundEnabled ?? true;

//fonction qui gère le header du jeu
export function setupHeader() {
    const exitButton = document.getElementById("exit");
    const soundIcon = document.getElementById("iconSound"); 
    const bestScore = document.getElementById("bestScore");
    const rules = document.getElementById("rules"); 

    exitButton.addEventListener("click", () => {
        if (confirm("Quitter le jeu ?")) {
            const gameInstance = window.gameInstance;
            if (gameInstance) {
                gameInstance.saveScoreFinal();
            }
            window.location.href = "/"; 
        }
    });

    soundIcon.addEventListener("click", () => {
        window.soundEnabled = !window.soundEnabled;

        if (window.soundEnabled) {
            soundIcon.src = "/assets/img/game1/sonON.png";
        } else {
            soundIcon.src = "/assets/img/game1/sonOff.png";
        }
    });

    // Met à jour le meilleur score
    const pseudo = getCookie("user");

    getBestScore(pseudo)
        .then(data => {
            if (data.bestScore !== null) {
                bestScore.textContent = data.bestScore;
            } else {
                bestScore.textContent = "0";
            }
        })
        .catch(err => {
            console.error("Erreur lors de la récupération du meilleur score :", err);
            bestScore.textContent = "Erreur";
        });
}
