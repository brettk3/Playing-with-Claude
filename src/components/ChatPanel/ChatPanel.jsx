import { useState, useRef, useEffect } from 'react';
import styles from './ChatPanel.module.css';

const QUICK_PROMPTS = [
  'Give me a quick analysis',
  'What are the risks?',
  'Should I buy more?',
  'Compare to competitors',
];

export default function ChatPanel({ messages, loading, onSend, onClear, stockData }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setInput('');
  };

  const handleQuickPrompt = (prompt) => {
    if (loading) return;
    onSend(prompt);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className={styles.title}>AI Analyst</span>
          {stockData && (
            <span className={styles.context}>{stockData.symbol}</span>
          )}
        </div>
        {messages.length > 0 && (
          <button className={styles.clearBtn} onClick={onClear} title="Clear chat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        )}
      </div>

      <div className={styles.messages}>
        {messages.length === 0 && !loading && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <p className={styles.emptyTitle}>
              {stockData
                ? `Ask me about ${stockData.name}`
                : 'Select a stock to chat about'}
            </p>
            {stockData && (
              <div className={styles.quickPrompts}>
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    className={styles.quickBtn}
                    onClick={() => handleQuickPrompt(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.aiMsg}`}
          >
            {msg.role === 'assistant' && (
              <div className={styles.aiAvatar}>AI</div>
            )}
            <div className={styles.msgContent}>
              <div className={styles.msgText}>
                {msg.content.split('\n').map((line, j) => (
                  <span key={j}>
                    {line}
                    {j < msg.content.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className={`${styles.message} ${styles.aiMsg}`}>
            <div className={styles.aiAvatar}>AI</div>
            <div className={styles.msgContent}>
              <div className={styles.typing}>
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className={styles.inputArea} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder={stockData ? `Ask about ${stockData.symbol}...` : 'Select a stock first...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!stockData || loading}
        />
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={!input.trim() || loading || !stockData}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
}
