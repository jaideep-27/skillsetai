import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Quizzes.css';

// Question banks for each quiz
const QUESTIONS_DATA = {
  'web-fundamentals': [
    {
      id: 1,
      question: 'What does HTML stand for?',
      options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink Text Management Language'],
      correctAnswer: 0
    },
    {
      id: 2,
      question: 'Which CSS property is used to change the text color?',
      options: ['text-color', 'font-color', 'color', 'text-style'],
      correctAnswer: 2
    },
    {
      id: 3,
      question: 'What is the correct way to declare a JavaScript variable?',
      options: ['variable x = 5', 'let x = 5', 'v x = 5', 'declare x = 5'],
      correctAnswer: 1
    },
    {
      id: 4,
      question: 'Which HTML tag is used to create a hyperlink?',
      options: ['<link>', '<a>', '<href>', '<url>'],
      correctAnswer: 1
    },
    {
      id: 5,
      question: 'What does CSS stand for?',
      options: ['Creative Style Sheets', 'Computer Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets'],
      correctAnswer: 2
    },
    {
      id: 6,
      question: 'Which property is used to change the background color in CSS?',
      options: ['bgcolor', 'background-color', 'color-background', 'bg-color'],
      correctAnswer: 1
    },
    {
      id: 7,
      question: 'What is the correct JavaScript syntax to change content of an HTML element?',
      options: ['document.getElementById("demo").innerHTML = "Hello"', 'document.getElement("demo").innerHTML = "Hello"', '#demo.innerHTML = "Hello"', 'document.getElementById("demo").content = "Hello"'],
      correctAnswer: 0
    },
    {
      id: 8,
      question: 'Which HTML attribute is used to define inline styles?',
      options: ['class', 'styles', 'style', 'css'],
      correctAnswer: 2
    },
    {
      id: 9,
      question: 'How do you add a comment in CSS?',
      options: ['// comment', '/* comment */', '<!-- comment -->', '# comment'],
      correctAnswer: 1
    },
    {
      id: 10,
      question: 'Which JavaScript method is used to access an HTML element by id?',
      options: ['getElementById()', 'getElement()', 'elementById()', 'findElementById()'],
      correctAnswer: 0
    }
  ],
  'python-basics': [
    {
      id: 1,
      question: 'What is the correct file extension for Python files?',
      options: ['.python', '.py', '.pt', '.pyt'],
      correctAnswer: 1
    },
    {
      id: 2,
      question: 'How do you create a variable with the numeric value 5 in Python?',
      options: ['x = 5', 'int x = 5', 'x := 5', 'var x = 5'],
      correctAnswer: 0
    },
    {
      id: 3,
      question: 'Which of the following is the correct way to create a list in Python?',
      options: ['list = (1, 2, 3)', 'list = [1, 2, 3]', 'list = {1, 2, 3}', 'list = <1, 2, 3>'],
      correctAnswer: 1
    },
    {
      id: 4,
      question: 'What is the output of print(2 ** 3)?',
      options: ['6', '8', '5', '9'],
      correctAnswer: 1
    },
    {
      id: 5,
      question: 'How do you start a comment in Python?',
      options: ['//', '#', '/*', '<!--'],
      correctAnswer: 1
    },
    {
      id: 6,
      question: 'Which method is used to add an element at the end of a list?',
      options: ['add()', 'push()', 'append()', 'insert()'],
      correctAnswer: 2
    },
    {
      id: 7,
      question: 'What is the correct syntax for a for loop in Python?',
      options: ['for i in range(5):', 'for (i = 0; i < 5; i++)', 'for i = 0 to 5:', 'foreach i in range(5):'],
      correctAnswer: 0
    },
    {
      id: 8,
      question: 'How do you define a function in Python?',
      options: ['function myFunc():', 'def myFunc():', 'func myFunc():', 'create myFunc():'],
      correctAnswer: 1
    },
    {
      id: 9,
      question: 'What is the output of len("Hello")?',
      options: ['4', '5', '6', 'Error'],
      correctAnswer: 1
    },
    {
      id: 10,
      question: 'Which keyword is used for conditional statements in Python?',
      options: ['switch', 'when', 'if', 'case'],
      correctAnswer: 2
    }
  ],
  'data-structures': [
    {
      id: 1,
      question: 'What is the time complexity of accessing an element in an array by index?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
      correctAnswer: 2
    },
    {
      id: 2,
      question: 'Which data structure uses LIFO (Last In First Out)?',
      options: ['Queue', 'Stack', 'Linked List', 'Tree'],
      correctAnswer: 1
    },
    {
      id: 3,
      question: 'What is the time complexity of binary search?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
      correctAnswer: 1
    },
    {
      id: 4,
      question: 'Which data structure is used to implement BFS (Breadth-First Search)?',
      options: ['Stack', 'Queue', 'Array', 'Linked List'],
      correctAnswer: 1
    },
    {
      id: 5,
      question: 'What is the worst-case time complexity of Quick Sort?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
      correctAnswer: 2
    },
    {
      id: 6,
      question: 'What is a complete binary tree?',
      options: ['All nodes have 2 children', 'All levels are completely filled except possibly the last', 'All leaf nodes are at the same level', 'The tree has no children'],
      correctAnswer: 1
    },
    {
      id: 7,
      question: 'Which data structure is best for implementing a priority queue?',
      options: ['Array', 'Linked List', 'Heap', 'Stack'],
      correctAnswer: 2
    },
    {
      id: 8,
      question: 'What is the time complexity of inserting at the beginning of a linked list?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
      correctAnswer: 2
    },
    {
      id: 9,
      question: 'Which sorting algorithm has the best average-case time complexity?',
      options: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Insertion Sort'],
      correctAnswer: 2
    },
    {
      id: 10,
      question: 'What is a hash collision?',
      options: ['When two keys map to the same index', 'When a hash table is full', 'When a key cannot be hashed', 'When deleting from hash table'],
      correctAnswer: 0
    }
  ],
  'system-design': [
    {
      id: 1,
      question: 'What is horizontal scaling?',
      options: ['Adding more power to existing machine', 'Adding more machines to handle load', 'Reducing server count', 'Upgrading database'],
      correctAnswer: 1
    },
    {
      id: 2,
      question: 'What does CAP theorem stand for?',
      options: ['Consistency, Availability, Partition tolerance', 'Cache, API, Protocol', 'Compute, Architecture, Performance', 'Connection, Availability, Processing'],
      correctAnswer: 0
    },
    {
      id: 3,
      question: 'What is the primary purpose of a load balancer?',
      options: ['Store data', 'Distribute traffic across servers', 'Encrypt data', 'Cache responses'],
      correctAnswer: 1
    },
    {
      id: 4,
      question: 'What is a CDN used for?',
      options: ['Database management', 'Serving content from locations closer to users', 'User authentication', 'API management'],
      correctAnswer: 1
    },
    {
      id: 5,
      question: 'What is database sharding?',
      options: ['Backing up data', 'Splitting data across multiple databases', 'Encrypting data', 'Indexing data'],
      correctAnswer: 1
    },
    {
      id: 6,
      question: 'What is the purpose of a message queue?',
      options: ['Store user messages', 'Decouple services and handle async processing', 'Send emails', 'Log errors'],
      correctAnswer: 1
    },
    {
      id: 7,
      question: 'What is eventual consistency?',
      options: ['Data is always consistent', 'Data will become consistent over time', 'Data is never consistent', 'Consistency is not important'],
      correctAnswer: 1
    },
    {
      id: 8,
      question: 'What is a microservices architecture?',
      options: ['Small servers', 'Application as collection of loosely coupled services', 'Compressed code', 'Minimal database'],
      correctAnswer: 1
    },
    {
      id: 9,
      question: 'What is caching used for in system design?',
      options: ['Permanent storage', 'Reducing latency by storing frequently accessed data', 'User authentication', 'Load balancing'],
      correctAnswer: 1
    },
    {
      id: 10,
      question: 'What is a rate limiter?',
      options: ['Speeds up requests', 'Controls the rate of requests to prevent overload', 'Increases server capacity', 'Manages database connections'],
      correctAnswer: 1
    }
  ]
};

