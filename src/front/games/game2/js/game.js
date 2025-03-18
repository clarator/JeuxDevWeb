import Dungeon from "./Dungeon.js";
import InputManager from "./inputManager.js";
import Player from "./Player.js";
import Projectile from "./Projectile.js";

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.inputManager = new InputManager();
        this.dungeon = new Dungeon(this.ctx);
        this.player = new Player(this.ctx);
        this.timeShoot = performance.now();

        this.entities = [];
    }

    init() {
        this.dungeon.init();
        this.player.setPos(180, this.ctx.canvas.height/2-this.player.hitBoxHeight/2);
        this.test = new Projectile(this.ctx, 100, 100, 1000);
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.dungeon.render();
        
        this.player.render();

        this.playerController();
        this.testCollision(this.player);

        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].render(() => {
                this.entities.splice(i, 1)
                i--;
            });
            if (this.entities[i]!=undefined && this.testCollision(this.entities[i])) {
                this.entities.splice(i, 1);
                i--;
            }
        }
    }

    playerController() {
        const up = this.inputManager.isKeyPressed("KeyW")
        const down = this.inputManager.isKeyPressed("KeyS")
        const left = this.inputManager.isKeyPressed("KeyA")
        const right = this.inputManager.isKeyPressed("KeyD") 
        if (up) {
            this.player.y -= this.player.speed / (left || right ? Math.sqrt(2) : 1);
        }
        if (down) {
            this.player.y += this.player.speed / (left || right ? Math.sqrt(2) : 1);
        }
        if (left) {
            this.player.right = false;
            this.player.x -= this.player.speed / (up || down ? Math.sqrt(2) : 1);
        }
        if (right) {
            this.player.x += this.player.speed / (up || down ? Math.sqrt(2) : 1);
            this.player.right = true;
        }

        const shoot = this.inputManager.isKeyPressed("Space");
        if (shoot) {
            const time = performance.now(); 
            if (time - this.timeShoot > 200) {
                this.timeShoot = time
                this.shoot(this.player);
            }
        }
    }

    shoot(entity) {
        this.entities.push(entity.shoot());
    }

    testCollision(entity) {
        return this.dungeon.actualRoom.testCollisionWithRoom(entity);
    }

}
