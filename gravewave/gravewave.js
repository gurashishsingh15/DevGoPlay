const canvas = document.getElementById("canvas");
const brush = canvas.getContext("2d");
const video = document.getElementById("video"); 

// canvas setup
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// wave system
let time = 0;
const frequency = 0.004;
const speed = 0.05;

let amplitude = 0;
const AMPLITUDE_LIMIT = 100;

// rocket control
let jitter = 100;
const JITTER_LIMIT = 100;

// meteor
let meteorX1 = 0;
let meteorX2 = 0;

const colliion = (rocketX, rocketY, meteorX, meteorY) => {
    let distance = Math.sqrt((rocketX - meteorX) ** 2 + (rocketY - meteorY) ** 2);
    if (distance < 40) {
        alert("Collision Detected!");
    }
};

// 🌕 Moon
const drawMoon = (x, y) => {
    brush.save();
    brush.beginPath();
    brush.arc(x, y, 175, 0, Math.PI * 2);
    brush.fillStyle = "black";
    brush.shadowColor = "#FFD700";
    brush.shadowBlur = 30;
    brush.fill();
    brush.lineWidth = 2;
    brush.stroke();
    brush.restore();
};

// 🌠 Meteor
const meteorball = (x, y) => {
    brush.beginPath();
    brush.arc(x, y, 10, 0, Math.PI * 2);
    brush.fillStyle = "white";
    brush.fill();
};

// 🚀 Rocket Ball
const rocketball = (x, y) => {
    brush.beginPath();
    brush.arc(x, y, 10, 0, Math.PI * 2);
    brush.fillStyle = "white";
    brush.fill();
};

// keyboard controls
window.addEventListener("keyup", (event) => {
    if (event.code === "ArrowUp") {
        jitter = Math.min(JITTER_LIMIT, jitter + 200);
    }
});

window.addEventListener("keydown", (event) => {
    if (event.code === "ArrowDown") {
        jitter = Math.max(-JITTER_LIMIT, jitter - 200);
    }
});

// 🌊 Main Animation Loop
const animate = () => {

    // video background
    if (video.readyState >= 2) {
        brush.drawImage(video, 0, 0, canvas.width, canvas.height);
    } else {
        brush.clearRect(0, 0, canvas.width, canvas.height);
    }

    // grow wave amplitude
    if (amplitude <= AMPLITUDE_LIMIT) {
        amplitude += 0.2;
    }

    const centerY = canvas.height / 2;

    // draw wave
    brush.beginPath();
    brush.lineWidth = 3;
    brush.strokeStyle = "#FFD700";
    brush.shadowColor = "#FFD700";
    brush.shadowBlur = 2;

    for (let x = 0; x <= canvas.width; x += 2) {
        const y = centerY + Math.sin(x * frequency + time) * amplitude;
        if (x === 0) {
            brush.moveTo(x, y);
        } else {
            brush.lineTo(x, y);
        }
    }
    brush.stroke();

    // 🌠 Meteor movement
    meteorball(meteorX2, canvas.height / 2 + 100);
    meteorball(meteorX1, canvas.height / 2 - 100);

    meteorX2 -= 10;
    meteorX1 -= 5;

    if (meteorX1 < 0) meteorX1 = canvas.width;
    if (meteorX2 < 0) meteorX2 = canvas.width;

    // 🚀 Rocket ball
    const ballX = canvas.width / 4;
    const rawBallY = centerY + Math.sin(ballX * frequency - time) * amplitude + jitter;
    rocketball(ballX, rawBallY);

    // 🌕 Moon
    drawMoon(canvas.width, canvas.height / 2);

    // ✅ check both meteors
    colliion(ballX, rawBallY, meteorX1, canvas.height / 2 - 100);
    colliion(ballX, rawBallY, meteorX2, canvas.height / 2 + 100);

    time += speed;
    requestAnimationFrame(animate);
};

animate();