(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Canvas = require("./structure/canvas");
const Player = require("./structure/player");
const Camera = require("./structure/Camera");
const MathHelper = require("./structure/MathHelper");

const camera = new Camera(0, 0);
const canvas = new Canvas(window.innerWidth, window.innerHeight);
const player = new Player(100, 100, 10);

const ctx = canvas.getContext();

const defaultTransform = new DOMMatrixReadOnly([1, 0, 0, 1, 0, 0])

let delta = 0;
let lastRender = Date.now();

let scale;

let currentTransform = new DOMMatrixReadOnly([1, 0, 0, 1, 0, 0])
let keys = {};


document.addEventListener("keydown", function (e) {
    if (e.key == 'w') {
        player.speed.y = -1;
    } else if (e.key == 'a') {
        player.speed.x = -1;
    } else if (e.key == 's') {
        player.speed.y = 1;
    } else if (e.key == 'd') {
        player.speed.x = 1;
    }
})

document.addEventListener("keyup", function (e) {
    if (e.key == 'w') {
        player.speed.y = 0;
    } else if (e.key == 'a') {
        player.speed.x = 0;
    } else if (e.key == 's') {
        player.speed.y = 0;
    } else if (e.key == 'd') {
        player.speed.x = 0;
    }
})

window.addEventListener("resize", function (e) {
    let viewport = camera.getViewport();
    canvas.setAspects(window.innerWidth, window.innerHeight);
    scale = Math.max(window.innerWidth / viewport.width, window.innerHeight / viewport.height);
    currentTransform = new DOMMatrixReadOnly([scale, 0, 0, scale, (window.width - viewport.width * scale) / 2, (window.height - viewport.height * scale) / 2]);
    ctx.setTransform(currentTransform);
})

let trees = [
    {
        x: 100,
        y: 100,
    }
]

function render() {
    delta = Date.now() - lastRender;
    lastRender = Date.now();
    let viewport = camera.getViewport();

    ctx.setTransform(defaultTransform);
    ctx.clearRect(0, 0, viewport.width, viewport.height);
    ctx.setTransform(currentTransform);

    // render grid
    canvas.renderGrid(camera, viewport, 18);

    const distance = MathHelper.getDistance(camera.x, camera.y, player.x, player.y); 
    const direction = MathHelper.getDirection(camera.x, camera.y, player.x, player.y);
    const speed = Math.min(distance * 0.01 * delta, distance); 
    if (distance > 0.05) { 
        camera.x += speed * Math.cos(direction); 
        camera.y += speed * Math.sin(direction);
    } else { 
        camera.x = player.x;
        camera.y = player.y;
    }

    player.draw(ctx, camera);

    ctx.beginPath();
    ctx.rect(0, 0, viewport.width, viewport.height);
    ctx.strokeStyle = "black";
    ctx.stroke();


    window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);


},{"./structure/Camera":2,"./structure/MathHelper":3,"./structure/canvas":4,"./structure/player":5}],2:[function(require,module,exports){
class Camera {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }
    getRenderOffset() {
        return {
            x: this.x - (this.viewport.width / 2),
            y: this.y - (this.viewport.height / 2)
        }
    }
    getPosOnScreen(x, y) {
        const defaultOffset = this.getRenderOffset();
        return {
            x: x - defaultOffset.x,
            y: y - defaultOffset.y
        }
    }
    getViewport() {
        return this.viewport;
    }
    setViewPort(width, height) {
        this.viewport.width = width;
        this.viewport.height = height;
    }
}

module.exports = Camera;
},{}],3:[function(require,module,exports){
class MathHelper {
    static getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    static getDirection(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }
}

module.exports = MathHelper;
},{}],4:[function(require,module,exports){
class Canvas {
    constructor(width, height) {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
    }
    getContext() {
        return this.ctx
    }
    setAspects(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
    getAspects() {
        return {
            width: this.canvas.width,
            height: this.height
        }
    }
    renderGrid(camera, viewport, scale) {
        let ctx = this.ctx;
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#000000';
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        for (var x = -camera.x; x < viewport.width; x += viewport.height / scale) {
            if (x > 0) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, viewport.height);
            }
        }
        for (var y = -camera.y; y < viewport.height; y += viewport.height / scale) {
            if (y > 0) {
                ctx.moveTo(0, y);
                ctx.lineTo(viewport.width, y);
            }
        }
        ctx.stroke()
    }
    renderCircle(x, y, radius, color) {
        let ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }
    renderText(text, x, y, color, font) {
        let ctx = this.ctx;
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.fillText(text, x, y);
    }
    renderBackground(viewport) {
        let ctx = this.ctx;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.rect(0, 0, viewport.width, viewport.height);
        ctx.fillStyle = "#b0bec2";
        ctx.fill();
    }
}

module.exports = Canvas;
},{}],5:[function(require,module,exports){


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
},{}]},{},[1]);
