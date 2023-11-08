import './style.css'

let catImg = document.getElementById('catImg');
let cat = document.getElementById('cat');
const container = document.getElementById('game-container');
const score = document.getElementById("score");
const bgDiv = document.getElementById('bg');
const overDiv = document.getElementById('game-over');
const restartButton = document.getElementById('restart');
import fs from 'fs';
let bg1 = document.getElementById('bg1');
let bg2 = document.getElementById('bg2');
let hs = 0;
let points;
let jumpInt;

const lastObstaclePositions = Array(8).fill(0);

let isJumping = false;
let gameStatus = "home";
function jump() {
  if (!isJumping) {
    isJumping = true;
    let g = 0.004; //px/ms sq
    let u = 1.5; //px/ms
    let y = 10; //px
    let t = 0; //ms

    jumpInt = setInterval(()=>{
        t = t + 10;
        y = u*t-0.5*g*t*t;
        catImg.style.bottom = `calc(${y}px + 10vh)`
        if(y === 0 || y  < 0){
            catImg.style.bottom = `10vh`;
            isJumping = false;
            clearInterval(jumpInt);
        }
    }, 10)
  }
}

let theta = 0;

function startGame() {
    restart()
    let vx = 20;
  let scoreInterval = setInterval(()=>{
    points++
    score.innerHTML = `<div style="text-align: left; width: 175px">Highest: ${hs}</div> <div style="text-align: center; width: 50px"> | </div> <div style="text-align: right; width: 175px">Score: ${points}</div>`;
  }, 4000/vx)
  
  let c = 0;
  let runInterval = setInterval(()=>{
    if(!isJumping){
      c++
      cat.src = `./Assets/Cat/${c}.svg`;
      if(c===8) c = 0;
    }
  }, 1600/vx)

  let gameInterval = setInterval(() => {
    const runnerRect = catImg.getBoundingClientRect();
    const runnerX = runnerRect.left + runnerRect.width / 2;
    const runnerY = runnerRect.top + runnerRect.height / 2;
    const runnerRadius = runnerRect.width / 2;

    // Move the obstacle
    if(points > 55) vx = 24
    if(points > 120) vx = 28
    if(points > 200) vx = 32
    if(points > 320) vx = 40
    if(points > 500) vx = 48
    for(let i = 1; i < 10; i++){
      let obstacle = document.getElementById(i);
      
      let obstaclePosition = parseInt(getComputedStyle(obstacle).right);
      if (obstaclePosition < window.innerWidth) {
        obstacle.style.right = obstaclePosition + vx + "px";
      } else {
// Reset the obstacle

    // Collect all obstacles into an array
const obstacles = Array.from(document.querySelectorAll(".obstacleDiv"));

// Reset the positions of all obstacles
        resetObstacle(obstacle, obstacles)
      }
  
      // Check for collision
        const obstacleRect = obstacle.getBoundingClientRect();
        const obstacleX = obstacleRect.left + obstacleRect.width / 2;
        const obstacleY = obstacleRect.top + obstacleRect.height / 2;

        const dx = runnerX - obstacleX;
        const dy = runnerY - obstacleY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < runnerRadius + obstacleRect.width / 2) {
          clearInterval(gameInterval);
          clearInterval(scoreInterval);
          clearInterval(runInterval);
          clearInterval(jumpInt);
          gameStatus = "restart";
          overDiv.style.display = "block";
          restartButton.focus();
          document.querySelector('#finalScore').innerHTML = "Score: " + points;
          container.style.backgroundImage = "url('Assets/background.svg'), linear-gradient(#001d28, #001d28), url('Assets/background-ani.svg')"
      }
    }
     //Move bg
     
     let bg1Left = parseInt(getComputedStyle(bg1).left);
     let bg2Left = parseInt(getComputedStyle(bg2).left);
     bg1.style.left = bg1Left - vx + "px";
     bg2.style.left = bg2Left - vx + "px";
 
     const bg1Right = bg1Left + bg1.offsetWidth;
     const bg2Right = bg2Left + bg2.offsetWidth;
 
     // Check if the first div is off the screen and reset its position
     if (bg1Right < -3) {
         bg1.style.left = (bg2Right - vx -3) + "px";
     }
 
     // Check if the second div is off the screen and reset its position
     if (bg2Right < -3) {
         bg2.style.left = (bg1Right - vx - 3) + "px";
     }
  }, 40);
}
function restart(){
  gameStatus = "running";
  isJumping = false;
  catImg.style.bottom = "10vh"
  overDiv.style.display = "none"
  restartButton.blur()
  container.style.backgroundImage = `url('Assets/background-ani.svg?${Date.now()}')`;
  points = 0;

    // Collect all obstacles into an array
const obstacles = Array.from(document.querySelectorAll(".obstacleDiv"));
// Reset the positions of all obstacles
for (const obstacle of obstacles) {
  resetObstacle(obstacle, obstacles);
}
    cat.src = `./Assets/Cat/1.svg`
}

document.addEventListener("keydown", (event) => {
  if ((event.key === " " || event.key === "ArrowUp") && gameStatus === "running") jump()
});

restartButton.addEventListener("click", ()=>{
  if(gameStatus === "restart" || gameStatus === "home") startGame()
})

// Function to check if there's an obstacle within +/- range pixels of the given position
function isObstacleWithinRange(position, obstacles) {
  const range = 700;
  for (const obstacle of obstacles) {
    const obstaclePosition = parseInt(getComputedStyle(obstacle).right);
    if (Math.abs(obstaclePosition - position) < range) {
      return true;
    }
  }
  return false;
}

// Function to reset the position of an obstacle, ensuring it's at least 1000 pixels apart from others
function resetObstacle(obstacle, obstacles) {
  let x = -Math.random() * 10000 - 50;
  
  while (isObstacleWithinRange(x, obstacles)) {
    x = x - 700;
  }
  
  obstacle.style.right = x + "px";
}

window.onload = () => {
  score.innerHTML = `
  <div style="text-align: left; width: 175px">Highest: ${hs}</div>
  <div style="text-align: center; width: 50px"> | </div>
  <div style="text-align: right; width: 175px">Score: 0</div>
`
restartButton.focus()
}