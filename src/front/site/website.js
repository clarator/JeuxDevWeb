const game1 = document.getElementById("#game1");
const game2 = document.getElementById("game2");
const game3 = document.getElementById("game3");
const rules1 = document.getElementById("rules1");
const rules2 = document.getElementById("rules2");
const rules3 = document.getElementById("rules3");
const score1 = document.getElementById("score1");

game1.addEventListener("click", function () {
    window.location.href = "../games/game1/index.html";
});

game2.addEventListener("click", function () {
    window.location.href = "../games/game2/index.html";
});

game3.addEventListener("click", function () {
    window.location.href = "../games/game3/index.html";
});

rules1.addEventListener("click", function () {
    window.location.href = "../games/game1/html/rules.html";
});

rules2.addEventListener("click", function () {
    window.location.href = "../games/game2/html/rules.html";
});

rules3.addEventListener("click", function () {
    window.location.href = "../games/game3/html/rules.html";
});

score1.addEventListener("click", function () {
    window.location.href = "../games/game1/html/score.html";
});

