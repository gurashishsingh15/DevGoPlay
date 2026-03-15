const canvas = document.getElementById("canvas");
const brush = canvas.getContext("2d");
const video = document.getElementById("video"); 

// canvas setup
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

//gameover
let gameover =false ;

// wave system
let time = 0;
const frequency = 0.004;
const speed = 0.05;

let amplitude = 0;
const AMPLITUDE_LIMIT = 100;

// rocket control
let jitter = 100;
const JITTER_LIMIT = 100;
let goingUp = true;
// meteor
let meteorX1 = canvas.width;
let meteorX2 = canvas.width;
let meteorY1 = canvas.height / 2 - 200 + Math.random() * 200;
let meteorY2 = canvas.height / 2 + Math.random() * 200;


const metor1speed = Math.random() * 20+5;
const metor2speed = Math.random() * 20+8;

const colliion = (rocketX, rocketY, meteorX, meteorY) => {
    let distance = Math.sqrt((rocketX - meteorX) ** 2 + (rocketY - meteorY) ** 2);
    if (distance < 50 && gameOver === false) {
        gameOver = true;
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
    brush.arc(x, y, 40, 0, Math.PI * 2);
    brush.fillStyle = "grey";
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
    if (event.code === "Space") {
        goingUp = !goingUp;
        
        if (goingUp === true) {
            jitter = Math.min(JITTER_LIMIT, jitter + 200);
        }
        if (goingUp === false) {
            jitter = Math.max(-JITTER_LIMIT, jitter - 200);
        }
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
    meteorball(meteorX2, meteorY2);
    meteorball(meteorX1, meteorY1);

    meteorX2 -= metor2speed;
    meteorX1 -= metor1speed;

    if (meteorX1 < 0){
        meteorX1 = canvas.width
        meteorY1 = canvas.height / 2 -200 + Math.random() * 200;
    }

    if (meteorX2 < 0) {
        meteorX2 = canvas.width
        meteorY2 = canvas.height / 2 + Math.random() * 200;   
    }

    // 🚀 Rocket ball
    const ballX = canvas.width / 4;
    const rawBallY = centerY + Math.sin(ballX * frequency - time) * amplitude + jitter;
    rocketball(ballX, rawBallY);

    // 🌕 Moon
    drawMoon(canvas.width, canvas.height / 2);

    // ✅ check both meteors
    colliion(ballX, rawBallY, meteorX1, meteorY1);
    colliion(ballX, rawBallY, meteorX2, meteorY2);

    time += speed;
    requestAnimationFrame(animate);
};

animate();