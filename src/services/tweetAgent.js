import { groqChat } from './groqClient';

export async function generateBtcTweet(stockData, style = 'hype') {
  const { currentPrice, dayChangePercent, dayHigh, dayLow,
    fiftyTwoWeekHigh, fiftyTwoWeekLow, marketCap, volume } = stockData;

  const changeStr = ((dayChangePercent ?? 0) * 100).toFixed(2);
  const direction = dayChangePercent >= 0 ? 'up' : 'down';

  const styleGuides = {
    hype: 'Write like a hyped-up crypto influencer. Use energy, urgency, and excitement. Emojis encouraged.',
    analyst: 'Write like a calm, data-driven analyst. Reference specific numbers. Professional but accessible.',
    meme: 'Write like a crypto meme lord. Funny, irreverent, use internet culture references. Maximum entertainment value.',
    breaking: 'Write like a breaking news anchor. Urgent, factual, dramatic. "BREAKING:" style.',
  };

  const prompt = `You are a Bitcoin tweet generator agent. Generate a single tweet (max 280 characters) about Bitcoin's current price action.

Current BTC data:
- Price: $${currentPrice?.toLocaleString()}
- 24h Change: ${changeStr}% (${direction})
- Day High: $${dayHigh?.toLocaleString()}
- Day Low: $${dayLow?.toLocaleString()}
- 52W High: $${fiftyTwoWeekHigh?.toLocaleString()}
- 52W Low: $${fiftyTwoWeekLow?.toLocaleString()}
- Market Cap: $${marketCap?.toLocaleString()}
- Volume: ${volume?.toLocaleString()}

Style: ${styleGuides[style] || styleGuides.hype}

Respond with ONLY the tweet text. No quotes, no explanation, no prefix. Just the tweet.`;

  return groqChat(prompt, { temperature: 0.9 });
}
