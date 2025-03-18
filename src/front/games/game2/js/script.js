import Game from "./Game.js";

function init() {

    const canvas = document.getElementById("canvasGame2");
    const game = new Game(canvas);
    resizeCanvas();
    game.init();

    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 0;

    function updateFPS() {
        const now = performance.now();
        frameCount++;
        
        if (now - lastTime >= 1000) { // Mise à jour toutes les secondes
            fps = frameCount;
            frameCount = 0;
            lastTime = now;
        }
    }

    function drawFPS() {
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(`FPS: ${fps}`, canvas.width-100, 25);
    }

    function animate() {
        resizeCanvas();
        game.render();

        updateFPS();
        drawFPS();

        requestAnimationFrame(animate);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    animate();

}
init()