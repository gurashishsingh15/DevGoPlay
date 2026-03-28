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
let goingUp = true;
// meteor
let meteorX1 = canvas.width;
let meteorX2 = canvas.width;
let meteorY1 = canvas.height / 2 - 200 + Math.random() * 200;
let meteorY2 = canvas.height / 2 + Math.random() * 200;

let metorspeed = 5; // Start with a base speed so they move immediately
const MAX_METEOR_SPEED = 25;

//gameover
let gameover =false ;


function scoreboard() {
    brush.font = "20px Arial";
    brush.fillStyle = "white";
    brush.textAlign = "left";
    brush.fillText(`score: ${Math.floor(time)}`, 20, 30);
}   

function gameoverdis(gameover) {
    if (gameover === true) {
        // 1. Semi-transparent black overlay
        brush.fillStyle = "rgba(0, 0, 0, 0.8)"; 
        brush.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Main "Mission Failed" Text
        brush.font = "bold 60px 'Courier New'"; // Added bold for more impact
        brush.fillStyle = "red";
        brush.textAlign = "center";
        brush.textBaseline = "middle"; // Ensures perfect vertical centering
        brush.fillText("MISSION FAILED", canvas.width / 2, canvas.height / 2);

        // 3. Subtext (Instructions)
        brush.font = "20px Arial";
        brush.fillStyle = "white";
        // Shifted down slightly to avoid overlapping the main title
        brush.fillText("Press F5 to Restart the Mission", canvas.width / 2, canvas.height / 2 + 60);

        // Inside gameoverdis()
        brush.fillStyle = "yellow";
        brush.font = "30px Arial";
        brush.fillText(`FINAL SCORE: ${Math.floor(time)}`, canvas.width / 2, canvas.height / 2 + 110);// Inside gameoverdis()
        gameover = false; // Reset gameover to prevent repeated calls
    }
}
const colliion = (rocketX, rocketY, meteorX, meteorY) => {
    let distance = Math.sqrt((rocketX - meteorX) ** 2 + (rocketY - meteorY) ** 2);
    if (distance < 60 && gameover === false) {
        gameover = true;
        gameoverdis(true);
        setTimeout(() => {
            location.reload(); 
        }, 5000);
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

// 🕳️ Crater Creator - Draws small details onto the meteor
const creators = (x, y, radius) => {
    // We draw 3-5 small craters per meteor
    for (let i = 0; i < 4; i++) {
        // Offset them slightly from the center so they spread out
        const cx = x + Math.cos(i) * (radius * 0.4);
        const cy = y + Math.sin(i) * (radius * 0.4);
        const csize = radius * 0.15;

        brush.beginPath();
        brush.arc(cx, cy, csize, 0, Math.PI * 2);
        brush.fillStyle = "rgba(0, 0, 0, 0.3)"; // Darker transparent grey for depth
        brush.fill();
    }
};

function scoreboard() {
    brush.font = "20px Arial";
    brush.fillStyle = "white";
    brush.textAlign = "left";
    brush.fillText(`score: ${Math.floor(time)}`, 20, 30);
}   



// 🌠 Meteor
const meteorball = (x, y) => {
    const radius = 40; 
    // Use Math.floor to ensure 'segments' is a whole number for the loop
    const segments = 7; 
    const steps = (2 * Math.PI) / segments;

    brush.beginPath(); 

    for (let i = 0; i < segments; i++) {
        const angle = i * steps;
        
        // This sin-based offset creates a consistent jagged look
        const offset = Math.sin(i * 1.5) * (radius * 0.3);
        const r = radius + offset;

        const mX = x + Math.cos(angle) * r;
        const mY = y + Math.sin(angle) * r;

        if (i === 0) {
            brush.moveTo(mX, mY);
        } else {
            brush.lineTo(mX, mY);
        }
    }

    brush.closePath(); 
    brush.fillStyle = "grey";
    brush.fill();
    creators(x, y, radius);

    brush.strokeStyle = "white";
    brush.lineWidth = 1;
    brush.stroke();
};
// 🚀 Rocket Ball
const rocketball = (x, y) => {
    const base = 20;   
    const height = 30; 

    // --- 1. THE MAIN BODY (White Rectangle) ---
    brush.beginPath();
    // Start at top-back of the nose cone and draw left
    brush.moveTo(x - height/2, y - base/2);
    brush.lineTo(x - height - 10, y - base/2);
    brush.lineTo(x - height - 10, y + base/2);
    brush.lineTo(x - height/2, y + base/2);
    brush.closePath();
    
    brush.fillStyle = "white";
    brush.fill();
    brush.strokeStyle = "#000000";
    brush.lineWidth = 1;
    brush.stroke();

    // --- 2. THE NOSE CONE (Red Triangle) ---
    brush.beginPath();
    brush.moveTo(x - height/2, y - base/2); // Back-Top
    brush.lineTo(x + height/2, y);          // Front-Tip
    brush.lineTo(x - height/2, y + base/2); // Back-Bottom
    brush.closePath();
    
    brush.fillStyle = "red";
    brush.fill();
    brush.strokeStyle = "#000000";
    brush.stroke();

    // --- 3. THE THRUSTER (Optional "Vibe") ---
    // Let's add a small flame since we have a back-end now!
    brush.beginPath();
    brush.arc(x - height - 12, y, 5, 0, Math.PI * 2);
    brush.fillStyle = "orange";
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
    
    if (gameover === true) {
        gameoverdis(gameover);
        return; 
    }
    brush.clearRect(0, 0, canvas.width, canvas.height);
    //meteor speed increase
   if (metorspeed < MAX_METEOR_SPEED) {
        metorspeed += 0.005; // Gradually gets harder
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

  // 4. Meteor Logic
    meteorball(meteorX1, meteorY1);
    meteorball(meteorX2, meteorY2);

    meteorX1 -= metorspeed;
    meteorX2 -= metorspeed + 2; // Make one slightly faster for variety

    if (meteorX1 < -50) {
        meteorX1 = canvas.width;
        meteorY1 = centerY - 200 + Math.random() * 400;
    }
    if (meteorX2 < -50) {
        meteorX2 = canvas.width;
        meteorY2 = centerY - 200 + Math.random() * 400;
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

    scoreboard()
    

    time += speed;
    requestAnimationFrame(animate);
};

animate();