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

