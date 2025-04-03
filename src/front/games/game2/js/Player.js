import Projectile from "./Projectile.js";

export default class Player{
    constructor(ctx) {
        this.ctx = ctx;
        this.x = null;
        this.y = null;
        
        this.pathImg = "../../../assets/img/game2/Necromancer_creativekind-Sheet.png";

        this.img = new Image();
        this.img.src = this.pathImg;
        
        this.maxFrameX = 8;
        this.frameX = 0;

        this.hitBoxHeight = 90;
        this.hitBoxWidth = 75;

        this.right = true;

        this.speed = 2;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    render() {
        this.ctx.save();

        const spriteWidth = this.img.width / 17;

        this.frameX += 0.05;
        this.frameX = (this.frameX % this.maxFrameX);

        if (this.right) {
            this.ctx.drawImage(this.img, 60 + (spriteWidth * Math.floor(this.frameX)), 65, 50, 50, this.x, this.y, this.hitBoxHeight, this.hitBoxHeight);    
        
            // this.ctx.rect(this.x, this.y, this.hitBoxWidth, this.hitBoxHeight);
            // this.ctx.strokeStyle = "white";
            // this.ctx.stroke();
        } else {
            this.ctx.scale(-1,1);
            this.ctx.drawImage(this.img, 60 + (spriteWidth * Math.floor(this.frameX)), 65, 50, 50, - (this.x + this.hitBoxWidth), this.y, this.hitBoxHeight, this.hitBoxHeight);    
       
            // this.ctx.rect(-this.x - this.hitBoxWidth, this.y, this.hitBoxWidth, this.hitBoxHeight);
            // this.ctx.strokeStyle = "white";
            // this.ctx.stroke();
        }

        this.ctx.restore();
    }

    shoot() {
        return new Projectile(this.ctx, this.x, this.y+(this.hitBoxHeight/2)-20, 1000)
    }
}