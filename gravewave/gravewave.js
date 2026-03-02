const canvas = document.getElementById("canvas");
const brush = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let time = 0;
const frequency = 0.005;
const speed = 0.1;
const amplitude = Math.random() * 100;

const drawCircle = (x, y) => {
    brush.beginPath();
    brush.arc(x, y, 150, 0, Math.PI * 2);
    brush.fillStyle = "black";
    brush.fill();

    brush.strokeStyle = "#FFD700";
    brush.lineWidth = 3;
    brush.shadowColor = "#FFD700";
    brush.shadowBlur = 15;
    brush.stroke();
};

const rocketball = (x, y) => {
    brush.beginPath();
    brush.arc(x, y, 20, 0, Math.PI * 2); // ✅ fixed: arc() not circle()
    brush.fillStyle = "white";            // ✅ fixed: fillStyle not fillstyle
    brush.strokeStyle = "white";
    brush.fill();                         // ✅ fixed: actually draw the fill
    brush.stroke();                       // ✅ fixed: actually draw the stroke
};

const wavegenerator = () => {
    brush.clearRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;

    const circleX = canvas.width;
    const circleY = centerY + Math.sin(circleX * frequency + time) * amplitude;

    drawCircle(circleX, circleY);

    brush.beginPath();
    brush.moveTo(canvas.width, centerY);

    for (let x = canvas.width; x >= 0; x--) {
        const y = centerY + Math.sin(x * frequency + time) * amplitude;
        brush.lineTo(x, y);
    }

    brush.strokeStyle = "#FFD700";
    brush.lineWidth = 10;
    brush.shadowColor = "#FFD700";
    brush.shadowBlur = 15;
    brush.stroke();

    rocketball(canvas.width / 4, canvas.height / 2);
    drawCircle(canvas.width, canvas.height / 2);

    time += speed;
    requestAnimationFrame(wavegenerator);
};

wavegenerator();