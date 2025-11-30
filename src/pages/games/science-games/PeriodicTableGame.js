import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import './PeriodicTableGame.css';

const elements = [
  { symbol: 'H', name: 'Hydrogen', number: 1, group: 'nonmetal' },
  { symbol: 'He', name: 'Helium', number: 2, group: 'noble-gas' },
  { symbol: 'Li', name: 'Lithium', number: 3, group: 'alkali' },
  { symbol: 'Be', name: 'Beryllium', number: 4, group: 'alkaline' },
  { symbol: 'B', name: 'Boron', number: 5, group: 'metalloid' },
  { symbol: 'C', name: 'Carbon', number: 6, group: 'nonmetal' },
  { symbol: 'N', name: 'Nitrogen', number: 7, group: 'nonmetal' },
  { symbol: 'O', name: 'Oxygen', number: 8, group: 'nonmetal' },
  { symbol: 'F', name: 'Fluorine', number: 9, group: 'halogen' },
  { symbol: 'Ne', name: 'Neon', number: 10, group: 'noble-gas' },
  { symbol: 'Na', name: 'Sodium', number: 11, group: 'alkali' },
  { symbol: 'Mg', name: 'Magnesium', number: 12, group: 'alkaline' },
  { symbol: 'Al', name: 'Aluminum', number: 13, group: 'metal' },
  { symbol: 'Si', name: 'Silicon', number: 14, group: 'metalloid' },
  { symbol: 'P', name: 'Phosphorus', number: 15, group: 'nonmetal' },
  { symbol: 'S', name: 'Sulfur', number: 16, group: 'nonmetal' },
  { symbol: 'Cl', name: 'Chlorine', number: 17, group: 'halogen' },
  { symbol: 'Ar', name: 'Argon', number: 18, group: 'noble-gas' },
  { symbol: 'K', name: 'Potassium', number: 19, group: 'alkali' },
  { symbol: 'Ca', name: 'Calcium', number: 20, group: 'alkaline' },
  { symbol: 'Fe', name: 'Iron', number: 26, group: 'transition' },
  { symbol: 'Cu', name: 'Copper', number: 29, group: 'transition' },
  { symbol: 'Zn', name: 'Zinc', number: 30, group: 'transition' },
  { symbol: 'Ag', name: 'Silver', number: 47, group: 'transition' },
  { symbol: 'Au', name: 'Gold', number: 79, group: 'transition' },
  { symbol: 'Pb', name: 'Lead', number: 82, group: 'metal' },
  { symbol: 'U', name: 'Uranium', number: 92, group: 'actinide' },
];

const GAME_MODES = {
  SYMBOL_TO_NAME: 'symbol-to-name',
  NAME_TO_SYMBOL: 'name-to-symbol',
  NUMBER_TO_ELEMENT: 'number-to-element'
};

