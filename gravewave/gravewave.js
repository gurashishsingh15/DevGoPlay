const canvas = document.getElementById("canvas");
const brush = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let time = 0;
const frequency = 0.005;
const speed = 0.1;
const amplitude = Math.random() * 200;

const drawCircle = (x, y) => {
    brush.beginPath();
    brush.arc(
        x,
        y,
        20,              // smaller radius looks better
        0,               // start angle
        Math.PI * 2      // full circle
    );
    brush.fillStyle = "white";  // fill instead of stroke
    brush.fill();
};

const wavegenerator = () => {
    brush.clearRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;

    // ✅ calculate wave Y at the right edge of screen
    const circleX = canvas.width;
    const circleY = centerY + Math.sin(circleX * frequency + time) * amplitude;

    // ✅ pass position into drawCircle
    drawCircle(circleX, circleY);

    brush.beginPath();
    brush.moveTo(canvas.width, centerY);

    for (let x = canvas.width; x >= 0; x--) {
        const y = centerY + Math.sin(x * frequency + time) * amplitude;
        brush.lineTo(x, y);
    }

    brush.strokeStyle = "white";
    brush.lineWidth = 10;
    brush.stroke();

    time += speed;
    requestAnimationFrame(wavegenerator);
};

wavegenerator();