const QUIZZES_DATA = [
  {
    id: 'web-fundamentals',
    title: 'Web Development Fundamentals',
    description: 'Test your knowledge of HTML, CSS, and JavaScript basics',
    category: 'Web Development',
    difficulty: 'Beginner',
    timeLimit: 10,
    rating: 4.7
  },
  {
    id: 'python-basics',
    title: 'Python Programming Basics',
    description: 'Essential Python concepts every developer should know',
    category: 'Programming',
    difficulty: 'Beginner',
    timeLimit: 10,
    rating: 4.9
  },
  {
    id: 'data-structures',
    title: 'Data Structures & Algorithms',
    description: 'Common data structures and algorithmic concepts',
    category: 'Computer Science',
    difficulty: 'Intermediate',
    timeLimit: 15,
    rating: 4.8
  },
  {
    id: 'system-design',
    title: 'System Design Principles',
    description: 'Advanced concepts in software architecture and system design',
    category: 'Software Engineering',
    difficulty: 'Advanced',
    timeLimit: 15,
    rating: 4.6
  }
];

// Result emoji and message based on score percentage
const getResultFeedback = (percentage) => {
  if (percentage === 100) {
    return { emoji: '🎉', message: 'Perfect Score! You\'re a genius!', color: '#4CAF50' };
  } else if (percentage >= 80) {
    return { emoji: '😊', message: 'Great job! Almost perfect!', color: '#8BC34A' };
  } else if (percentage >= 60) {
    return { emoji: '🙂', message: 'Good effort! Keep learning!', color: '#FFC107' };
  } else if (percentage >= 40) {
    return { emoji: '😐', message: 'Not bad! Room for improvement.', color: '#FF9800' };
  } else if (percentage > 0) {
    return { emoji: '😕', message: 'Keep practicing! You\'ll get better!', color: '#FF5722' };
  } else {
    return { emoji: '😢', message: 'Don\'t give up! Try again!', color: '#f44336' };
  }
};

