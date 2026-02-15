import { useState, useCallback } from 'react';
import { generateBtcTweet } from '../services/tweetAgent';

export function useTweetAgent() {
  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async (stockData, style) => {
    setLoading(true);
    setError(null);
    try {
      const text = await generateBtcTweet(stockData, style);
      setTweet(text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTweet(null);
    setError(null);
  }, []);

  return { tweet, loading, error, generate, reset };
}
