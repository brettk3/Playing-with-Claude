import { useState } from 'react';
import styles from './Sidebar.module.css';
import { formatCurrency, formatChangePercent } from '../../utils/formatters';

export default function Sidebar({ holdings, allData, selectedSymbol, onSelect, onAdd, onRemove, loading }) {
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  const handleAdd = (e) => {
    e.preventDefault();
    const trimmed = input.trim().toUpperCase();
    if (trimmed && onAdd(trimmed)) {
      setInput('');
    }
  };

  const filtered = holdings.filter((h) => {
    if (filter === 'stocks') return h.type !== 'crypto';
    if (filter === 'crypto') return h.type === 'crypto';
    return true;
  });

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.logo}>TradeView AI</span>
      </div>

      <form className={styles.addForm} onSubmit={handleAdd}>
        <input
          className={styles.addInput}
          type="text"
          placeholder="Add symbol (e.g. AAPL, ETH-USD)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className={styles.addBtn} type="submit" disabled={!input.trim()}>+</button>
      </form>

      <div className={styles.filters}>
        {['all', 'stocks', 'crypto'].map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span className={styles.count}>{filtered.length}</span>
      </div>

      <div className={styles.listHeader}>
        <span>Symbol</span>
        <span>Last Price</span>
        <span>Chg%</span>
      </div>

      <div className={styles.list}>
        {filtered.map((holding) => {
          const stockInfo = allData[holding.symbol];
          const data = stockInfo?.data;
          const isActive = selectedSymbol === holding.symbol;
          const changePercent = data?.dayChangePercent;
          const isPositive = (changePercent ?? 0) >= 0;

          return (
            <div
              key={holding.symbol}
              className={`${styles.row} ${isActive ? styles.rowActive : ''}`}
              onClick={() => onSelect(holding.symbol)}
            >
              <div className={styles.symbolCol}>
                <span className={styles.symbol}>{holding.symbol}</span>
                <span className={styles.name}>{holding.name}</span>
              </div>
              <div className={styles.priceCol}>
                {data ? (
                  <span className={styles.price}>
                    {formatCurrency(data.currentPrice, data.currency)}
                  </span>
                ) : stockInfo?.error ? (
                  <span className={styles.errorText}>ERR</span>
                ) : (
                  <span className={styles.loadingText}>--</span>
                )}
              </div>
              <div className={styles.changeCol}>
                {data ? (
                  <span className={`${styles.changeBadge} ${isPositive ? styles.positive : styles.negative}`}>
                    {formatChangePercent(changePercent)}
                  </span>
                ) : (
                  <span className={styles.loadingText}>--</span>
                )}
              </div>
              <button
                className={styles.removeBtn}
                onClick={(e) => { e.stopPropagation(); onRemove(holding.symbol); }}
                title="Remove"
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className={styles.loadingBar}>
          <div className={styles.loadingBarInner} />
        </div>
      )}
    </aside>
  );
}
