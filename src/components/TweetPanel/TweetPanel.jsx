import { useState, useEffect } from 'react';
import { useTweetAgent } from '../../hooks/useTweetAgent';
import styles from './TweetPanel.module.css';

const STYLES = [
  { id: 'hype', label: 'Hype' },
  { id: 'analyst', label: 'Analyst' },
  { id: 'meme', label: 'Meme' },
  { id: 'breaking', label: 'Breaking' },
];

export default function TweetPanel({ stockData }) {
  const { tweet, loading, error, generate, reset } = useTweetAgent();
  const [style, setStyle] = useState('hype');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    reset();
  }, [stockData?.symbol, reset]);

  if (!stockData?.isCrypto) return null;

  const handleGenerate = () => generate(stockData, style);

  const handleCopy = async () => {
    if (!tweet) return;
    await navigator.clipboard.writeText(tweet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Bitcoin Tweet Agent</h3>

      <div className={styles.controls}>
        {STYLES.map((s) => (
          <button
            key={s.id}
            className={`${styles.styleBtn} ${style === s.id ? styles.styleBtnActive : ''}`}
            onClick={() => setStyle(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          Generating tweet...
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <div>{error}</div>
          <button className={styles.retryBtn} onClick={handleGenerate}>
            Try Again
          </button>
        </div>
      ) : tweet ? (
        <div className={styles.tweetCard}>
          <div className={styles.tweetHeader}>
            <span className={styles.tweetLabel}>Generated Tweet</span>
            <span className={`${styles.charCount} ${tweet.length > 280 ? styles.charOver : ''}`}>
              {tweet.length}/280
            </span>
          </div>
          <div className={styles.tweetBody}>{tweet}</div>
          <div className={styles.tweetActions}>
            <button
              className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button className={styles.regenerateBtn} onClick={handleGenerate}>
              Regenerate
            </button>
          </div>
        </div>
      ) : (
        <button className={styles.generateBtn} onClick={handleGenerate}>
          Generate a Bitcoin Tweet
        </button>
      )}
    </div>
  );
}
