export default class Map {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.grid = null;
    }

    loadMap(grid) {
        this.grid = grid;
    }

    render() {

        
    }

}