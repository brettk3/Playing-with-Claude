import styles from './Sidebar.module.css';
import HoldingCard from '../HoldingCard/HoldingCard';

export default function Sidebar({ holdings, allData, selectedSymbol, onSelect, loading }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.title}>Portfolio</h1>
        <span className={styles.count}>{holdings.length} holdings</span>
      </div>
      <div className={styles.list}>
        {holdings.map((holding) => (
          <HoldingCard
            key={holding.symbol}
            holding={holding}
            stockData={allData[holding.symbol]}
            isActive={selectedSymbol === holding.symbol}
            onClick={() => onSelect(holding.symbol)}
          />
        ))}
      </div>
      {loading && (
        <div className={styles.loadingBar}>
          <div className={styles.loadingBarInner} />
        </div>
      )}
    </aside>
  );
}
