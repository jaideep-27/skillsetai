import React, { useState, useRef, useEffect } from 'react';
import { processChatResponse } from '../utils/textProcessor';
import { getAITutorResponse } from '../services/languageModel';
import './AITutorChat.css';

const AITutorChat = ({ tutorType }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    setMessages(prev => [...prev, { 
      type: 'user',
      content: userMessage
    }]);

    try {
      const reply = await getAITutorResponse(tutorType, userMessage);
      setMessages(prev => [...prev, {
        type: 'ai',
        content: processChatResponse(reply)
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

  return (
    <div className="aitutor-chat-window">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`chat-message ${msg.type}`}
          >
            <div 
              className="message-content"
              dangerouslySetInnerHTML={{ __html: msg.content }}
            />
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
          placeholder="Ask your tutor a question..."
          disabled={isLoading}
        />
        <button 
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
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
