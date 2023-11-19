// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const initialSnake = [{ x: 2, y: 2 }];
const initialFood = { x: 5, y: 5 };
const gridSize = 10; // Reduced grid size

function App() {
  const [controlsHit, setControlsHit] = useState(0);
  const [hariUncleFace, setHariUncleFace] = useState(true);
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [lastKeyPress, setLastKeyPress] = useState('ArrowDown');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

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
        // Update score
        setScore(prevScore => prevScore + 1);
        // Change face
        setHariUncleFace(!hariUncleFace);
        // Play song
        playAudio();
      } else {
        newSnake = [newHead, ...prevSnake.slice(0, -1)];
      }

      // Check for collision immediately after updating the snake's position
      if (newSnake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true); // Stop the game if there's a collision
      }

      return newSnake;
    });
  };

  const playAudio = () => {
    if (hariUncleFace) {
      let audio = new Audio('https://siyer2.github.io/sandya-snake/appa.mp3');
      audio.play();
    } else {
      let audio = new Audio('https://siyer2.github.io/sandya-snake/amma.mp3');
      audio.play();
    }
  }

  const checkCollision = () => {
    const [head, ...body] = snake;
    return body.some(segment => segment.x === head.x && segment.y === head.y);
  };

  const updateGridSize = () => {
    const gameBoard = document.getElementById('game-board');
    const width = gameBoard.clientWidth;
    const height = gameBoard.clientHeight;
    const cellSize = Math.floor(Math.min(width, height) / gridSize);
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;
    gameBoard.style.gridTemplateRows = `repeat(${gridSize}, ${cellSize}px)`;
  };

  const controlHit = () => {
    if (controlsHit === 0) {
      playAudio();
    }

    setControlsHit(controlsHit + 1);
  }

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
  }, [direction, isGameOver]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      moveSnake();
      if (checkCollision()) {
        clearInterval(gameLoop);
        setIsGameOver(true);  // Set the game over state
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
                <img src="https://siyer2.github.io/sandya-snake/sandya-snake.png" alt="Snake" className="food" />
              )}
              {food.x === i && food.y === j && (hariUncleFace === true ? <img src="https://siyer2.github.io/sandya-snake/hari-food.png" alt="food" className="food" /> : <img src="https://siyer2.github.io/sandya-snake/priya-food.png" alt="food" className="food" />)}
            </div>
          ))
        )}
      </div>

      <div className="controls">
        <button className="up-button" onClick={() => { controlHit(); setDirection({ x: -1, y: 0 }) }}>&uarr;</button>
        <div className="horizontal-buttons">
          <button className="left-button" onClick={() => { controlHit(); setDirection({ x: 0, y: -1 }) }}>&larr;</button>
          <button className="right-button" onClick={() => { controlHit(); setDirection({ x: 0, y: 1 }) }}>&rarr;</button>
        </div>
        <button className="down-button" onClick={() => { controlHit(); setDirection({ x: 1, y: 0 }) }}>&darr;</button>
      </div>

      {isGameOver && (
        <div className="game-over-modal">
          <div className="game-over-content">
            <h2>Game Over</h2>
            <p>Your Score: {score / 2}</p>
            <button onClick={() => { window.location.reload() }}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
