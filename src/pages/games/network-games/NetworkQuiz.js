import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';
import './NetworkQuiz.css';

const questions = [
  {
    question: "Which layer of the OSI model is responsible for routing?",
    options: ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"],
    correct: 1,
    explanation: "The Network Layer (Layer 3) handles routing of data packets between different networks using IP addresses."
  },
  {
    question: "What is the default port number for HTTPS?",
    options: ["80", "443", "8080", "22"],
    correct: 1,
    explanation: "HTTPS uses port 443 by default, while HTTP uses port 80."
  },
  {
    question: "Which protocol is connectionless?",
    options: ["TCP", "UDP", "FTP", "SSH"],
    correct: 1,
    explanation: "UDP (User Datagram Protocol) is connectionless, meaning it doesn't establish a connection before sending data."
  },
  {
    question: "What does DNS stand for?",
    options: ["Data Network Service", "Domain Name System", "Dynamic Network Security", "Digital Name Server"],
    correct: 1,
    explanation: "DNS stands for Domain Name System, which translates domain names to IP addresses."
  },
  {
    question: "Which IP address class provides the most hosts?",
    options: ["Class A", "Class B", "Class C", "Class D"],
    correct: 0,
    explanation: "Class A networks can have approximately 16 million hosts per network."
  },
  {
    question: "What is the subnet mask for a /24 network?",
    options: ["255.255.0.0", "255.255.255.0", "255.255.255.128", "255.0.0.0"],
    correct: 1,
    explanation: "/24 means 24 bits for the network portion, resulting in subnet mask 255.255.255.0"
  },
  {
    question: "Which protocol is used to dynamically assign IP addresses?",
    options: ["ARP", "DHCP", "ICMP", "SNMP"],
    correct: 1,
    explanation: "DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses to devices on a network."
  },
  {
    question: "What layer does a switch primarily operate on?",
    options: ["Physical Layer", "Data Link Layer", "Network Layer", "Transport Layer"],
    correct: 1,
    explanation: "Switches operate primarily at Layer 2 (Data Link Layer), using MAC addresses to forward frames."
  },
  {
    question: "What is the maximum transmission unit (MTU) for Ethernet?",
    options: ["1000 bytes", "1500 bytes", "2000 bytes", "4096 bytes"],
    correct: 1,
    explanation: "The standard Ethernet MTU is 1500 bytes."
  },
  {
    question: "Which protocol does ping use?",
    options: ["TCP", "UDP", "ICMP", "ARP"],
    correct: 2,
    explanation: "Ping uses ICMP (Internet Control Message Protocol) to test connectivity."
  },
  {
    question: "What is the purpose of NAT?",
    options: ["Encrypt data", "Translate private IPs to public IPs", "Assign IP addresses", "Route packets"],
    correct: 1,
    explanation: "NAT (Network Address Translation) allows multiple devices to share a single public IP address."
  },
  {
    question: "Which port does SSH typically use?",
    options: ["21", "22", "23", "25"],
    correct: 1,
    explanation: "SSH uses port 22 by default for secure remote access."
  },
  {
    question: "What does TCP use to ensure reliable delivery?",
    options: ["Checksums only", "Sequence numbers and acknowledgments", "Encryption", "Compression"],
    correct: 1,
    explanation: "TCP uses sequence numbers and acknowledgments to ensure data is received correctly and in order."
  },
  {
    question: "Which device connects multiple network segments?",
    options: ["Hub", "Repeater", "Router", "Modem"],
    correct: 2,
    explanation: "Routers connect multiple network segments and make forwarding decisions based on IP addresses."
  },
  {
    question: "What is a MAC address length?",
    options: ["32 bits", "48 bits", "64 bits", "128 bits"],
    correct: 1,
    explanation: "A MAC address is 48 bits (6 bytes), typically written as 12 hexadecimal digits."
  }
];

const NetworkQuiz = () => {
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
      <div className="network-quiz">
        <div className="game-header">
          <Link to="/games/categories/networks" className="back-button">
            <FiArrowLeft size={20} />
            Back
          </Link>
          <h1>Network Protocol Quiz</h1>
        </div>

        <div className="quiz-setup">
          <div className="setup-card">
            <h2>Test Your Network Knowledge</h2>
            <p>Answer questions about networking concepts, protocols, and architecture.</p>
            
            <div className="question-options">
              <h3>Select number of questions:</h3>
              <div className="option-buttons">
                <button onClick={() => startQuiz(5)}>
                  <span className="count">5</span>
                  <span className="label">Quick Quiz</span>
                </button>
                <button onClick={() => startQuiz(10)}>
                  <span className="count">10</span>
                  <span className="label">Standard</span>
                </button>
                <button onClick={() => startQuiz(15)}>
                  <span className="count">15</span>
                  <span className="label">Full Test</span>
                </button>
              </div>
            </div>
            
            <div className="topics-covered">
              <h4>Topics Covered:</h4>
              <div className="topic-tags">
                <span>OSI Model</span>
                <span>TCP/IP</span>
                <span>Ports</span>
                <span>Protocols</span>
                <span>Subnetting</span>
                <span>Network Devices</span>
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
      message = 'Network Expert!';
      emoji = '🏆';
    } else if (percentage >= 70) {
      message = 'Great job!';
      emoji = '🎉';
    } else if (percentage >= 50) {
      message = 'Good effort!';
      emoji = '👍';
    } else {
      message = 'Keep practicing!';
      emoji = '📚';
    }

    return (
      <div className="network-quiz">
        <div className="game-header">
          <Link to="/games/categories/networks" className="back-button">
            <FiArrowLeft size={20} />
            Back
          </Link>
          <h1>Network Protocol Quiz</h1>
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
    <div className="network-quiz">
      <div className="game-header">
        <Link to="/games/categories/networks" className="back-button">
          <FiArrowLeft size={20} />
          Back
        </Link>
        <h1>Network Protocol Quiz</h1>
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
                <h4>Explanation:</h4>
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

export default NetworkQuiz;
