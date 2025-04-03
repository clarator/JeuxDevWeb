export default class Room {
    
    constructor(ctx, x, y, isBoss = false) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.isBoss = isBoss;
        this.test = performance.now();
        
        this.img = new Image();
        this.img.src = "../../../assets/img/game2/4 doors room.png";
    }
    
    render() {
        this.ctx.save();

        this.ctx.drawImage(this.img, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.ctx.restore();
    }

    testCollisionWithRoom(entity) {

        const borderTop = (this.ctx.canvas.height/16)*1+20;
        const borderBottom = (this.ctx.canvas.height/16)*13+10;
        const borderLeft = (this.ctx.canvas.width/8)*1-10;
        const borderRight = (this.ctx.canvas.width/8)*7+10;

        var collision = false;

        if (entity.y < borderTop) {
            entity.y = borderTop;
            collision = true;
        }
        if (entity.y > borderBottom-entity.hitBoxHeight) {
            entity.y = borderBottom-entity.hitBoxHeight;
            collision = true;
        }
        if (entity.x < borderLeft) {
            entity.x = borderLeft;
            collision = true;
        }
        if (entity.x > borderRight-entity.hitBoxWidth) {
            entity.x = borderRight-entity.hitBoxWidth;
            collision = true;
        }
        return collision;
    }

}