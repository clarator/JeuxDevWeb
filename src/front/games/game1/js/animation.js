
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


/*function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    document.body.appendChild(particle);

    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * 50 + 50;
    const duration = Math.random() * 1000 + 500;

    particle.animate([
        { transform: `translate(0, 0)`, opacity: 1 },
        { transform: `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`, opacity: 0 }
    ], {
        duration: duration,
        easing: 'ease-out'
    });

    setTimeout(() => {
        particle.remove();
    }, duration);
}

function explosion(x, y, numParticles = 20) {
    for (let i = 0; i < numParticles; i++) {
        createParticle(x, y);
    }
}

export { vibrateGold, explosion }; */

/*.particle {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: gold;
    border-radius: 50%;
    pointer-events: none;
} */

export { vibrateGold };