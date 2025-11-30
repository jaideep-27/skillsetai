import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';
import './WordScramble.css';

const wordList = [
  { word: 'ALGORITHM', hint: 'Step-by-step procedure for calculations' },
  { word: 'DATABASE', hint: 'Organized collection of data' },
  { word: 'FUNCTION', hint: 'Reusable block of code' },
  { word: 'VARIABLE', hint: 'Container for storing data values' },
  { word: 'COMPILER', hint: 'Translates code to machine language' },
  { word: 'INTERFACE', hint: 'Point of interaction between components' },
  { word: 'RECURSION', hint: 'Function that calls itself' },
  { word: 'DEBUGGING', hint: 'Finding and fixing errors' },
  { word: 'FRAMEWORK', hint: 'Foundation structure for development' },
  { word: 'ENCRYPTION', hint: 'Converting data into secret code' },
  { word: 'PROTOCOL', hint: 'Set of rules for data exchange' },
  { word: 'BANDWIDTH', hint: 'Data transfer capacity' },
];

const WordScramble = () => {
  const [currentWord, setCurrentWord] = useState(null);
  const [scrambled, setScrambled] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(5);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  const scrambleWord = (word) => {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Make sure it's actually scrambled
    if (arr.join('') === word) {
      return scrambleWord(word);
    }
    return arr.join('');
  };

  const newRound = useCallback(() => {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setCurrentWord(randomWord);
    setScrambled(scrambleWord(randomWord.word));
    setUserGuess('');
    setFeedback(null);
    setShowHint(false);
  }, []);

  const startNewGame = useCallback(() => {
    setScore(0);
    setRound(1);
    setGameOver(false);
    setHintsUsed(0);
    newRound();
  }, [newRound]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userGuess.trim() || feedback) return;

    const isCorrect = userGuess.toUpperCase() === currentWord.word;
    
    if (isCorrect) {
      const points = showHint ? 5 : 10;
      setScore(prev => prev + points);
      setFeedback({ correct: true, message: `Correct! +${points} points` });
    } else {
      setFeedback({ correct: false, message: `Wrong! The word was ${currentWord.word}` });
    }

    setTimeout(() => {
      if (round >= totalRounds) {
        setGameOver(true);
      } else {
        setRound(prev => prev + 1);
        newRound();
      }
    }, 1500);
  };

  const useHint = () => {
    if (!showHint) {
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
    }
  };

  return (
    <div className="game-container word-scramble">
      <div className="game-header">
        <Link to="/games/categories/language" className="back-button">
          <IoArrowBack /> Back to Language Games
        </Link>
        <h1>🔤 Word Scramble</h1>
      </div>

      <div className="game-layout">
        <div className="game-sidebar">
          <div className="info-section">
            <h3>How to Play</h3>
            <p>Unscramble the letters to form the correct word. Use hints if you're stuck!</p>
          </div>

          <div className="stats-container">
            <div className="stat-item">
              <label>Score</label>
              <span>{score}</span>
            </div>
            <div className="stat-item">
              <label>Round</label>
              <span>{round}/{totalRounds}</span>
            </div>
            <div className="stat-item">
              <label>Hints Used</label>
              <span>{hintsUsed}</span>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={startNewGame} className="action-button secondary">
              <FiRefreshCw /> New Game
            </button>
          </div>
        </div>

        <div className="game-main">
          {gameOver ? (
            <div className="results-card">
              <h2>🎉 Game Over!</h2>
              <div className="final-score">
                <span className="score-value">{score}</span>
                <span className="score-label">Points</span>
              </div>
              <p className="result-message">
                {score >= 40 ? '🏆 Outstanding! Word master!' :
                 score >= 25 ? '👍 Great job!' :
                 '💪 Keep practicing!'}
              </p>
              <button onClick={startNewGame} className="action-button primary">
                Play Again
              </button>
            </div>
          ) : currentWord && (
            <div className="scramble-card">
              <div className="scrambled-word">
                {scrambled.split('').map((letter, i) => (
                  <span key={i} className="letter-tile">{letter}</span>
                ))}
              </div>

              {showHint && (
                <div className="hint-box">
                  <strong>Hint:</strong> {currentWord.hint}
                </div>
              )}

              <form onSubmit={handleSubmit} className="guess-form">
                <input
                  type="text"
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  placeholder="Your answer..."
                  className="guess-input"
                  autoFocus
                  disabled={!!feedback}
                />
                <div className="form-buttons">
                  <button type="submit" className="submit-btn" disabled={!userGuess.trim() || !!feedback}>
                    Submit
                  </button>
                  <button type="button" className="hint-btn" onClick={useHint} disabled={showHint}>
                    {showHint ? 'Hint Used' : 'Use Hint (-5pts)'}
                  </button>
                </div>
              </form>

              {feedback && (
                <div className={`feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>
                  {feedback.correct ? <FiCheck /> : <FiX />}
                  {feedback.message}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordScramble;
