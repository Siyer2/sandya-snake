// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const initialSnake = [{ x: 0, y: 0 }];
const initialFood = { x: 5, y: 5 };
const gridSize = 10; // Reduced grid size

function App() {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);

  const moveSnake = () => {
    // Logic to move the snake
  };

  const checkCollision = () => {
    // Logic to check for collisions with walls, itself, or food
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
    window.addEventListener('resize', updateGridSize);
    updateGridSize();

    // Set up key listeners and game loop

    return () => {
      window.removeEventListener('resize', updateGridSize);
    };
  }, []);

  return (
    <div className="game-board" id="game-board">
      {Array.from({ length: gridSize }, (_, i) =>
        Array.from({ length: gridSize }, (_, j) => (
          <div key={`${i}-${j}`} className="grid-cell">
            {snake.some(segment => segment.x === i && segment.y === j) && <div className="snake-segment" />}
            {food.x === i && food.y === j && <img src="/food.jpg" alt="Food" className="food" />}
          </div>
        ))
      )}
    </div>
  );
}

export default App;
