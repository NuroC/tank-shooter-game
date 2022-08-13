

class Player {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = {
            x: 0,
            y: 0
        };
        this.speedMultiplier = 1.056;

        this.velocity = {
            x: 0,
            y: 0
        };
    }
    draw(ctx, camera) {
        this.update();
        let x = camera.getPosOnScreen(this.x, this.y).x;
        let y = camera.getPosOnScreen(this.x, this.y).y;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, 2 * Math.PI);

        ctx.fillStyle = "red";
        ctx.fill();
    }
    update() {
        this.x += this.speed.x * this.speedMultiplier + this.velocity.x;
        this.y += this.speed.y * this.speedMultiplier + this.velocity.y;

        this.velocity.x = this.speed.x / 5;
        this.velocity.y = this.speed.y / 5

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

}   

module.exports = Player;