const PeriodicTableGame = () => {
  const [gameMode, setGameMode] = useState(GAME_MODES.SYMBOL_TO_NAME);
  const [currentElement, setCurrentElement] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const generateQuestion = useCallback(() => {
    const shuffled = [...elements].sort(() => Math.random() - 0.5);
    const correct = shuffled[0];
    const wrongOptions = shuffled.slice(1, 4);
    
    let allOptions;
    switch (gameMode) {
      case GAME_MODES.SYMBOL_TO_NAME:
        allOptions = [correct.name, ...wrongOptions.map(e => e.name)];
        break;
      case GAME_MODES.NAME_TO_SYMBOL:
        allOptions = [correct.symbol, ...wrongOptions.map(e => e.symbol)];
        break;
      case GAME_MODES.NUMBER_TO_ELEMENT:
        allOptions = [correct.name, ...wrongOptions.map(e => e.name)];
        break;
      default:
        allOptions = [correct.name, ...wrongOptions.map(e => e.name)];
    }
    
    setCurrentElement(correct);
    setOptions(allOptions.sort(() => Math.random() - 0.5));
    setFeedback(null);
  }, [gameMode]);

  useEffect(() => {
    if (gameStarted) {
      generateQuestion();
    }
  }, [gameStarted, generateQuestion]);

  const handleAnswer = (answer) => {
    let isCorrect = false;
    
    switch (gameMode) {
      case GAME_MODES.SYMBOL_TO_NAME:
        isCorrect = answer === currentElement.name;
        break;
      case GAME_MODES.NAME_TO_SYMBOL:
        isCorrect = answer === currentElement.symbol;
        break;
      case GAME_MODES.NUMBER_TO_ELEMENT:
        isCorrect = answer === currentElement.name;
        break;
      default:
        isCorrect = answer === currentElement.name;
    }

    setTotalQuestions(prev => prev + 1);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) {
          setBestStreak(newStreak);
        }
        return newStreak;
      });
      setFeedback({ type: 'correct', message: 'Correct! 🎉' });
    } else {
      setStreak(0);
      const correctAnswer = gameMode === GAME_MODES.NAME_TO_SYMBOL 
        ? currentElement.symbol 
        : currentElement.name;
      setFeedback({ 
        type: 'incorrect', 
        message: `Wrong! The answer was ${correctAnswer}` 
      });
    }

    setTimeout(() => {
      generateQuestion();
    }, 1500);
  };

  const getQuestion = () => {
    if (!currentElement) return '';
    
    switch (gameMode) {
      case GAME_MODES.SYMBOL_TO_NAME:
        return (
          <div className="element-display">
            <span className="element-symbol">{currentElement.symbol}</span>
            <p>What element is this?</p>
          </div>
        );
      case GAME_MODES.NAME_TO_SYMBOL:
        return (
          <div className="element-display">
            <span className="element-name-large">{currentElement.name}</span>
            <p>What is its symbol?</p>
          </div>
        );
      case GAME_MODES.NUMBER_TO_ELEMENT:
        return (
          <div className="element-display">
            <span className="element-number">{currentElement.number}</span>
            <p>What element has this atomic number?</p>
          </div>
        );
      default:
        return null;
    }
  };

  const resetGame = () => {
    setScore(0);
    setTotalQuestions(0);
    setStreak(0);
    generateQuestion();
  };

  const startGame = (mode) => {
    setGameMode(mode);
    setGameStarted(true);
    setScore(0);
    setTotalQuestions(0);
    setStreak(0);
  };

  if (!gameStarted) {
    return (
      <div className="periodic-game">
        <div className="game-header">
          <Link to="/games/categories/science" className="back-button">
            <FiArrowLeft size={20} />
            Back
          </Link>
          <h1>Periodic Table Quiz</h1>
        </div>

        <div className="mode-selection">
          <h2>Select Game Mode</h2>
          <div className="mode-cards">
            <button 
              className="mode-card"
              onClick={() => startGame(GAME_MODES.SYMBOL_TO_NAME)}
            >
              <span className="mode-icon">⚗️</span>
              <h3>Symbol to Name</h3>
              <p>Identify element names from their symbols</p>
            </button>
            <button 
              className="mode-card"
              onClick={() => startGame(GAME_MODES.NAME_TO_SYMBOL)}
            >
              <span className="mode-icon">🔤</span>
              <h3>Name to Symbol</h3>
              <p>Find the correct symbol for each element</p>
            </button>
            <button 
              className="mode-card"
              onClick={() => startGame(GAME_MODES.NUMBER_TO_ELEMENT)}
            >
              <span className="mode-icon">🔢</span>
              <h3>Atomic Number</h3>
              <p>Match atomic numbers to elements</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="periodic-game">
      <div className="game-header">
        <Link to="/games/categories/science" className="back-button">
          <FiArrowLeft size={20} />
          Back
        </Link>
        <h1>Periodic Table Quiz</h1>
      </div>

      <div className="game-layout">
        <div className="game-sidebar">
          <div className="stats-container">
            <div className="stat-item">
              <label>Score</label>
              <span>{score}/{totalQuestions}</span>
            </div>
            <div className="stat-item">
              <label>Accuracy</label>
              <span>{totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%</span>
            </div>
            <div className="stat-item">
              <label>Streak</label>
              <span>🔥 {streak}</span>
            </div>
            <div className="stat-item">
              <label>Best Streak</label>
              <span>⭐ {bestStreak}</span>
            </div>
          </div>

          <button className="action-button secondary" onClick={resetGame}>
            <FiRefreshCw size={18} />
            Reset Game
          </button>
          
          <button className="action-button secondary" onClick={() => setGameStarted(false)}>
            Change Mode
          </button>
        </div>

        <div className="game-main">
          <div className="quiz-card">
            {getQuestion()}

            <div className="options-grid">
              {options.map((option, index) => (
                <button
                  key={index}
                  className={`option-btn ${feedback ? 
                    (gameMode === GAME_MODES.NAME_TO_SYMBOL 
                      ? option === currentElement.symbol 
                      : option === currentElement.name) 
                    ? 'correct' 
                    : 'disabled' 
                    : ''}`}
                  onClick={() => !feedback && handleAnswer(option)}
                  disabled={!!feedback}
                >
                  {option}
                </button>
              ))}
            </div>

            {feedback && (
              <div className={`feedback ${feedback.type}`}>
                {feedback.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodicTableGame;
