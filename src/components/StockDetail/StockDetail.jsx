import { useState } from 'react';
import { useStockData } from '../../hooks/useStockData';
import {
  formatCurrency,
  formatLargeNumber,
  formatNumber,
  formatPercent,
  formatVolume,
  formatChangePercent,
} from '../../utils/formatters';
import SentimentPanel from '../SentimentPanel/SentimentPanel';
import TweetPanel from '../TweetPanel/TweetPanel';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ErrorState from '../ErrorState/ErrorState';
import styles from './StockDetail.module.css';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'financials', label: 'Financials' },
  { id: 'analysis', label: 'AI Analysis' },
];

export default function StockDetail({ symbol, holding }) {
  const { data, isLoading, error, refetch } = useStockData(symbol);
  const [activeTab, setActiveTab] = useState('overview');

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
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <div className={styles.nameRow}>
              <h2 className={styles.companyName}>{data.name}</h2>
              {data.isCrypto && <span className={styles.cryptoBadge}>CRYPTO</span>}
            </div>
            <span className={styles.ticker}>{data.symbol}</span>
          </div>
          <div className={styles.headerRight}>
            <span className={`${styles.price} ${isPositive ? styles.positive : styles.negative}`}>
              {formatCurrency(data.currentPrice, data.currency)}
            </span>
            <span className={`${styles.dayChange} ${isPositive ? styles.positive : styles.negative}`}>
              {isPositive ? '+' : ''}{formatCurrency(data.dayChange, data.currency)}{' '}
              ({formatChangePercent(data.dayChangePercent)})
            </span>
          </div>
        </div>

        <div className={styles.quickStats}>
          <QuickStat label="Open" value={formatCurrency(data.dayLow, data.currency)} />
          <QuickStat label="High" value={formatCurrency(data.dayHigh, data.currency)} />
          <QuickStat label="Low" value={formatCurrency(data.dayLow, data.currency)} />
          <QuickStat label="Vol" value={formatVolume(data.volume)} />
          <QuickStat label="Mkt Cap" value={formatLargeNumber(data.marketCap)} />
          {!data.isCrypto && <QuickStat label="P/E" value={formatNumber(data.trailingPE)} />}
          {data.isCrypto && <QuickStat label="Supply" value={data.circulatingSupply ? formatVolume(data.circulatingSupply) : null} />}
        </div>
      </header>

      <nav className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className={styles.tabContent}>
        {activeTab === 'overview' && <OverviewTab data={data} />}
        {activeTab === 'financials' && <FinancialsTab data={data} />}
        {activeTab === 'analysis' && (
          <div className={styles.analysisTab}>
            <SentimentPanel stockData={data} />
            <TweetPanel stockData={data} />
          </div>
        )}
      </div>
    </div>
  );
}

function QuickStat({ label, value }) {
  if (value == null || value === '\u2014') return null;
  return (
    <div className={styles.quickStat}>
      <span className={styles.quickStatLabel}>{label}</span>
      <span className={styles.quickStatValue}>{value}</span>
    </div>
  );
}

function OverviewTab({ data }) {
  return (
    <div className={styles.overviewGrid}>
      <div className={styles.statsSection}>
        <h3 className={styles.sectionTitle}>Key Statistics</h3>
        <div className={styles.statsTable}>
          {data.isCrypto ? (
            <>
              <StatRow label="Market Cap" value={formatLargeNumber(data.marketCap)} />
              <StatRow label="24h Volume" value={formatVolume(data.volume)} />
              <StatRow label="Circulating Supply" value={data.circulatingSupply ? formatVolume(data.circulatingSupply) : null} />
              <StatRow label="52-Week High" value={formatCurrency(data.fiftyTwoWeekHigh, data.currency)} />
              <StatRow label="52-Week Low" value={formatCurrency(data.fiftyTwoWeekLow, data.currency)} />
              <StatRow label="Day High" value={formatCurrency(data.dayHigh, data.currency)} />
              <StatRow label="Day Low" value={formatCurrency(data.dayLow, data.currency)} />
            </>
          ) : (
            <>
              <StatRow label="Market Cap" value={formatLargeNumber(data.marketCap)} />
              <StatRow label="P/E (TTM)" value={formatNumber(data.trailingPE)} />
              <StatRow label="P/E (FWD)" value={formatNumber(data.forwardPE)} />
              <StatRow label="EPS (TTM)" value={formatCurrency(data.trailingEps)} />
              <StatRow label="EPS (FWD)" value={formatCurrency(data.forwardEps)} />
              <StatRow label="Dividend Yield" value={formatPercent(data.dividendYield)} />
              <StatRow label="52-Week High" value={formatCurrency(data.fiftyTwoWeekHigh, data.currency)} />
              <StatRow label="52-Week Low" value={formatCurrency(data.fiftyTwoWeekLow, data.currency)} />
              <StatRow label="Volume" value={formatVolume(data.volume)} />
              <StatRow label="Beta" value={formatNumber(data.beta)} />
              {data.recommendationKey && (
                <StatRow label="Analyst Rating" value={data.recommendationKey.toUpperCase()} highlight />
              )}
            </>
          )}
        </div>
      </div>

      <div className={styles.statsSection}>
        <h3 className={styles.sectionTitle}>Valuation</h3>
        <div className={styles.statsTable}>
          {data.isCrypto ? (
            <>
              <StatRow label="Price" value={formatCurrency(data.currentPrice, data.currency)} />
              <StatRow
                label="Day Range"
                value={data.dayLow && data.dayHigh ? `${formatCurrency(data.dayLow, data.currency)} - ${formatCurrency(data.dayHigh, data.currency)}` : null}
              />
            </>
          ) : (
            <>
              <StatRow label="Price / Sales" value={formatNumber(data.priceToSales)} />
              <StatRow label="Price / Book" value={formatNumber(data.priceToBook)} />
              <StatRow label="PEG Ratio" value={formatNumber(data.pegRatio)} />
              <StatRow label="Enterprise Value" value={formatLargeNumber(data.enterpriseValue)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FinancialsTab({ data }) {
  if (data.isCrypto) {
    return (
      <div className={styles.emptyTab}>
        <p>Financial data is not available for cryptocurrencies.</p>
      </div>
    );
  }

  return (
    <div className={styles.overviewGrid}>
      <div className={styles.statsSection}>
        <h3 className={styles.sectionTitle}>Profitability</h3>
        <div className={styles.statsTable}>
          <StatRow label="Profit Margin" value={formatPercent(data.profitMargins)} />
          <StatRow label="Operating Margin" value={formatPercent(data.operatingMargins)} />
          <StatRow label="Return on Equity" value={formatPercent(data.returnOnEquity)} />
          <StatRow label="Revenue Growth" value={formatPercent(data.revenueGrowth)} />
        </div>
      </div>

      <div className={styles.statsSection}>
        <h3 className={styles.sectionTitle}>Balance Sheet</h3>
        <div className={styles.statsTable}>
          <StatRow label="Debt / Equity" value={data.debtToEquity != null ? formatNumber(data.debtToEquity) : null} />
          <StatRow label="Free Cash Flow" value={data.freeCashflow != null ? formatLargeNumber(data.freeCashflow) : null} />
          <StatRow label="Enterprise Value" value={formatLargeNumber(data.enterpriseValue)} />
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, highlight }) {
  if (value == null || value === '\u2014') return null;
  return (
    <div className={styles.statRow}>
      <span className={styles.statLabel}>{label}</span>
      <span className={`${styles.statValue} ${highlight ? styles.highlighted : ''}`}>{value}</span>
    </div>
  );
}
