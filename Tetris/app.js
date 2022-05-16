document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));

  const scoreDisplay = document.querySelector("#score");

  let startButton = document.querySelector("#start_button");
  const width = 10;
  let timerId;
  let fast;
  let nextRandom = 0;
  let score = 0;
  /**/

  const colors = ["#3a0ca3", "#f20089", "#72efdd", "#2d00f7", "0077b6"];

  const lshape = [
    [1, width + 1, width * 2 + 1, 2],
    [2, width + 2, width * 2 + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 2],
    [width * 2, width, width + 1, width + 2],
  ];

  const zshape = [
    [width + 1, width * 2 + 1, width + 2, 2],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [1, width + 1, width, width * 2],
    [0, 1, width + 1, width + 2],
  ];

  const tshape = [
    [0, 1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, 2, width * 2 + 2, 2],
    [0, width, width * 2, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, width * 2, width * 2 + 2, width * 2],
  ];

  const blockshape = [
    [0, 1, width + 1, width],
    [1, 2, width + 1, width + 2],
    [0, 1, width + 1, width],
    [1, 2, width + 1, width + 2],
  ];

  const lineshape = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [0, 1, 2, 3],
    [2, width + 2, width * 2 + 2, width * 3 + 2],
  ];

  //all Tetramino shapes array
  const shapes = [lshape, tshape, zshape, blockshape, lineshape];

  let currentPosition = 4;
  let currentRotation = 0;
  let random = Math.floor(Math.random() * shapes.length);

  let current = shapes[random][currentRotation];

  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("sq_color");
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  function unDraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("sq_color");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }

  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }

  document.addEventListener("keyup", control);

  function moveDown() {
    unDraw();
    currentPosition += width;
    draw();
    freeze();
  }
  /*function moveDownFast() {
    unDraw();
    currentPosition += width + 10;
    draw();
    freeze();
  }*/
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + width + index].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * shapes.length);

      current = shapes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  function moveLeft() {
    unDraw();
    const leftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!leftEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  function moveRight() {
    unDraw();
    const rigthEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    if (!rigthEdge) currentPosition += 1;
    if (
      current.forEach((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  function rotate() {
    unDraw();
    currentRotation++;
    if (currentRotation === 4) {
      currentRotation = 0;
    }
    current = shapes[random][currentRotation];

    draw();
  }

  //for mini grid

  const displaySquares = document.querySelectorAll(".mini_grid div");
  const displayWidth = 4;
  const displayIndex = 0;

  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tshape
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //z
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],

    //oTetromino
  ];

  /*function displayShape() {
    displaySquares.forEach((square) => square.classList.remove("sq_color"));
    //adding tetromino to the mini grid

    upNextTetromino[nextRandom].forEach((index) =>
      displaySquares[index + displayIndex].classList.add("sq_color")
    );
  }*/
  function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach((square) => {
      square.classList.remove("sq_color");
      square.style.backgroundColor = "";
    });
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("sq_color");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }

  startButton.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 400);
      /*fast = setInterval(moveDownFast, 100);*/
      nextRandom = Math.floor(Math.random() * 5);
      displayShape();
    }

    /*else if (e.keyCode === 40) {
      draw();
      timerId = setInterval(moveDownFast, 100);
      nextRandom = Math.floor(Math.random() * 5);
      displayShape();
    } */
  });
  /*
  }*/

  /*function addScore(){

    for(let i=0;i<199;i+=width){
      const row=[i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]
      if(row.every(index => squares[index].classList.contains."taken")){
        score+=10;

      }
    }
  }*/
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("sq_color");
          squares[index].style.backgroundColor = "";
        });
        let squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = " GAME OVER";
      clearInterval(timerId);
    }
  }
  function high() {
    if (score >= highScore) {
      highScore += score;
    }
  }
});
