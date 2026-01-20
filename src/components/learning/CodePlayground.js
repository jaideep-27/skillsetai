import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { executeJavaScript } from '../../services/codeExecutor';
import './CodePlayground.css';

const CodePlayground = ({
    initialCode = '// Write your code here\nconsole.log("Hello, World!");',
    language = 'javascript',
    theme = 'vs-dark',
    readOnly = false,
    showOutput = true,
    height = '400px',
    onCodeChange
}) => {
    const [code, setCode] = useState(initialCode);
    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        // Configure editor options
        editor.updateOptions({
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            automaticLayout: true
        });
    };

    const handleCodeChange = (value) => {
        setCode(value);
        if (onCodeChange) {
            onCodeChange(value);
        }
    };

    const runCode = async () => {
        setIsRunning(true);
        setOutput(null);

        try {
            const result = await executeJavaScript(code);
            setOutput(result);
        } catch (error) {
            setOutput({
                success: false,
                error: error.message,
                logs: [],
                errors: [error.message],
                warnings: []
            });
        } finally {
            setIsRunning(false);
        }
    };

    const clearOutput = () => {
        setOutput(null);
    };

    const resetCode = () => {
        setCode(initialCode);
        setOutput(null);
    };

    return (
        <div className="code-playground">
            <div className="playground-header">
                <div className="playground-title">
                    <span className="code-icon">⚡</span>
                    <span>Code Playground</span>
                </div>
                <div className="playground-controls">
                    <button
                        className="control-btn run-btn"
                        onClick={runCode}
                        disabled={isRunning || readOnly}
                    >
                        {isRunning ? (
                            <>
                                <span className="spinner"></span>
                                Running...
                            </>
                        ) : (
                            <>
                                <span>▶</span>
                                Run Code
                            </>
                        )}
                    </button>
                    <button
                        className="control-btn reset-btn"
                        onClick={resetCode}
                        disabled={readOnly}
                    >
                        ↻ Reset
                    </button>
                    {output && (
                        <button
                            className="control-btn clear-btn"
                            onClick={clearOutput}
                        >
                            ✕ Clear Output
                        </button>
                    )}
                </div>
            </div>

            <div className="editor-container">
                <Editor
                    height={height}
                    defaultLanguage={language}
                    language={language}
                    theme={theme}
                    value={code}
                    onChange={handleCodeChange}
                    onMount={handleEditorDidMount}
                    options={{
                        readOnly: readOnly,
                        domReadOnly: readOnly
                    }}
                />
            </div>

            {showOutput && output && (
                <div className="output-container">
                    <div className="output-header">
                        <span>Output</span>
                        {output.executionTime && (
                            <span className="execution-time">
                                ⏱ {output.executionTime}ms
                            </span>
                        )}
                    </div>

                    <div className="output-content">
                        {output.success ? (
                            <>
                                {output.logs.length > 0 && (
                                    <div className="output-section logs">
                                        {output.logs.map((log, index) => (
                                            <div key={index} className="output-line log">
                                                <span className="output-icon">📝</span>
                                                {log}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {output.result !== undefined && (
                                    <div className="output-section result">
                                        <div className="output-line">
                                            <span className="output-icon">→</span>
                                            <span className="result-label">Result: </span>
                                            <span className="result-value">{output.result}</span>
                                        </div>
                                    </div>
                                )}

                                {output.warnings.length > 0 && (
                                    <div className="output-section warnings">
                                        {output.warnings.map((warning, index) => (
                                            <div key={index} className="output-line warning">
                                                <span className="output-icon">⚠️</span>
                                                {warning}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="output-section errors">
                                <div className="output-line error">
                                    <span className="output-icon">❌</span>
                                    <strong>Error:</strong> {output.error}
                                </div>
                                {output.errors.slice(1).map((error, index) => (
                                    <div key={index} className="output-line error">
                                        <span className="output-icon"></span>
                                        {error}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodePlayground;
