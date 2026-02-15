import { useEffect } from 'react';
import { useSentiment } from '../../hooks/useSentiment';
import styles from './SentimentPanel.module.css';

const SENTIMENT_ICONS = {
  BULLISH: '\u2197',
  BEARISH: '\u2198',
  NEUTRAL: '\u2194',
};

export default function SentimentPanel({ stockData }) {
  const { result, loading, error, analyze, reset } = useSentiment();

  useEffect(() => {
    reset();
  }, [stockData?.symbol, reset]);

  if (!stockData) return null;

  const handleAnalyze = () => analyze(stockData);

  if (loading) {
    return (
      <div className={styles.panel}>
        <h3 className={styles.title}>AI Sentiment Agent</h3>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          Analyzing {stockData.name}...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.panel}>
        <h3 className={styles.title}>AI Sentiment Agent</h3>
        <div className={styles.errorState}>
          <div>{error}</div>
          <button className={styles.retryBtn} onClick={handleAnalyze}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={styles.panel}>
        <h3 className={styles.title}>AI Sentiment Agent</h3>
        <button className={styles.triggerBtn} onClick={handleAnalyze}>
          <span className={styles.sparkle}>&#9733;</span>
          Analyze {stockData.name} with AI
        </button>
      </div>
    );
  }

  const sentimentClass = styles[result.sentiment.toLowerCase()] || styles.neutral;
  const icon = SENTIMENT_ICONS[result.sentiment] || SENTIMENT_ICONS.NEUTRAL;

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>AI Sentiment Agent</h3>
      <div className={styles.resultCard}>
        <div className={styles.resultHeader}>
          <span className={`${styles.sentimentBadge} ${sentimentClass}`}>
            {icon} {result.sentiment}
            <span className={styles.confidence}>
              Confidence: {result.confidence}/10
            </span>
          </span>
          <button className={styles.refreshBtn} onClick={handleAnalyze}>
            Re-analyze
          </button>
        </div>

        <div className={styles.summary}>{result.summary}</div>

        <div className={`${styles.section}`}>
          <div className={styles.sectionLabel}>Key Reasons</div>
          <ul className={`${styles.list} ${styles.reasons}`}>
            {result.reasons?.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Risks</div>
          <ul className={`${styles.list} ${styles.risks}`}>
            {result.risks?.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>

        {result.outlook && (
          <div className={styles.outlook}>{result.outlook}</div>
        )}
      </div>
    </div>
  );
}
