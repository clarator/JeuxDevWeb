window.soundEnabled = window.soundEnabled || true;  // Par défaut, le son est activé

export function setupMenu() {
    const exitButton = document.getElementById("exit");;
    const soundIcon = document.getElementById("iconSound");  // Image du son


    exitButton.addEventListener("click", () => {
        if (confirm("Quitter le jeu ?")) {
            window.location.href = "/";
        }
    });

    soundIcon.addEventListener("click", () => {
        window.soundEnabled = !window.soundEnabled;
        console.log("Sound enabled:", window.soundEnabled);

        // Change l'image du son
        if (window.soundEnabled) {
            console.log("Changement d'image vers sonON.png");
            soundIcon.src = "../../assets/img/game1/sonON.png";
        } else {
            console.log("Changement d'image vers sonOff.png");
            soundIcon.src = "../../assets/img/game1/sonOff.png";
        }
    });
    
}
