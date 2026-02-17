import { useState, useCallback, useRef } from 'react';
import { groqChat } from '../services/groqClient';

function buildSystemPrompt(stockData) {
  if (!stockData) {
    return `You are an AI stock analyst assistant embedded in a Webull-style portfolio tracker.
Help users understand their investments. Be concise, data-driven, and actionable.
Keep responses under 150 words. Use bullet points for clarity.`;
  }

  const { name, symbol, isCrypto, currentPrice, dayChange, dayChangePercent,
    dayHigh, dayLow, volume, fiftyTwoWeekHigh, fiftyTwoWeekLow } = stockData;

  const changeStr = dayChangePercent != null
    ? `${dayChangePercent >= 0 ? '+' : ''}${(dayChangePercent * 100).toFixed(2)}%`
    : 'N/A';

  return `You are an AI stock analyst assistant embedded in a Webull-style portfolio tracker.
The user is viewing: ${name} (${symbol}) ${isCrypto ? '[CRYPTO]' : '[STOCK]'}

Current Data:
- Price: $${currentPrice?.toFixed(2) ?? 'N/A'}
- Day Change: ${dayChange != null ? `$${dayChange.toFixed(2)}` : 'N/A'} (${changeStr})
- Day Range: $${dayLow?.toFixed(2) ?? 'N/A'} - $${dayHigh?.toFixed(2) ?? 'N/A'}
- Volume: ${volume?.toLocaleString() ?? 'N/A'}
- 52W High: $${fiftyTwoWeekHigh?.toFixed(2) ?? 'N/A'}
- 52W Low: $${fiftyTwoWeekLow?.toFixed(2) ?? 'N/A'}

Provide sharp, concise analysis. Reference actual data. Be opinionated but balanced.
Keep responses under 150 words. Use bullet points when listing multiple points.
If asked about a different stock, use your general knowledge but note you only have live data for ${symbol}.`;
}

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const historyRef = useRef([]);

  const sendMessage = useCallback(async (userMessage, stockData) => {
    const userMsg = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    historyRef.current.push(userMsg);

    setLoading(true);

    try {
      const systemPrompt = buildSystemPrompt(stockData);
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...historyRef.current.slice(-10),
      ];

      const response = await groqChat(apiMessages);
      const assistantMsg = { role: 'assistant', content: response };
      historyRef.current.push(assistantMsg);
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg = { role: 'assistant', content: `Unable to get response: ${err.message}` };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    historyRef.current = [];
  }, []);

  return { messages, loading, sendMessage, clearChat };
}
