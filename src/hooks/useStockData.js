import { useState, useEffect, useCallback } from 'react';
import { fetchQuoteSummary } from '../services/yahooFinance';

const cache = new Map();

export function useStockData(symbol) {
  const [data, setData] = useState(cache.get(symbol) || null);
  const [isLoading, setIsLoading] = useState(!cache.has(symbol));
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!symbol) return;

    if (cache.has(symbol)) {
      setData(cache.get(symbol));
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchQuoteSummary(symbol);
      cache.set(symbol, result);
      setData(result);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    cache.delete(symbol);
    fetchData();
  }, [symbol, fetchData]);

  return { data, isLoading, error, refetch };
}

export function useAllStockData(holdings) {
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      setLoading(true);
      const results = await Promise.allSettled(
        holdings.map(async (h) => {
          if (cache.has(h.symbol)) {
            return { symbol: h.symbol, data: cache.get(h.symbol) };
          }
          const data = await fetchQuoteSummary(h.symbol);
          cache.set(h.symbol, data);
          return { symbol: h.symbol, data };
        })
      );

      if (cancelled) return;

      const dataMap = {};
      results.forEach((result, i) => {
        const symbol = holdings[i].symbol;
        if (result.status === 'fulfilled') {
          dataMap[symbol] = { data: result.value.data, error: null };
        } else {
          dataMap[symbol] = { data: null, error: result.reason?.message || 'Failed to load' };
        }
      });

      setAllData(dataMap);
      setLoading(false);
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [holdings]);

  return { allData, loading };
}
