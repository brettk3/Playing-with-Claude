import styles from './HoldingCard.module.css';
import { formatCurrency, formatChangePercent } from '../../utils/formatters';

export default function HoldingCard({ holding, stockData, isActive, onClick }) {
  const { symbol, name, type } = holding;
  const data = stockData?.data;
  const hasError = stockData?.error;

  return (
    <button
      className={`${styles.card} ${isActive ? styles.active : ''} ${hasError ? styles.hasError : ''}`}
      onClick={onClick}
    >
      <div className={styles.left}>
        <div className={styles.symbolRow}>
          <span className={styles.symbol}>{symbol}</span>
          {type === 'crypto' && <span className={styles.badge}>CRYPTO</span>}
        </div>
        <span className={styles.name}>{name}</span>
      </div>
      <div className={styles.right}>
        {data ? (
          <>
            <span className={styles.price}>
              {formatCurrency(data.currentPrice, data.currency)}
            </span>
            <span
              className={`${styles.change} ${
                data.dayChangePercent >= 0 ? styles.positive : styles.negative
              }`}
            >
              {formatChangePercent(data.dayChangePercent)}
            </span>
          </>
        ) : hasError ? (
          <span className={styles.errorDot} title={stockData.error} />
        ) : (
          <span className={styles.loading}>...</span>
        )}
      </div>
    </button>
  );
}
