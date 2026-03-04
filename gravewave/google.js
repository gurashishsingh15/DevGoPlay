const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// Ball object
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  speed: 5,
  movingLeft: false,
  movingRight: false
};

// Key controls
window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft")  ball.movingLeft = true;
  if (event.code === "ArrowRight") ball.movingRight = true;
});

window.addEventListener("keyup", (event) => {
  if (event.code === "ArrowLeft")  ball.movingLeft = false;
  if (event.code === "ArrowRight") ball.movingRight = false;
});

// Update ball in your game loop
function updateBall() {
  if (ball.movingLeft)  ball.x -= ball.speed;
  if (ball.movingRight) ball.x += ball.speed;

  // Keep ball within canvas bounds
  ball.x = Math.max(ball.radius, Math.min(canvas.width - ball.radius, ball.x));
}

// Draw ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#00f0ff";
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// In your game loop
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateBall();
  drawBall();
  requestAnimationFrame(loop);
}