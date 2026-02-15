import { useState, useCallback } from 'react';
import { HOLDINGS } from '../data/holdings';

const STORAGE_KEY = 'watchlist';

function loadWatchlist() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return HOLDINGS;
}

function saveWatchlist(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function useWatchlist() {
  const [holdings, setHoldings] = useState(loadWatchlist);

  const addTicker = useCallback((symbol, name = '') => {
    const upper = symbol.toUpperCase().trim();
    if (!upper) return false;

    setHoldings((prev) => {
      if (prev.some((h) => h.symbol === upper)) return prev;
      const isCrypto = upper.endsWith('-USD');
      const next = [...prev, { symbol: upper, name: name || upper, type: isCrypto ? 'crypto' : 'stock' }];
      saveWatchlist(next);
      return next;
    });
    return true;
  }, []);

  const removeTicker = useCallback((symbol) => {
    setHoldings((prev) => {
      const next = prev.filter((h) => h.symbol !== symbol);
      saveWatchlist(next);
      return next;
    });
  }, []);

  return { holdings, addTicker, removeTicker };
}
