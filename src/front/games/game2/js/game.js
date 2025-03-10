import Dungeon from "./Dungeon.js";

function game(c) {
    const canvas = c;
    const ctx = canvas.getContext("2d");
    const dungeon = new Dungeon();
    dungeon.genererMap();
    dungeon.showMap();
}

game(document.getElementById("canvasGame2"));