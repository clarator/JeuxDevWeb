export default class Projectile {
    constructor(ctx, x, y, range) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;

        this.hitBoxHeight = 30;
        this.hitBoxWidth = 60;

        this.range = range;

        this.img = new Image();
        this.img.src = "assets/img/game2/Animation Pack/Energy ball/EnergyBall.png";
        this.frameX = 0;
    }

    render(removeSelf) {    
        this.move();
        if (this.range < 0) {
            removeSelf();
        }
        this.ctx.save();

        this.frameX += 0.08;
        this.frameX = (this.frameX % 8);


        this.ctx.drawImage(this.img, Math.floor(this.frameX) * (this.img.width/9)+5, 38, this.img.width/9, this.img.height, this.x, this.y, 80, 80);
        
        
        this.ctx.rect(this.x, this.y, this.hitBoxWidth, this.hitBoxHeight);
        this.ctx.strokeStyle = "white";
        this.ctx.stroke();

        this.ctx.restore();
    }

    move() {
        const speed = 3;
        this.x += speed;
        this.range -= speed;
    }

}