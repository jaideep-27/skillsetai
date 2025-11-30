import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FiRefreshCw, FiAward } from 'react-icons/fi';
import './NumberPuzzle.css';

const NumberPuzzle = () => {
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [gridSize, setGridSize] = useState(3);
  const [bestScore, setBestScore] = useState(null);

  const generateSolvedPuzzle = useCallback((size) => {
    const puzzle = [];
    for (let i = 1; i < size * size; i++) {
      puzzle.push(i);
    }
    puzzle.push(null); // Empty tile
    return puzzle;
  }, []);

  const isSolvable = (puzzle, size) => {
    let inversions = 0;
    const flatPuzzle = puzzle.filter(tile => tile !== null);
    
    for (let i = 0; i < flatPuzzle.length - 1; i++) {
      for (let j = i + 1; j < flatPuzzle.length; j++) {
        if (flatPuzzle[i] > flatPuzzle[j]) {
          inversions++;
        }
      }
    }

    if (size % 2 === 1) {
      return inversions % 2 === 0;
    } else {
      const emptyRowFromBottom = size - Math.floor(puzzle.indexOf(null) / size);
      return (inversions + emptyRowFromBottom) % 2 === 1;
    }
  };

  const shufflePuzzle = useCallback((size) => {
    let puzzle;
    do {
      puzzle = generateSolvedPuzzle(size);
      for (let i = puzzle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [puzzle[i], puzzle[j]] = [puzzle[j], puzzle[i]];
      }
    } while (!isSolvable(puzzle, size) || checkWin(puzzle, size));
    
    return puzzle;
  }, [generateSolvedPuzzle]);

  const checkWin = (currentTiles, size) => {
    const solved = generateSolvedPuzzle(size);
    return currentTiles.every((tile, index) => tile === solved[index]);
  };

  const initGame = useCallback(() => {
    setTiles(shufflePuzzle(gridSize));
    setMoves(0);
    setTimer(0);
    setIsRunning(false);
    setIsSolved(false);
  }, [gridSize, shufflePuzzle]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    let interval;
    if (isRunning && !isSolved) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isSolved]);

  const handleTileClick = (index) => {
    if (isSolved) return;

    const emptyIndex = tiles.indexOf(null);
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;

    const isAdjacent = 
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      if (!isRunning) setIsRunning(true);
      
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(prev => prev + 1);

      if (checkWin(newTiles, gridSize)) {
        setIsSolved(true);
        setIsRunning(false);
        if (!bestScore || moves + 1 < bestScore) {
          setBestScore(moves + 1);
        }
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-container number-puzzle">
      <div className="game-header">
        <Link to="/games/categories/math" className="back-button">
          <IoArrowBack /> Back to Math Games
        </Link>
        <h1>🔢 Number Puzzle</h1>
      </div>

      <div className="game-layout">
        <div className="game-sidebar">
          <div className="info-section">
            <h3>How to Play</h3>
            <p>Slide the tiles to arrange numbers in order from 1 to {gridSize * gridSize - 1}.</p>
            <div className="rules">
              <div className="rule">
                <span className="bullet">•</span>
                Click a tile next to the empty space to move it
              </div>
              <div className="rule">
                <span className="bullet">•</span>
                Arrange all numbers in ascending order
              </div>
              <div className="rule">
                <span className="bullet">•</span>
                Try to solve it in minimum moves
              </div>
            </div>
          </div>

          <div className="control-group">
            <label>Grid Size</label>
            <select 
              value={gridSize} 
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="size-select"
              disabled={isRunning}
            >
              <option value={3}>3 × 3 (Easy)</option>
              <option value={4}>4 × 4 (Medium)</option>
              <option value={5}>5 × 5 (Hard)</option>
            </select>
          </div>

          <div className="stats-container">
            <div className="stat-item">
              <label>Moves</label>
              <span>{moves}</span>
            </div>
            <div className="stat-item">
              <label>Time</label>
              <span>{formatTime(timer)}</span>
            </div>
            {bestScore && (
              <div className="stat-item best">
                <label>Best</label>
                <span>{bestScore} moves</span>
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button onClick={initGame} className="action-button secondary">
              <FiRefreshCw /> New Game
            </button>
          </div>
        </div>

        <div className="game-main">
          {isSolved && (
            <div className="win-overlay">
              <div className="win-content">
                <FiAward className="trophy-icon" />
                <h2>Congratulations!</h2>
                <p>You solved the puzzle in {moves} moves and {formatTime(timer)}!</p>
                <button onClick={initGame} className="action-button primary">
                  Play Again
                </button>
              </div>
            </div>
          )}
          
          <div 
            className="puzzle-grid"
            style={{ 
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              width: `${gridSize * 80}px`,
              height: `${gridSize * 80}px`
            }}
          >
            {tiles.map((tile, index) => (
              <div
                key={index}
                className={`puzzle-tile ${tile === null ? 'empty' : ''} ${isSolved ? 'solved' : ''}`}
                onClick={() => handleTileClick(index)}
              >
                {tile}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberPuzzle;
