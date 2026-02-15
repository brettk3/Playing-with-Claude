import { useState, useCallback } from 'react';
import { analyzeSentiment } from '../services/sentimentAgent';

export function useSentiment() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = useCallback(async (stockData) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const sentiment = await analyzeSentiment(stockData);
      setResult(sentiment);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, analyze, reset };
}
