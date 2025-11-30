import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiRefreshCw, FiCpu, FiCheck, FiX } from 'react-icons/fi';
import './EmbeddedQuiz.css';

const questions = [
  {
    question: "What is the purpose of a pull-up resistor?",
    options: [
      "To limit current flow",
      "To keep the input HIGH when nothing is connected",
      "To increase voltage",
      "To filter noise"
    ],
    correct: 1,
    explanation: "A pull-up resistor ensures a known state (HIGH) when the input is floating/unconnected."
  },
  {
    question: "Which communication protocol is full-duplex?",
    options: ["SPI", "I2C", "UART", "Both SPI and UART"],
    correct: 3,
    explanation: "SPI and UART are full-duplex (can transmit and receive simultaneously). I2C is half-duplex."
  },
  {
    question: "What does PWM stand for?",
    options: [
      "Power Width Modulation",
      "Pulse Width Modulation",
      "Periodic Wave Manipulation",
      "Power Wave Management"
    ],
    correct: 1,
    explanation: "PWM stands for Pulse Width Modulation, used to simulate analog output using digital signals."
  },
  {
    question: "What is the typical voltage level for logic HIGH in 5V TTL?",
    options: ["1.5V - 2.0V", "2.4V - 5.0V", "3.3V - 5.0V", "0V - 0.8V"],
    correct: 1,
    explanation: "In 5V TTL logic, HIGH is typically 2.4V to 5.0V, and LOW is 0V to 0.8V."
  },
  {
    question: "Which memory type loses data when power is removed?",
    options: ["Flash", "EEPROM", "RAM", "ROM"],
    correct: 2,
    explanation: "RAM (Random Access Memory) is volatile and loses its contents when power is removed."
  },
  {
    question: "What is the main advantage of I2C over SPI?",
    options: [
      "Faster data transfer",
      "Requires fewer wires",
      "Full-duplex communication",
      "No slave addressing needed"
    ],
    correct: 1,
    explanation: "I2C requires only 2 wires (SDA, SCL) regardless of the number of devices, while SPI needs more."
  },
  {
    question: "What is a watchdog timer used for?",
    options: [
      "Measuring time accurately",
      "Generating PWM signals",
      "Resetting the system if it hangs",
      "Counting external events"
    ],
    correct: 2,
    explanation: "A watchdog timer resets the microcontroller if it's not periodically 'fed', preventing system hangs."
  },
  {
    question: "What is the function of a GPIO pin?",
    options: [
      "Only input",
      "Only output",
      "General Purpose Input/Output",
      "Ground connection"
    ],
    correct: 2,
    explanation: "GPIO (General Purpose Input/Output) pins can be configured as either input or output."
  },
  {
    question: "Which interrupt type has the highest priority?",
    options: ["Timer interrupt", "External interrupt", "Reset interrupt", "Software interrupt"],
    correct: 2,
    explanation: "Reset has the highest priority and can interrupt any other process."
  },
  {
    question: "What is the purpose of debouncing?",
    options: [
      "To filter high-frequency signals",
      "To eliminate false triggers from mechanical switches",
      "To reduce power consumption",
      "To increase signal strength"
    ],
    correct: 1,
    explanation: "Debouncing removes false multiple triggers caused by mechanical switch contact bounce."
  },
  {
    question: "What does ADC stand for?",
    options: [
      "Automatic Data Controller",
      "Analog to Digital Converter",
      "Advanced Digital Circuit",
      "Auxiliary Data Channel"
    ],
    correct: 1,
    explanation: "ADC converts analog signals (like from sensors) to digital values the microcontroller can process."
  },
  {
    question: "Which architecture uses separate buses for data and instructions?",
    options: ["Von Neumann", "Harvard", "CISC", "RISC"],
    correct: 1,
    explanation: "Harvard architecture has separate memory and buses for data and instructions, allowing parallel access."
  },
  {
    question: "What is the typical I2C address size?",
    options: ["4 bits", "7 bits", "8 bits", "16 bits"],
    correct: 1,
    explanation: "Standard I2C uses 7-bit addressing (supporting up to 128 devices), with 10-bit extended addressing available."
  },
  {
    question: "What does UART stand for?",
    options: [
      "Universal Asynchronous Receiver Transmitter",
      "Unified Analog Radio Technology",
      "Universal Automatic Reset Timer",
      "Unified Asynchronous Response Terminal"
    ],
    correct: 0,
    explanation: "UART is Universal Asynchronous Receiver/Transmitter, a hardware communication protocol."
  },
  {
    question: "Which register is used to store the return address during function calls?",
    options: ["Accumulator", "Stack Pointer", "Program Counter", "Link Register"],
    correct: 3,
    explanation: "The Link Register (LR) stores the return address so the program can resume after a function call."
  }
];

const EmbeddedQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);

  const startQuiz = useCallback((count) => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, count);
    setShuffledQuestions(shuffled);
    setQuestionCount(count);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setGameStarted(true);
  }, []);

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (index === shuffledQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < shuffledQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setGameStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  if (!gameStarted) {
    return (
      <div className="embedded-quiz">
        <div className="game-header">
          <Link to="/games/categories/embedded" className="back-button">
            <FiArrowLeft size={20} />
            Back
          </Link>
          <h1>Embedded Systems Quiz</h1>
        </div>

        <div className="quiz-setup">
          <div className="setup-card">
            <FiCpu size={48} className="setup-icon" />
            <h2>Test Your Knowledge</h2>
            <p>Challenge yourself with questions about microcontrollers, protocols, and embedded systems concepts.</p>
            
            <div className="question-options">
              <h3>Select number of questions:</h3>
              <div className="option-buttons">
                <button onClick={() => startQuiz(5)}>
                  <span className="count">5</span>
                  <span className="label">Quick</span>
                </button>
                <button onClick={() => startQuiz(10)}>
                  <span className="count">10</span>
                  <span className="label">Standard</span>
                </button>
                <button onClick={() => startQuiz(15)}>
                  <span className="count">15</span>
                  <span className="label">Full</span>
                </button>
              </div>
            </div>
            
            <div className="topics-covered">
              <h4>Topics:</h4>
              <div className="topic-tags">
                <span>GPIO</span>
                <span>I2C</span>
                <span>SPI</span>
                <span>UART</span>
                <span>PWM</span>
                <span>Interrupts</span>
                <span>Memory</span>
                <span>ADC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / shuffledQuestions.length) * 100);
    let message = '';
    let emoji = '';
    
    if (percentage >= 90) {
      message = 'Embedded Expert!';
      emoji = '🏆';
    } else if (percentage >= 70) {
      message = 'Great work!';
      emoji = '🎉';
    } else if (percentage >= 50) {
      message = 'Good effort!';
      emoji = '👍';
    } else {
      message = 'Keep learning!';
      emoji = '📚';
    }

    return (
      <div className="embedded-quiz">
        <div className="game-header">
          <Link to="/games/categories/embedded" className="back-button">
            <FiArrowLeft size={20} />
            Back
          </Link>
          <h1>Embedded Systems Quiz</h1>
        </div>

        <div className="results-container">
          <div className="results-card">
            <span className="result-emoji">{emoji}</span>
            <h2>{message}</h2>
            <div className="score-display">
              <span className="score-value">{score}</span>
              <span className="score-total">/ {shuffledQuestions.length}</span>
            </div>
            <p className="percentage">{percentage}% correct</p>
            
            <div className="result-actions">
              <button className="action-button primary" onClick={() => startQuiz(questionCount)}>
                <FiRefreshCw size={18} />
                Try Again
              </button>
              <button className="action-button secondary" onClick={resetQuiz}>
                Change Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = shuffledQuestions[currentQuestion];

  return (
    <div className="embedded-quiz">
      <div className="game-header">
        <Link to="/games/categories/embedded" className="back-button">
          <FiArrowLeft size={20} />
          Back
        </Link>
        <h1>Embedded Systems Quiz</h1>
      </div>

      <div className="quiz-layout">
        <div className="quiz-sidebar">
          <div className="progress-info">
            <div className="progress-text">
              Question {currentQuestion + 1} of {shuffledQuestions.length}
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="stats-container">
            <div className="stat-item">
              <label>Score</label>
              <span>{score}</span>
            </div>
            <div className="stat-item">
              <label>Accuracy</label>
              <span>{currentQuestion > 0 ? Math.round((score / currentQuestion) * 100) : 0}%</span>
            </div>
          </div>
          
          <button className="action-button secondary" onClick={resetQuiz}>
            Exit Quiz
          </button>
        </div>

        <div className="quiz-main">
          <div className="question-card">
            <div className="question-icon">
              <FiCpu size={24} />
            </div>
            <h2 className="question-text">{question.question}</h2>
            
            <div className="options-list">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-item ${
                    selectedAnswer !== null
                      ? index === question.correct
                        ? 'correct'
                        : index === selectedAnswer
                        ? 'incorrect'
                        : ''
                      : ''
                  }`}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                  {selectedAnswer !== null && index === question.correct && (
                    <FiCheck className="icon correct" size={20} />
                  )}
                  {selectedAnswer !== null && index === selectedAnswer && index !== question.correct && (
                    <FiX className="icon incorrect" size={20} />
                  )}
                </button>
              ))}
            </div>

            {showExplanation && (
              <div className="explanation-box">
                <h4>💡 Explanation:</h4>
                <p>{question.explanation}</p>
              </div>
            )}

            {selectedAnswer !== null && (
              <button className="next-button" onClick={nextQuestion}>
                {currentQuestion + 1 < shuffledQuestions.length ? 'Next Question' : 'View Results'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbeddedQuiz;
