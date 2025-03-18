import Room from "./Room.js";

export default class Dungeon {
    constructor(ctx) {
        this.ctx = ctx;
        this.map = null;
        this.maxPath = null;
        this.spawnPoint = null;
        this.spawnPoints = null;
        this.maxY = 6;
        this.maxX = 6;

        this.actualRoom = null;
    }

    init() {
        this.genererMap();
        this.spawnPoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];
        this.actualRoom = this.map[this.spawnPoint.y][this.spawnPoint.x];
    }

    genererMap() {
        this.map = new Array(this.maxY+1);
        this.maxPath = 6;
        this.spawnPoints = [];
        for (let i = 0; i < this.map.length; i++) {
            this.map[i] = new Array(this.maxX+1);
            for (let j = 0; j < this.map[i].length; j++) {
                this.map[i][j] = 0;
            }
        }
        
        var x = Math.floor(Math.random() * (this.maxX-1))+1; // -1 +1 Pour éviter que le boss soit sur un bord de la map sinon on a de grandes chances d'avoir une map en long
        var y = Math.floor(Math.random() * (this.maxY-1))+1;
        this.map[y][x] = new Room(this.ctx, x, y, true);
        this.generateRoom(x, y, 0);
    }

    generateRoom(x, y, path) {
        const parent = this.map[y][x];
        var direction = Math.floor(Math.random() * 4);
        var nbRoom = 0; 
        for (let i=0;i<4;i++) {
            if (nbRoom>0 && this.map[y][x]==2) {
                return;
            }
            if (path+1>this.maxPath) {
                this.spawnPoints.push({x: x, y: y});
                return;
            }
            if (Math.floor(Math.random() * (1+(3*nbRoom)))==0) {
                switch (direction%4) {
                    case 0:
                        if (x<this.maxX && this.map[y][x+1]==0) {
                            this.addRoom(parent, x+1, y, path+1);
                            nbRoom++;
                        };
                        break;
                    case 1:
                        if (y<this.maxY && this.map[y+1][x]==0) {
                            this.addRoom(parent, x, y+1, path+1);
                            nbRoom++;
                        };
                        break;
                    case 2:
                        if (x>0 && this.map[y][x-1]==0) {
                            this.addRoom(parent, x-1, y, path+1);
                            nbRoom++;
                        }
                        break;
                    case 3:
                        if (y>0 && this.map[y-1][x]==0) {
                            this.addRoom(parent, x, y-1, path+1);
                            nbRoom++;
                        }
                        break;
                }
            }
            direction++;
        }
    }

    addRoom(parent, x, y, path) {
        this.map[y][x] = new Room(this.ctx, x, y);
        this.generateRoom(x, y, path);
    }

    render() {
        this.actualRoom?.render();
    }


}