import { useStockData } from '../../hooks/useStockData';
import {
  formatCurrency,
  formatLargeNumber,
  formatVolume,
  formatChangePercent,
} from '../../utils/formatters';
import Chart from '../Chart/Chart';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ErrorState from '../ErrorState/ErrorState';
import styles from './StockDetail.module.css';

export default function StockDetail({ symbol, holding }) {
  const { data, isLoading, error, refetch } = useStockData(symbol);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <ErrorState
          symbol={symbol}
          error={error}
          note={holding?.note}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!data) return null;

  const isPositive = (data.dayChangePercent ?? 0) >= 0;

  return (
    <div className={styles.detail}>
      {/* Price Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.nameRow}>
            <h1 className={styles.companyName}>{data.name}</h1>
            {data.isCrypto && <span className={styles.badge}>CRYPTO</span>}
          </div>
          <span className={styles.ticker}>{data.symbol}</span>
        </div>
        <div className={styles.headerRight}>
          <span className={`${styles.price} ${isPositive ? styles.positive : styles.negative}`}>
            {formatCurrency(data.currentPrice, data.currency)}
          </span>
          <span className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
            {isPositive ? '+' : ''}{formatCurrency(data.dayChange, data.currency)}{' '}
            ({formatChangePercent(data.dayChangePercent)})
          </span>
        </div>
      </header>

      {/* Chart */}
      <div className={styles.chartSection}>
        <Chart symbol={symbol} isPositive={isPositive} />
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatCard label="Day High" value={formatCurrency(data.dayHigh, data.currency)} />
        <StatCard label="Day Low" value={formatCurrency(data.dayLow, data.currency)} />
        <StatCard label="Volume" value={formatVolume(data.volume)} />
        <StatCard label="52W High" value={formatCurrency(data.fiftyTwoWeekHigh, data.currency)} />
        <StatCard label="52W Low" value={formatCurrency(data.fiftyTwoWeekLow, data.currency)} />
        <StatCard label="Prev Close" value={formatCurrency(data.previousClose, data.currency)} />
        {data.marketCap && <StatCard label="Mkt Cap" value={formatLargeNumber(data.marketCap)} />}
      </div>

      {/* Sparkline mini chart (5-day prices) */}
      {data.chartPrices.length > 1 && (
        <div className={styles.sparklineSection}>
          <h3 className={styles.sectionTitle}>5-Day Price Movement</h3>
          <MiniSparkline prices={data.chartPrices} isPositive={isPositive} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  if (!value || value === '\u2014') return null;
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}

function MiniSparkline({ prices, isPositive }) {
  const width = 600;
  const height = 60;
  const padding = 4;

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const points = prices.map((p, i) => {
    const x = padding + (i / (prices.length - 1)) * (width - padding * 2);
    const y = height - padding - ((p - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const fillPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;
  const color = isPositive ? '#0ecb81' : '#f6465d';

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={styles.sparkline}>
      <polygon points={fillPoints} fill={color} fillOpacity="0.08" />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
