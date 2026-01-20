import React, { useState } from 'react';
import CodePlayground from './CodePlayground';
import { validateCodeWithTests } from '../../services/codeExecutor';
import './CodingChallenge.css';

const CodingChallenge = ({ challenge }) => {
    const [testResults, setTestResults] = useState(null);
    const [currentCode, setCurrentCode] = useState(challenge.starterCode || '');
    const [isValidating, setIsValidating] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [currentHintIndex, setCurrentHintIndex] = useState(0);

    const handleCodeChange = (code) => {
        setCurrentCode(code);
        // Clear test results when code changes
        setTestResults(null);
    };

    const runTests = async () => {
        setIsValidating(true);
        try {
            const results = await validateCodeWithTests(currentCode, challenge.testCases);
            setTestResults(results);
        } catch (error) {
            console.error('Test validation error:', error);
        } finally {
            setIsValidating(false);
        }
    };

    const showNextHint = () => {
        if (challenge.hints && currentHintIndex < challenge.hints.length - 1) {
            setCurrentHintIndex(currentHintIndex + 1);
        }
        setShowHint(true);
    };

    const allTestsPassed = testResults && testResults.every(r => r.passed);
    const passedCount = testResults ? testResults.filter(r => r.passed).length : 0;
    const totalTests = challenge.testCases?.length || 0;

    return (
        <div className="coding-challenge">
            <div className="challenge-header">
                <div className="challenge-title-section">
                    <h3 className="challenge-title">{challenge.title}</h3>
                    <span className={`difficulty-badge ${challenge.difficulty}`}>
                        {challenge.difficulty}
                    </span>
                </div>
            </div>

            <div className="challenge-content">
                <div className="challenge-description">
                    <h4>Description</h4>
                    <p>{challenge.description}</p>

                    {challenge.examples && challenge.examples.length > 0 && (
                        <div className="examples-section">
                            <h4>Examples</h4>
                            {challenge.examples.map((example, index) => (
                                <div key={index} className="example">
                                    <div className="example-label">Example {index + 1}:</div>
                                    <pre className="example-code">
                                        <div>Input: {example.input}</div>
                                        <div>Output: {example.output}</div>
                                    </pre>
                                </div>
                            ))}
                        </div>
                    )}

                    {challenge.constraints && (
                        <div className="constraints-section">
                            <h4>Constraints</h4>
                            <ul>
                                {challenge.constraints.map((constraint, index) => (
                                    <li key={index}>{constraint}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="challenge-editor-section">
                    <CodePlayground
                        initialCode={challenge.starterCode}
                        onCodeChange={handleCodeChange}
                        height="350px"
                        showOutput={false}
                    />

                    <div className="challenge-actions">
                        <button
                            className="test-btn"
                            onClick={runTests}
                            disabled={isValidating}
                        >
                            {isValidating ? (
                                <>
                                    <span className="spinner"></span>
                                    Running Tests...
                                </>
                            ) : (
                                <>
                                    ✓ Run Tests
                                </>
                            )}
                        </button>

                        {challenge.hints && challenge.hints.length > 0 && (
                            <button
                                className="hint-btn"
                                onClick={showNextHint}
                                disabled={currentHintIndex >= challenge.hints.length - 1 && showHint}
                            >
                                💡 {showHint ? 'Next Hint' : 'Show Hint'}
                                {showHint && ` (${currentHintIndex + 1}/${challenge.hints.length})`}
                            </button>
                        )}
                    </div>

                    {showHint && challenge.hints && (
                        <div className="hint-box">
                            <div className="hint-header">
                                💡 Hint {currentHintIndex + 1}
                            </div>
                            <div className="hint-content">
                                {challenge.hints[currentHintIndex]}
                            </div>
                        </div>
                    )}

                    {testResults && (
                        <div className="test-results">
                            <div className="test-results-header">
                                <span>Test Results</span>
                                <span className={`test-count ${allTestsPassed ? 'success' : 'partial'}`}>
                                    {passedCount}/{totalTests} Passed
                                </span>
                            </div>

                            {allTestsPassed && (
                                <div className="success-message">
                                    <span className="success-icon">🎉</span>
                                    <span>All tests passed! Great job!</span>
                                </div>
                            )}

                            <div className="test-cases-list">
                                {testResults.map((result, index) => (
                                    <div key={index} className={`test-case ${result.passed ? 'passed' : 'failed'}`}>
                                        <div className="test-case-header">
                                            <span className="test-status">
                                                {result.passed ? '✓' : '✗'}
                                            </span>
                                            <span className="test-name">{result.testCase}</span>
                                        </div>
                                        {!result.passed && (
                                            <div className="test-details">
                                                {result.error ? (
                                                    <div className="test-error">Error: {result.error}</div>
                                                ) : (
                                                    <>
                                                        <div className="test-detail">
                                                            <span className="detail-label">Expected:</span>
                                                            <span className="detail-value">{String(result.expected)}</span>
                                                        </div>
                                                        <div className="test-detail">
                                                            <span className="detail-label">Got:</span>
                                                            <span className="detail-value">{String(result.actual)}</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CodingChallenge;
