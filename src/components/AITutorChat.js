import React, { useState, useRef, useEffect } from 'react';
import { processChatResponse } from '../utils/textProcessor';
import { getAITutorResponse } from '../services/languageModel';
import { parseResponse } from '../utils/parsers/responseParser';
import { useSpeech } from '../hooks/useSpeech';

// Learning components
import MermaidDiagram from './learning/MermaidDiagram';
import CodePlayground from './learning/CodePlayground';
import CodingChallenge from './learning/CodingChallenge';
import AudioControls from './learning/AudioControls';

import './AITutorChat.css';

const AITutorChat = ({ tutorType }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Audio features for auditory learners
  const { isSupported, listen, stopListening, isListening } = useSpeech();
  const isAuditoryLearner = tutorType?.toLowerCase() === 'auditory';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e, messageText) => {
    e?.preventDefault();
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend) return;

    setInputMessage('');
    setIsLoading(true);

    setMessages(prev => [...prev, {
      type: 'user',
      content: textToSend
    }]);

    try {
      const reply = await getAITutorResponse(tutorType, textToSend);

      // Parse response based on learning style
      const parsed = parseResponse(reply, tutorType);

      setMessages(prev => [...prev, {
        type: 'ai',
        content: processChatResponse(reply),
        parsedContent: parsed,
        tutorType: tutorType
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      listen(
        (result) => {
          if (result.isFinal && result.transcript) {
            handleSendMessage(null, result.transcript);
          }
        },
        (error) => {
          console.error('Voice input error:', error);
          setMessages(prev => [...prev, {
            type: 'error',
            content: 'Voice input error. Please try again.'
          }]);
        }
      );
    }
  };

  const renderMessageContent = (msg) => {
    // Error messages
    if (msg.type === 'error') {
      return (
        <div className="message-content" dangerouslySetInnerHTML={{ __html: msg.content }} />
      );
    }

    // User messages
    if (msg.type === 'user') {
      return <div className="message-content">{msg.content}</div>;
    }

    // AI messages with learning-style-specific rendering
    if (msg.type === 'ai' && msg.parsedContent) {
      const { parsedContent, tutorType: msgTutorType } = msg;

      // Visual learner - render Mermaid diagrams and code blocks
      if (msgTutorType?.toLowerCase() === 'visual' && parsedContent.hasVisualContent) {
        return (
          <div className="visual-response">
            <div className="message-content" dangerouslySetInnerHTML={{ __html: msg.content }} />

            {parsedContent.mermaidDiagrams?.map((diagram, index) => (
              <MermaidDiagram
                key={`diagram-${index}`}
                chart={diagram.code}
                caption={`Diagram ${index + 1}`}
              />
            ))}

            {parsedContent.codeBlocks?.map((block, index) => (
              <CodePlayground
                key={`code-${index}`}
                initialCode={block.code}
                language={block.language}
                height="300px"
                readOnly={false}
              />
            ))}
          </div>
        );
      }

      // Auditory learner - render with audio controls
      if (msgTutorType?.toLowerCase() === 'auditory') {
        const textForSpeech = parsedContent.text || msg.content.replace(/<[^>]*>/g, '');
        return (
          <div className="auditory-response">
            <AudioControls
              text={textForSpeech}
              autoPlay={true}
            />
            <div className="message-content" dangerouslySetInnerHTML={{ __html: msg.content }} />
          </div>
        );
      }

      // Kinesthetic learner - render interactive code and challenges
      if (msgTutorType?.toLowerCase() === 'kinesthetic' && parsedContent.hasInteractiveContent) {
        return (
          <div className="kinesthetic-response">
            <div className="message-content" dangerouslySetInnerHTML={{ __html: msg.content }} />

            {parsedContent.challenges?.map((challenge, index) => (
              <CodingChallenge
                key={`challenge-${index}`}
                challenge={challenge.data}
              />
            ))}

            {parsedContent.codeBlocks?.map((block, index) => (
              <div key={`code-${index}`} className="interactive-code-section">
                <div className="code-challenge-prompt">
                  💪 <strong>Try it yourself!</strong> Modify and run this code:
                </div>
                <CodePlayground
                  initialCode={block.code}
                  language={block.language}
                  height="300px"
                  readOnly={false}
                />
              </div>
            ))}
          </div>
        );
      }
    }

    // Default rendering
    return (
      <div className="message-content" dangerouslySetInnerHTML={{ __html: msg.content }} />
    );
  };

  return (
    <div className="aitutor-chat-window">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.type}`}
          >
            {renderMessageContent(msg)}
          </div>
        ))}
        {isLoading && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={
            isAuditoryLearner
              ? "Ask a question or click the mic to speak..."
              : "Ask your tutor a question..."
          }
          disabled={isLoading}
        />

        {/* Voice input button for auditory learners */}
        {isAuditoryLearner && isSupported.recognition && (
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`voice-btn ${isListening ? 'listening' : ''}`}
            title={isListening ? 'Stop listening' : 'Voice input'}
          >
            {isListening ? '🔴' : '🎤'}
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading || (!inputMessage.trim() && !isListening)}
          className="submit-button"
        >
          <svg
            viewBox="0 0 24 24"
            className="submit-icon"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default AITutorChat;
