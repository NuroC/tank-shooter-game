class Canvas {
    constructor(width, height) {
        this.canvas = document.getElementById('game-canvas');
        this.canvas.width = width;
        this.canvas.height = height;
    }
    getContext() {
        return this.canvas.getContext('2d');
    }
    setAspects(width, height) {
        this.canvas.width = width;
        this.canvasheight = height;
    }
    getAspects() {
        return {
            width: this.canvas.width,
            height: this.height
        }
    }
}

module.exports = Canvas;