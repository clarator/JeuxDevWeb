//pour l'animation de la pépite d'or
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

//explosion de la pépite d'or
function explodeGoldPicture(goldPicture, explosionContainer) {
    for (let i = 0; i < 15; i++) {
        const nugget = document.createElement("div");
        nugget.classList.add("explosion-pepite");

        //position de départ au centre de la pépite
        const rect = goldPicture.getBoundingClientRect();
        const containerRect = explosionContainer.getBoundingClientRect();

        nugget.style.left = (rect.left + rect.width / 2 - containerRect.left) + "px";
        nugget.style.top = (rect.top + rect.height / 2 - containerRect.top) + "px";

        //déplacement aléatoire
        const distance = 600; //
        const dx = (Math.random() - 0.5) * distance  + "px";
        const dy = (Math.random() - 0.5) * distance + "px";
        nugget.style.setProperty("--dx", dx);
        nugget.style.setProperty("--dy", dy);

        const size = Math.random() * 10 + 8; 
        const duration = Math.random() * 300 + 800; 
        nugget.style.width = `${size}px`;
        nugget.style.height = `${size}px`;
        nugget.style.animationDuration = `${duration}ms`;


        explosionContainer.appendChild(nugget);

        //supprime la pépite après l'animation
        setTimeout(() => {
            nugget.remove();
        }, 600);
    }
}

export { vibrateGold, explodeGoldPicture };