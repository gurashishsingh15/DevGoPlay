const canvas = document.getElementById("canvas");
const brush = canvas.getContext("2d");

//canvas size setup
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let switchValue = true;
let time = 0;//frame rate is set 
const frequency = 0.005; 
const speed = 0.05;//speed of the wave
let amplitude = 0;
const AMPLITUDE_LIMIT = 150; // max amplitude (pixels)
let jitter = 100;//the starting point of the rocket ball is set to be at down of the wave
const JITTER_LIMIT = 100; // max absolute jitter (pixels)      


//planet system design system
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


//rocketball system
const rocketball = (x, y) => {
    brush.beginPath();
    brush.arc(x, y, 10, 0, Math.PI * 2);
    brush.fillStyle = "white";
    brush.fill();
};


    window.addEventListener("keyup", (event) => {
    if(event.code === "ArrowUp"){
        jitter = Math.min(JITTER_LIMIT, jitter + 200);
    }//makes the rocket ball move up when the up arrow key is released, and move down when the down arrow key is released, with limits to prevent it from going too far.
});
window.addEventListener("keydown", (event) => {
    if(event.code === "ArrowDown"){ 
        jitter = Math.max(-JITTER_LIMIT, jitter - 200);
    }
});//makes the rocket ball move up when the up arrow key is released, and move down when the down arrow key is released, with limits to prevent it from going too far.


const wavegenerator = () => {
    brush.clearRect(0, 0, canvas.width, canvas.height);//the rate of brush is set x, y, width/height of canvas
    //design for the wave

    if (amplitude <= AMPLITUDE_LIMIT) {
        amplitude += 0.2; // increase amplitude gradually
    }


    const centerY = canvas.height / 2;
    brush.beginPath();
    brush.lineWidth = 3;
    brush.shadowBlur = 2;
    brush.strokeStyle = "#FFD700";
    brush.shadowColor = "#FFD700";
    brush.fillStyle = "#FFD700";
    //break down of wave generationg 
    for (let x = 0; x <= canvas.width; x += 2)/*it is the initializing of the dot mapping of the wave 
    where x start from the 0 posionion i.e left end and continously add  */ {
        const y = centerY + Math.sin(x * frequency + time) * amplitude;//dotting track and if + is added then it will flow +ve of the x axis
        if (x === 0) {
            brush.moveTo(x, y);
        }//check if th brush is starting from 0
        else {
            brush.lineTo(x, y);//this draws the line on the trajectory that was mentioned above....
        }
 
    }
    brush.stroke();


//rocket ball
    const ballX = canvas.width / 4;
    // compute y and ensure the ball stays within canvas (radius 10)
    const rawBallY = centerY + Math.sin(ballX * frequency - time) * amplitude + jitter;
    const ballY = Math.max(10, Math.min(canvas.height - 10, rawBallY));
    rocketball(ballX, ballY);


    //calling drawmoon function
    drawMoon(canvas.width, canvas.height/2);


    time += speed; 
    requestAnimationFrame(wavegenerator);
};

wavegenerator();