function Quizzes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficulty, setDifficulty] = useState('');
  
  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  const filteredQuizzes = QUIZZES_DATA.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = !difficulty || quiz.difficulty === difficulty;
    return matchesSearch && matchesDifficulty;
  });

  const difficulties = [
    { value: '', label: 'All Levels' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' }
  ];

  // Timer effect
  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0 && !showResults) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setShowResults(true);
            setQuizStarted(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, showResults]);

  const handleStartQuiz = useCallback((quizId) => {
    const quiz = QUIZZES_DATA.find(q => q.id === quizId);
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setTimeLeft(quiz.timeLimit * 60);
    setQuizStarted(true);
  }, []);

  const handleSelectAnswer = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    const questions = QUESTIONS_DATA[activeQuiz.id];
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    setQuizStarted(false);
  };

  const handleBackToQuizzes = () => {
    setActiveQuiz(null);
    setShowResults(false);
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
  };

  const handleRetryQuiz = () => {
    handleStartQuiz(activeQuiz.id);
  };

  const calculateScore = () => {
    if (!activeQuiz) return { correct: 0, total: 0, percentage: 0 };
    const questions = QUESTIONS_DATA[activeQuiz.id];
    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Quiz Taking View
  if (activeQuiz && !showResults) {
    const questions = QUESTIONS_DATA[activeQuiz.id];
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="quizzes">
        <div className="quiz-taking-container">
          <div className="quiz-taking-header">
            <button className="back-btn" onClick={handleBackToQuizzes}>
              ← Back
            </button>
            <h2>{activeQuiz.title}</h2>
            <div className={`timer ${timeLeft < 60 ? 'warning' : ''}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-text">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              className="question-card"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="question-text">{currentQuestion.question}</h3>
              <div className="options-container">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    className={`option-btn ${selectedAnswers[currentQuestion.id] === index ? 'selected' : ''}`}
                    onClick={() => handleSelectAnswer(currentQuestion.id, index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span className="option-text">{option}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="quiz-navigation">
            <button
              className="nav-btn prev"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              ← Previous
            </button>
            
            {currentQuestionIndex === questions.length - 1 ? (
              <button className="nav-btn submit" onClick={handleSubmitQuiz}>
                Submit Quiz ✓
              </button>
            ) : (
              <button className="nav-btn next" onClick={handleNextQuestion}>
                Next →
              </button>
            )}
          </div>

          <div className="question-dots">
            {questions.map((q, index) => (
              <button
                key={q.id}
                className={`dot ${index === currentQuestionIndex ? 'active' : ''} ${selectedAnswers[q.id] !== undefined ? 'answered' : ''}`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Results View
  if (activeQuiz && showResults) {
    const questions = QUESTIONS_DATA[activeQuiz.id];
    const score = calculateScore();
    const feedback = getResultFeedback(score.percentage);

    return (
      <div className="quizzes">
        <div className="results-container">
          <motion.div
            className="results-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="results-emoji" style={{ color: feedback.color }}>
              {feedback.emoji}
            </div>
            <h2 className="results-title">{feedback.message}</h2>
            <div className="results-score">
              <span className="score-number" style={{ color: feedback.color }}>
                {score.correct}/{score.total}
              </span>
              <span className="score-percentage">({score.percentage}%)</span>
            </div>
            <p className="results-quiz-name">{activeQuiz.title}</p>

            <div className="results-summary">
              <div className="summary-item correct">
                <span className="summary-icon">✅</span>
                <span>{score.correct} Correct</span>
              </div>
              <div className="summary-item incorrect">
                <span className="summary-icon">❌</span>
                <span>{score.total - score.correct} Incorrect</span>
              </div>
            </div>

            <div className="results-actions">
              <button className="action-btn retry" onClick={handleRetryQuiz}>
                🔄 Try Again
              </button>
              <button className="action-btn back" onClick={handleBackToQuizzes}>
                📋 All Quizzes
              </button>
            </div>
          </motion.div>

          <motion.div
            className="answers-review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3>📝 Answer Review</h3>
            {questions.map((q, index) => {
              const userAnswer = selectedAnswers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div key={q.id} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="review-header">
                    <span className="review-number">Q{index + 1}</span>
                    <span className="review-status">{isCorrect ? '✅' : '❌'}</span>
                  </div>
                  <p className="review-question">{q.question}</p>
                  <div className="review-answers">
                    <p className={`your-answer ${isCorrect ? 'correct' : 'wrong'}`}>
                      Your answer: {userAnswer !== undefined ? q.options[userAnswer] : 'Not answered'}
                    </p>
                    {!isCorrect && (
                      <p className="correct-answer">
                        Correct answer: {q.options[q.correctAnswer]}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    );
  }

  // Quiz List View
  return (
    <motion.div 
      className="quizzes"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="quizzes-container">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          📝 Skill Assessment Quizzes
        </motion.h1>

        <motion.div 
          className="quiz-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <input 
            type="text" 
            placeholder="Search quizzes..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            className="filter-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            {difficulties.map(diff => (
              <option key={diff.value} value={diff.value}>
                {diff.label}
              </option>
            ))}
          </select>
        </motion.div>

        {filteredQuizzes.length === 0 ? (
          <div className="no-quizzes">
            No quizzes match your search criteria
          </div>
        ) : (
          <motion.div 
            className="quizzes-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {filteredQuizzes.map((quiz, index) => {
              const questions = QUESTIONS_DATA[quiz.id];
              return (
                <motion.div 
                  key={quiz.id}
                  className="quiz-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="quiz-header">
                    <h2>{quiz.title}</h2>
                    <span className={`quiz-badge ${quiz.difficulty.toLowerCase()}`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                  <p>{quiz.description}</p>
                  <div className="quiz-meta">
                    <span>{quiz.category}</span>
                  </div>
                  <div className="quiz-details">
                    <div className="detail">
                      <span className="detail-value">{questions.length}</span>
                      <span className="detail-label">Questions</span>
                    </div>
                    <div className="detail">
                      <span className="detail-value">{quiz.timeLimit}m</span>
                      <span className="detail-label">Time Limit</span>
                    </div>
                    <div className="detail">
                      <span className="detail-value">⭐ {quiz.rating}</span>
                      <span className="detail-label">Rating</span>
                    </div>
                  </div>
                  <button 
                    className="start-button"
                    onClick={() => handleStartQuiz(quiz.id)}
                  >
                    Start Quiz →
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default Quizzes;
