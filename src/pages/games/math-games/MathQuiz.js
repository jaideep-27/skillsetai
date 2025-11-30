import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';
import './MathQuiz.css';

const MathQuiz = () => {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestions] = useState(10);
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const questionRef = useRef(null);

  const operations = {
    easy: ['+', '-'],
    medium: ['+', '-', '*'],
    hard: ['+', '-', '*', '/']
  };

  const ranges = {
    easy: { min: 1, max: 20 },
    medium: { min: 10, max: 50 },
    hard: { min: 10, max: 100 }
  };

  const generateQuestion = useCallback(() => {
    const ops = operations[difficulty];
    const range = ranges[difficulty];
    const operation = ops[Math.floor(Math.random() * ops.length)];
    
    let num1, num2, answer;
    
    do {
      num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      
      switch (operation) {
        case '+':
          answer = num1 + num2;
          break;
        case '-':
          // Ensure positive result
          if (num1 < num2) [num1, num2] = [num2, num1];
          answer = num1 - num2;
          break;
        case '*':
          // Use smaller numbers for multiplication
          num1 = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 12) + 1;
          answer = num1 * num2;
          break;
        case '/':
          // Ensure clean division
          num2 = Math.floor(Math.random() * 10) + 1;
          answer = Math.floor(Math.random() * 10) + 1;
          num1 = num2 * answer;
          break;
        default:
          answer = 0;
      }
    } while (answer < 0 || !Number.isInteger(answer));

    const newQuestion = {
      num1,
      num2,
      operation,
      answer,
      display: `${num1} ${operation} ${num2} = ?`
    };
    
    questionRef.current = newQuestion;
    return newQuestion;
  }, [difficulty]);

  const startNewGame = useCallback(() => {
    setScore(0);
    setCurrentQuestion(0);
    setGameOver(false);
    setStreak(0);
    setFeedback(null);
    setUserAnswer('');
    setIsTransitioning(false);
    const newQ = generateQuestion();
    setQuestion(newQ);
    setTimeLeft(30);
  }, [generateQuestion]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Timer effect
  useEffect(() => {
    if (gameOver || feedback || !question || isTransitioning) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Use ref to get current answer to avoid stale closure
          const currentAnswer = questionRef.current?.answer;
          if (currentAnswer !== undefined) {
            setFeedback({
              correct: false,
              message: `Time's up! The answer was ${currentAnswer}`
            });
            setStreak(0);
            setIsTransitioning(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver, feedback, question, isTransitioning]);

  // Handle transition to next question after feedback
  useEffect(() => {
    if (isTransitioning && feedback) {
      const timeout = setTimeout(() => {
        if (currentQuestion + 1 >= totalQuestions) {
          setGameOver(true);
        } else {
          setCurrentQuestion(prev => prev + 1);
          const newQ = generateQuestion();
          setQuestion(newQ);
          setUserAnswer('');
          setFeedback(null);
          setTimeLeft(30);
        }
        setIsTransitioning(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning, feedback, currentQuestion, totalQuestions, generateQuestion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer.trim() || feedback || !question) return;

    const isCorrect = parseInt(userAnswer) === question.answer;
    
    if (isCorrect) {
      const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
      const bonusPoints = Math.min(streak * 5, 25); // Max 25 bonus points
      setScore(prev => prev + points + bonusPoints);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        return newStreak;
      });
      setFeedback({
        correct: true,
        message: streak >= 2 ? `Correct! 🔥 ${streak + 1} streak!` : 'Correct! 🎉'
      });
    } else {
      setStreak(0);
      setFeedback({
        correct: false,
        message: `Incorrect. The answer was ${question.answer}`
      });
    }
    
    setIsTransitioning(true);
  };

  const getGrade = () => {
    const maxScore = totalQuestions * (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30);
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return { grade: 'A+', message: 'Outstanding! 🏆', color: '#FFD700' };
    if (percentage >= 80) return { grade: 'A', message: 'Excellent! 🌟', color: '#22C55E' };
    if (percentage >= 70) return { grade: 'B', message: 'Great job! 👍', color: '#00D4FF' };
    if (percentage >= 60) return { grade: 'C', message: 'Good effort! 💪', color: '#4D61FC' };
    return { grade: 'D', message: 'Keep practicing! 📚', color: '#FF6B9C' };
  };

  return (
    <div className="game-container math-quiz">
      <div className="game-header">
        <Link to="/games/categories/math" className="back-button">
          <IoArrowBack /> Back to Math Games
        </Link>
        <h1>🧮 Math Quiz</h1>
      </div>

      <div className="game-layout">
        <div className="game-sidebar">
          <div className="info-section">
            <h3>Quick Math Challenge</h3>
            <p>Answer math problems as fast as you can. Build streaks for bonus points!</p>
          </div>

          <div className="control-group">
            <label>Difficulty</label>
            <select 
              value={difficulty} 
              onChange={(e) => {
                setDifficulty(e.target.value);
                startNewGame();
              }}
              className="difficulty-select"
              disabled={!gameOver && currentQuestion > 0}
            >
              <option value="easy">Easy (+, -)</option>
              <option value="medium">Medium (+, -, ×)</option>
              <option value="hard">Hard (+, -, ×, ÷)</option>
            </select>
          </div>

          <div className="stats-container">
            <div className="stat-item">
              <label>Score</label>
              <span>{score}</span>
            </div>
            <div className="stat-item">
              <label>Question</label>
              <span>{currentQuestion + 1}/{totalQuestions}</span>
            </div>
            <div className="stat-item streak">
              <label>Streak</label>
              <span>{streak} 🔥</span>
            </div>
            <div className="stat-item">
              <label>Best Streak</label>
              <span>{bestStreak}</span>
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
              <div className="grade-circle" style={{ borderColor: getGrade().color }}>
                <span className="grade" style={{ color: getGrade().color }}>{getGrade().grade}</span>
              </div>
              <h2>Quiz Complete!</h2>
              <p className="final-score">Final Score: {score}</p>
              <p className="grade-message">{getGrade().message}</p>
              <p className="best-streak">Best Streak: {bestStreak} 🔥</p>
              <button onClick={startNewGame} className="action-button primary">
                Play Again
              </button>
            </div>
          ) : question && (
            <div className="question-card">
              <div className="timer-bar">
                <div 
                  className="timer-fill" 
                  style={{ 
                    width: `${(timeLeft / 30) * 100}%`,
                    backgroundColor: timeLeft <= 10 ? '#EF4444' : timeLeft <= 20 ? '#F59E0B' : '#22C55E'
                  }}
                />
              </div>
              <div className="timer-text">{timeLeft}s</div>
              
              <div className="question-display">
                <span className="question-text">{question.display}</span>
              </div>

              <form onSubmit={handleSubmit} className="answer-form">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Your answer"
                  className="answer-input"
                  autoFocus
                  disabled={!!feedback}
                />
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={!userAnswer.trim() || !!feedback}
                >
                  Submit
                </button>
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

export default MathQuiz;
