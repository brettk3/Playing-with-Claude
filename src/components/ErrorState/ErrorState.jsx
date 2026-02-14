import styles from './ErrorState.module.css';

export default function ErrorState({ symbol, error, note, onRetry }) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>!</div>
      <h3 className={styles.title}>Data Unavailable</h3>
      <p className={styles.symbol}>{symbol}</p>
      <p className={styles.message}>{error}</p>
      {note && <p className={styles.note}>{note}</p>}
      {onRetry && (
        <button className={styles.retryBtn} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
