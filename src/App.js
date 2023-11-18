// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const initialSnake = [{ x: 2, y: 2 }];
const initialFood = { x: 5, y: 5 };
const gridSize = 10; // Reduced grid size

function App() {
  const [hariUncleFace, setHariUncleFace] = useState(true);
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [lastKeyPress, setLastKeyPress] = useState('ArrowDown');

  const initialDirection = { x: 1, y: 0 }; // Moving right initially
  const [direction, setDirection] = useState(initialDirection);

  const moveSnake = () => {
    setSnake(prevSnake => {
      const newHead = {
        x: (prevSnake[0].x + direction.x + gridSize) % gridSize,
        y: (prevSnake[0].y + direction.y + gridSize) % gridSize
      };

      let newSnake;
      if (newHead.x === food.x && newHead.y === food.y) {
        // Place food at new location
        setFood({
          x: Math.floor(Math.random() * gridSize),
          y: Math.floor(Math.random() * gridSize)
        });
        // Grow the snake
        newSnake = [newHead, ...prevSnake];
        // Change face
        setHariUncleFace(!hariUncleFace);
      } else {
        newSnake = [newHead, ...prevSnake.slice(0, -1)];
      }

      return newSnake;
    });
  };

  const checkCollision = () => {
    const [head] = snake;
    const hitWall = head.x >= gridSize || head.y >= gridSize || head.x < 0 || head.y < 0;
    const hitBody = snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    return hitWall || hitBody;
  };

  const updateGridSize = () => {
    const gameBoard = document.getElementById('game-board');
    const width = gameBoard.clientWidth;
    const height = gameBoard.clientHeight;
    const cellSize = Math.floor(Math.min(width, height) / gridSize);
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;
    gameBoard.style.gridTemplateRows = `repeat(${gridSize}, ${cellSize}px)`;
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (lastKeyPress !== 'ArrowUp') {
            setDirection({ x: -1, y: 0 });
            setLastKeyPress('ArrowUp')
          }
          break;
        case 'ArrowDown':
          if (lastKeyPress !== 'ArrowDown') {
            setDirection({ x: 1, y: 0 });
            setLastKeyPress('ArrowDown')
          }
          break;
        case 'ArrowLeft':
          if (lastKeyPress !== 'ArrowLeft') {
            setDirection({ x: 0, y: -1 });
            setLastKeyPress('ArrowLeft')
          }
          break;
        case 'ArrowRight':
          if (lastKeyPress !== 'ArrowRight') {
            setDirection({ x: 0, y: 1 });
            setLastKeyPress('ArrowRight')
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [direction]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      moveSnake();
      if (checkCollision()) {
        clearInterval(gameLoop);
        // Handle game over scenario here
        console.log("Game Over");
      }
    }, 200);

    return () => clearInterval(gameLoop);
  }, [snake, direction]);


  useEffect(() => {
    window.addEventListener('resize', updateGridSize);
    updateGridSize();

    // Set up key listeners and game loop

    return () => {
      window.removeEventListener('resize', updateGridSize);
    };
  }, []);

  return (
    <div>
      <div className="game-board" id="game-board">
        {Array.from({ length: gridSize }, (_, i) =>
          Array.from({ length: gridSize }, (_, j) => (
            <div key={`${i}-${j}`} className="grid-cell">
              {snake.some(segment => segment.x === i && segment.y === j) && (
                <img src="/sandya-snake.png" alt="Snake" className="food" />
              )}
              {food.x === i && food.y === j && (hariUncleFace === true ? <img src="/hari-food.png" alt="food" className="food" /> : <img src="/priya-food.png" alt="food" className="food" />)}
            </div>
          ))
        )}
      </div>

      <div className="controls">
        <button className="up-button" onClick={() => setDirection({ x: -1, y: 0 })}>&uarr;</button>
        <div className="horizontal-buttons">
          <button className="left-button" onClick={() => setDirection({ x: 0, y: -1 })}>&larr;</button>
          <button className="right-button" onClick={() => setDirection({ x: 0, y: 1 })}>&rarr;</button>
        </div>
        <button className="down-button" onClick={() => setDirection({ x: 1, y: 0 })}>&darr;</button>
      </div>
    </div>
  );
}

export default App;
