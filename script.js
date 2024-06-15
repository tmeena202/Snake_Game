// Define Html elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highscore");

// Define game variable
// this var represent the position of snake
// for now it is just a var
// array that contain object
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
// generateFood() create food at random location
let food = generateFood();
let highScore = 0;
let direction = "left";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

//Draw game map, snake, food
function draw() {
  // game start with empty board with nothing on it
  board.innerHTML = "";
  // after starting we create snake and then food
  drawSnake();
  drawFood();
  updateScore();
}

//Draw snake
function drawSnake() {
  // Learn about forEach
  // forEach will just run a function once for each element in Array.
  // Just iterate all element in array once and do something
  // Snake var refers to array that contain obj. So it will iterate that.
  snake.forEach((segment) => {
    // segment = {x:10, y:10}
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumnStart = position.x;
  element.style.gridRowStart = position.y;
}

// testing draw Function
// draw();

function drawFood() {
  const foodElement = createGameElement("div", "food");
  setPosition(foodElement, food);
  board.appendChild(foodElement);
}

function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Moving the snake
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case "right":
      head.x++;
      break;
    case "up":
      head.y--;
      break;
    case "left":
      head.x--;
      break;
    case "down":
      head.y++;
      break;
  }

  snake.unshift(head);
  console.log(snake);

  // snake.pop();

  if (head.x === food.x && head.y == food.y) {
    /* again this line because once the generated food is eaten
     we have to again regerate it at random loc. and store it.
     if this line is not present then food will be created once randomly
     and fixed in one location even after it eaten. */
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      console.log("setInterval 2 running it again and again");
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

// Test moving
// setInterval(() => {
//   move();
//   draw();
// }, 200);

//Start game function
function startGame() {
  gameStarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    console.log("setInterval 1 running it again and again");
    /* Move() moves the snake in default value "right"
    and check snake and food in same location that means 
    it is eaten or not */
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// keypress event listener
function handleKeyPress(event) {
  if (!gameStarted && (event.code === "Space" || event.key === " ")) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  }
}

document.addEventListener("keydown", handleKeyPress);

function increaseSpeed() {
  console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}
