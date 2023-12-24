import { useEffect, useState } from "react";
import "./App.css";

const foodColors = ["red", "yellow", "purple", "black"];

const keyDirectionMaping = {
  ArrowLeft: "l",
  ArrowRight: "r",
  ArrowDown: "d",
  ArrowUp: "u",
};
function generateRandomFood() {
  return Math.floor(Math.random() * 81);
}
const SIZE = 9;

function App() {
  const randomIndex = Math.floor(Math.random() * foodColors.length);
  const randomColor = foodColors[randomIndex];
  const [randomFood, setRandomFood] = useState(generateRandomFood());

  const lossNumbersUp = [];
  const lossNumbersLeft = [];
  const lossNumbersRight = [];
  const lossNumbersDown = [];

  for (let i = 0; i <= 9; i++) {
    lossNumbersLeft.push(i * 9);
  }
  for (let i = 0; i <= 8; i++) {
    lossNumbersUp.push(i);
  }
  for (let i = 8; i <= 80; i += 9) {
    lossNumbersRight.push(i);
  }

  for (let i = 70; i <= 79; i++) {
    lossNumbersDown.push(i);
  }

  const [direction, setDirection] = useState("r");
  const [grid, setGrid] = useState(new Array(SIZE * SIZE).fill(""));
  const [snake, setSnake] = useState([0, 1, 2]);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (isGameOver) {
      console.log("game over");
      return;
    }

    const id = setTimeout(() => {
      move();
    }, 1000);
    return () => clearInterval(id);
  }, [snake, direction]);

  function move() {
    const newSnake = [...snake];

    let newHeadIndex;

    switch (direction) {
      case "r":
        newHeadIndex = snake[snake.length - 1] + 1;
        newSnake.shift();
        break;
      case "l":
        newHeadIndex = snake[snake.length - 1] - 1;
        newSnake.shift();
        break;
      case "d":
        newHeadIndex = snake[snake.length - 1] + SIZE;
        newSnake.shift();

        break;
      case "u":
        newHeadIndex = snake[snake.length - 1] - SIZE;
        newSnake.shift();
        break;
    }
    if (newHeadIndex === randomFood) {
      setRandomFood(generateRandomFood());
      newSnake.unshift(newHeadIndex);
    }

    setSnake(newSnake);
    newSnake.push(newHeadIndex);

    if (
      lossNumbersUp.includes(newHeadIndex) &&
      direction === "u" &&
      !lossNumbersUp.includes(randomFood)
    ) {
      setIsGameOver(true);
      return;
    }
    if (
      lossNumbersRight.includes(newHeadIndex) &&
      direction === "r" &&
      !lossNumbersRight.includes(randomFood)
    ) {
      setIsGameOver(true);
      return;
    }
    if (
      lossNumbersLeft.includes(newHeadIndex) &&
      direction === "l" &&
      !lossNumbersLeft.includes(randomFood)
    ) {
      setIsGameOver(true);
      return;
    }

    if (
      lossNumbersDown.includes(newHeadIndex) &&
      direction === "d" &&
      !lossNumbersDown.includes(randomFood)
    ) {
      setIsGameOver(true);
      return;
    }
    if (snake.includes(newHeadIndex)) {
      setIsGameOver(true);
      return;
    }
  }

  function handleKeyDown(ev) {
    setDirection(keyDirectionMaping[ev.key]);
  }

  return (
    <>
      <div tabIndex={0} onKeyDown={handleKeyDown} className="grid-container">
        {grid.map((el, i) => {
          const isSnake = snake.includes(i);

          return (
            <>
              <div className={`cell ${isSnake ? "snake" : ""}`} key={i}>
                {randomFood === i ? (
                  <div
                    className="food"
                    style={{ backgroundColor: randomColor }}
                  ></div>
                ) : (
                  ""
                )}
              </div>
            </>
          );
        })}
      </div>

      <p>{isGameOver && "game over"}</p>
    </>
  );
}

export default App;
