export default class Dungeon {
    constructor() {
        this.map = null;
        this.maxPath = null;
        this.maxY = 6;
        this.maxX = 6;
        this.spawnPoints = null;
    }

    genererMap() {

        console.log("AJOUTER LES ROOM POUR NE PAS JUSTE METTRE DES 1 ET AJOUTER UNE PORTE QUE ENTRE LE PARENT ET L'ENFANT ET PAS LES AUTRES ROOMS");

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
        this.map[y][x] = 2;
        this.generateRoom(x, y, 0);

        console.log(this.spawnPoints);
        console.log(this.spawnPoints.length);
    }

    generateRoom(x, y, path) {
        var direction = Math.floor(Math.random() * 4);
        var nbRoom = 0; 
        for (let i=0;i<4;i++) {
            if (nbRoom>0 && this.map[y][x]==2) {
                return;
            }
            console.log(nbRoom);
            if (path+1>this.maxPath) {
                this.spawnPoints.push({x: x, y: y});
                return;
            }
            if (Math.floor(Math.random() * (1+(3*nbRoom)))==0) {
                switch (direction%4) {
                    case 0:
                        if (x<this.maxX && this.map[y][x+1]==0) {
                            this.map[y][x+1] = 1;
                            this.generateRoom(x+1, y, path+1);
                            nbRoom++;
                        };
                        break;
                    case 1:
                        if (y<this.maxY && this.map[y+1][x]==0) {
                            this.map[y+1][x] = 1;
                            this.generateRoom(x, y+1, path+1);
                            nbRoom++;
                        };
                        break;
                    case 2:
                        if (x>0 && this.map[y][x-1]==0) {
                            this.map[y][x-1] = 1;
                            this.generateRoom(x-1, y, path+1);
                            nbRoom++;
                        }
                        break;
                    case 3:
                        if (y>0 && this.map[y-1][x]==0) {
                            this.map[y-1][x] = 1;
                            this.generateRoom(x, y-1, path+1);
                            nbRoom++;
                        }
                        break;
                }
            }
            direction++;
        }
    }

    showMap() {
        console.log(this.map);
    }

}