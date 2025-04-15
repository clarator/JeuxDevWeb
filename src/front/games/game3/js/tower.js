export class Tower {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 50; // Largeur de la tour
        this.height = 50; // Hauteur de la tour
        this.color = 'blue'; // Couleur de la tour

        this.img = new Image();
        this.img.src = "../../assets/img/game3/Towers/T1_lv1.png";
    
        this.frameX = 0;
    }
//https://free-game-assets.itch.io/free-stone-tower-defense-game-art

    update(deltaTime) {
        this.game.ctx.save();

        this.frameX += 0.2;

        this.frameX = this.frameX%50;
        this.game.ctx.drawImage(this.img, 170*Math.floor(this.frameX), 0, 170, 170, 100, 100, this.width, this.height);

        this.game.ctx.restore();
    }
}