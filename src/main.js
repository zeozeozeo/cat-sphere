const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// update size when the window is resized
var sphereRadius,
    perspective = 0;
const CAT_RADIUS = 25;
const MAX_CATS = 500;
const CATS_PER_FRAME = 5;

function updateSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    sphereRadius = Math.min(canvas.width, canvas.height) * 0.5;
    perspective = canvas.width * 0.8;
}

function emojiToTexture(emoji) {
    const emojiCanvas = document.createElement("canvas");
    const emojiCtx = emojiCanvas.getContext("2d");
    emojiCanvas.width = 60;
    emojiCanvas.height = 60;
    emojiCtx.textAlign = "center";
    emojiCtx.textBaseline = "middle";
    emojiCtx.font = "54px serif";
    emojiCtx.fillText(emoji, 30, 35);
    return emojiCanvas;
}

const EMOJIS = [
    emojiToTexture("🐈"),
    emojiToTexture("🐱"),
    emojiToTexture("😿"),
    emojiToTexture("🙀"),
    emojiToTexture("😾"),
    emojiToTexture("😹"),
    emojiToTexture("😼"),
    emojiToTexture("😺"),
    emojiToTexture("😽"),
    emojiToTexture("😸"),
    // emojiToTexture("🐕"), // 🙀
];

var cats = [];

class Cat {
    constructor() {
        this.theta = Math.random() * 2 * Math.PI;
        this.phi = Math.acos(Math.random() * 2 - 1);
        this.texture = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.radius = Math.random() * (sphereRadius * 0.2) + sphereRadius * 0.8;

        this.projX = 0;
        this.projY = 0;
        this.projScale = 0;

        TweenMax.to(this, 40, {
            theta: this.theta + Math.PI * 2,
            repeat: -1,
            ease: Power0.easeNone,
        });
    }

    // project 🐈 to screen position
    project() {
        this.x = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
        this.y = this.radius * Math.cos(this.phi);
        this.z =
            this.radius * Math.sin(this.phi) * Math.sin(this.theta) +
            this.radius;

        this.projScale = perspective / (perspective + this.z);
        this.projX = this.x * this.projScale + canvas.width / 2;
        this.projY = this.y * this.projScale + canvas.height / 2;
    }

    // RENDER THE CATER 🐈🐈🐈
    draw() {
        ctx.drawImage(
            this.texture,
            this.projX - CAT_RADIUS,
            this.projY - CAT_RADIUS,
            CAT_RADIUS * 2 * this.projScale,
            CAT_RADIUS * 2 * this.projScale
        );
    }
}

function resetCats() {
    cats = [];
    for (let i = 0; i < catsAmount; i++) {
        cats.push(new Cat());
    }
}

function createCats(amount) {
    for (let i = 0; i < amount; i++) {
        cats.push(new Cat());
    }
}

function killSomeCat() {
    cats.splice(Math.floor(Math.random() * cats.length), 1);
}

var doCreateCats = true;
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (doCreateCats) {
        createCats(CATS_PER_FRAME);
        if (cats.length > MAX_CATS) {
            doCreateCats = false;
        }
    } else if (cats.length > 0) {
        for (var i = 0; i < CATS_PER_FRAME; i++) {
            killSomeCat();
        }
    } else {
        doCreateCats = true;
    }

    // update screen position of each cat
    for (var i = 0; i < cats.length; i++) {
        cats[i].project();
    }

    // sort cats by Z (scale)
    cats.sort((a, b) => {
        return a.projScale - b.projScale;
    });

    // draw each cat
    for (var i = 0; i < cats.length; i++) {
        cats[i].draw();
    }

    window.requestAnimationFrame(render);
}

updateSize();
window.addEventListener("resize", updateSize);
window.requestAnimationFrame(render);
