
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


export { vibrateGold };