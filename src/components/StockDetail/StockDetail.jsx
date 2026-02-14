import { useStockData } from '../../hooks/useStockData';
import {
  formatCurrency,
  formatLargeNumber,
  formatNumber,
  formatPercent,
  formatVolume,
  formatChangePercent,
} from '../../utils/formatters';
import MetricCard from '../MetricCard/MetricCard';
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
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.nameRow}>
            <h2 className={styles.companyName}>{data.name}</h2>
            {data.isCrypto && <span className={styles.cryptoBadge}>CRYPTO</span>}
          </div>
          <span className={styles.ticker}>{data.symbol}</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.price}>
            {formatCurrency(data.currentPrice, data.currency)}
          </span>
          <span className={`${styles.dayChange} ${isPositive ? styles.positive : styles.negative}`}>
            {formatCurrency(Math.abs(data.dayChange), data.currency)}{' '}
            ({formatChangePercent(data.dayChangePercent)})
          </span>
        </div>
      </header>

      <div className={styles.metricsGrid}>
        {data.isCrypto ? (
          <>
            <MetricCard label="Market Cap" value={formatLargeNumber(data.marketCap)} />
            <MetricCard label="24h Volume" value={formatVolume(data.volume)} />
            <MetricCard label="Circulating Supply" value={data.circulatingSupply ? formatVolume(data.circulatingSupply) : null} />
            <MetricCard label="52-Week High" value={formatCurrency(data.fiftyTwoWeekHigh, data.currency)} />
            <MetricCard label="52-Week Low" value={formatCurrency(data.fiftyTwoWeekLow, data.currency)} />
            <MetricCard
              label="Day Range"
              value={data.dayLow && data.dayHigh ? `${formatCurrency(data.dayLow, data.currency)} - ${formatCurrency(data.dayHigh, data.currency)}` : null}
            />
          </>
        ) : (
          <>
            <MetricCard label="P/E Ratio (TTM)" value={formatNumber(data.trailingPE)} sublabel="Trailing 12 months" />
            <MetricCard label="P/E Ratio (FWD)" value={formatNumber(data.forwardPE)} sublabel="Forward estimate" />
            <MetricCard label="Price / Sales" value={formatNumber(data.priceToSales)} />
            <MetricCard label="Price / Book" value={formatNumber(data.priceToBook)} />
            <MetricCard label="Market Cap" value={formatLargeNumber(data.marketCap)} />
            <MetricCard label="EPS (TTM)" value={formatCurrency(data.trailingEps)} sublabel="Trailing 12 months" />
            <MetricCard label="Return on Equity" value={formatPercent(data.returnOnEquity)} />
            <MetricCard label="Profit Margin" value={formatPercent(data.profitMargins)} />
          </>
        )}
      </div>

      <div className={styles.additionalMetrics}>
        <h3 className={styles.sectionTitle}>Additional Details</h3>
        <div className={styles.detailGrid}>
          {!data.isCrypto && (
            <>
              <DetailRow label="52-Week High" value={formatCurrency(data.fiftyTwoWeekHigh, data.currency)} />
              <DetailRow label="52-Week Low" value={formatCurrency(data.fiftyTwoWeekLow, data.currency)} />
              <DetailRow label="Volume" value={formatVolume(data.volume)} />
              <DetailRow label="Revenue Growth" value={formatPercent(data.revenueGrowth)} />
              <DetailRow label="Operating Margin" value={formatPercent(data.operatingMargins)} />
              <DetailRow label="Debt / Equity" value={data.debtToEquity != null ? formatNumber(data.debtToEquity) : null} />
              <DetailRow label="Dividend Yield" value={formatPercent(data.dividendYield)} />
              <DetailRow label="Beta" value={formatNumber(data.beta)} />
              <DetailRow label="PEG Ratio" value={formatNumber(data.pegRatio)} />
              <DetailRow label="Enterprise Value" value={formatLargeNumber(data.enterpriseValue)} />
              <DetailRow label="Free Cash Flow" value={data.freeCashflow != null ? formatLargeNumber(data.freeCashflow) : null} />
              {data.recommendationKey && (
                <DetailRow
                  label="Analyst Rating"
                  value={data.recommendationKey.toUpperCase()}
                  isHighlighted
                />
              )}
            </>
          )}
          {data.isCrypto && (
            <>
              <DetailRow label="Day High" value={formatCurrency(data.dayHigh, data.currency)} />
              <DetailRow label="Day Low" value={formatCurrency(data.dayLow, data.currency)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, isHighlighted }) {
  if (value == null || value === '\u2014') return null;

  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={`${styles.detailValue} ${isHighlighted ? styles.highlighted : ''}`}>
        {value}
      </span>
    </div>
  );
}
