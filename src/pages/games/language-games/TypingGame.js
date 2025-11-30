import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FiRefreshCw } from 'react-icons/fi';
import './TypingGame.css';

const texts = [
  "The quick brown fox jumps over the lazy dog.",
  "Programming is the art of telling a computer what to do.",
  "Practice makes perfect when learning to type faster.",
  "JavaScript is a versatile programming language for web development.",
  "Data structures and algorithms form the foundation of computer science.",
  "React is a popular library for building user interfaces.",
  "The best way to learn is by doing and making mistakes.",
  "Consistency and dedication lead to mastery over time.",
];

const TypingGame = () => {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef(null);

  const startNewGame = useCallback(() => {
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    setText(randomText);
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    setCurrentIndex(0);
    setErrors(0);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    if (!startTime) {
      setStartTime(Date.now());
    }

    setUserInput(value);
    setCurrentIndex(value.length);

    // Count errors
    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);

    // Calculate accuracy
    const acc = Math.max(0, Math.round(((value.length - errorCount) / value.length) * 100)) || 100;
    setAccuracy(acc);

    // Check if finished
    if (value.length === text.length) {
      const end = Date.now();
      setEndTime(end);
      setIsFinished(true);
      
      // Calculate WPM
      const timeInMinutes = (end - startTime) / 60000;
      const words = text.split(' ').length;
      const calculatedWpm = Math.round(words / timeInMinutes);
      setWpm(calculatedWpm);
    }
  };

  const getCharacterClass = (index) => {
    if (index >= userInput.length) return 'pending';
    if (userInput[index] === text[index]) return 'correct';
    return 'incorrect';
  };

  const getTimeElapsed = () => {
    if (!startTime) return '0:00';
    const elapsed = ((endTime || Date.now()) - startTime) / 1000;
    const mins = Math.floor(elapsed / 60);
    const secs = Math.floor(elapsed % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (startTime && !isFinished) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 60000;
        const words = userInput.split(' ').filter(w => w).length;
        setWpm(Math.round(words / elapsed) || 0);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [startTime, isFinished, userInput]);

  return (
    <div className="game-container typing-game">
      <div className="game-header">
        <Link to="/games/categories/language" className="back-button">
          <IoArrowBack /> Back to Language Games
        </Link>
        <h1>⌨️ Typing Speed Test</h1>
      </div>

      <div className="game-layout">
        <div className="game-sidebar">
          <div className="info-section">
            <h3>How to Play</h3>
            <p>Type the text shown as quickly and accurately as possible.</p>
          </div>

          <div className="stats-container">
            <div className="stat-item">
              <label>WPM</label>
              <span className="wpm">{wpm}</span>
            </div>
            <div className="stat-item">
              <label>Accuracy</label>
              <span className={accuracy >= 90 ? 'high' : accuracy >= 70 ? 'medium' : 'low'}>
                {accuracy}%
              </span>
            </div>
            <div className="stat-item">
              <label>Time</label>
              <span>{getTimeElapsed()}</span>
            </div>
            <div className="stat-item">
              <label>Errors</label>
              <span className={errors > 0 ? 'error' : ''}>{errors}</span>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={startNewGame} className="action-button secondary">
              <FiRefreshCw /> New Text
            </button>
          </div>
        </div>

        <div className="game-main">
          {isFinished ? (
            <div className="results-card">
              <h2>🎉 Complete!</h2>
              <div className="final-stats">
                <div className="big-stat">
                  <span className="value">{wpm}</span>
                  <span className="label">WPM</span>
                </div>
                <div className="big-stat">
                  <span className="value">{accuracy}%</span>
                  <span className="label">Accuracy</span>
                </div>
              </div>
              <p className="result-message">
                {wpm >= 60 ? '🚀 Excellent typing speed!' :
                 wpm >= 40 ? '👍 Good job! Keep practicing!' :
                 '💪 Keep practicing to improve!'}
              </p>
              <button onClick={startNewGame} className="action-button primary">
                Try Again
              </button>
            </div>
          ) : (
            <div className="typing-area">
              <div className="text-display">
                {text.split('').map((char, index) => (
                  <span key={index} className={`char ${getCharacterClass(index)}`}>
                    {char}
                  </span>
                ))}
              </div>
              <textarea
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                placeholder="Start typing here..."
                className="typing-input"
                autoFocus
                spellCheck={false}
              />
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(currentIndex / text.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypingGame;
