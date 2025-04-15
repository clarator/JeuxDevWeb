
//vibration
function vibrateGold(vibrationIntensity, buttonGold) {
    if (buttonGold) {
        let frames = [
            { transform: `translate(0px, 0px)` },
            { transform: `translate(${vibrationIntensity}px, ${vibrationIntensity}px)` },
            { transform: `translate(-${vibrationIntensity}px, -${vibrationIntensity}px)` },
            { transform: `translate(${vibrationIntensity}px, -${vibrationIntensity}px)` },
            { transform: `translate(-${vibrationIntensity}px, ${vibrationIntensity}px)` },
            { transform: `translate(0px, 0px)` }
        ];

        buttonGold.animate(frames, {
            duration: 100, 
            iterations: 5 
        });
    }
}


function explodeGoldPicture(goldPicture, explosionContainer) {
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

        const size = Math.random() * 10 + 8; 
        const duration = Math.random() * 300 + 500; 
        pepite.style.width = `${size}px`;
        pepite.style.height = `${size}px`;
        pepite.style.animationDuration = `${duration}ms`;


        explosionContainer.appendChild(pepite);

        // Supprime la pépite après l'animation
        setTimeout(() => {
            pepite.remove();
        }, 600);
    }
}

export { vibrateGold, explodeGoldPicture };