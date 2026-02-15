export async function analyzeSentiment(stockData) {
  const { symbol, name, isCrypto, currentPrice, dayChangePercent, marketCap,
    trailingPE, forwardPE, priceToBook, returnOnEquity, profitMargins,
    revenueGrowth, debtToEquity, fiftyTwoWeekHigh, fiftyTwoWeekLow,
    recommendationKey, beta, dividendYield, pegRatio } = stockData;

  const metricsBlock = isCrypto
    ? `Price: $${currentPrice}, Day Change: ${(dayChangePercent * 100).toFixed(2)}%, Market Cap: ${marketCap}`
    : [
        `Price: $${currentPrice}`,
        `Day Change: ${((dayChangePercent ?? 0) * 100).toFixed(2)}%`,
        marketCap && `Market Cap: ${marketCap}`,
        trailingPE && `P/E (TTM): ${trailingPE.toFixed(1)}`,
        forwardPE && `P/E (FWD): ${forwardPE.toFixed(1)}`,
        priceToBook && `P/B: ${priceToBook.toFixed(2)}`,
        pegRatio && `PEG: ${pegRatio.toFixed(2)}`,
        returnOnEquity && `ROE: ${(returnOnEquity * 100).toFixed(1)}%`,
        profitMargins && `Profit Margin: ${(profitMargins * 100).toFixed(1)}%`,
        revenueGrowth && `Revenue Growth: ${(revenueGrowth * 100).toFixed(1)}%`,
        debtToEquity && `D/E: ${debtToEquity.toFixed(1)}`,
        beta && `Beta: ${beta.toFixed(2)}`,
        dividendYield && `Div Yield: ${(dividendYield * 100).toFixed(2)}%`,
        fiftyTwoWeekHigh && `52W High: $${fiftyTwoWeekHigh}`,
        fiftyTwoWeekLow && `52W Low: $${fiftyTwoWeekLow}`,
        recommendationKey && `Analyst Rating: ${recommendationKey}`,
      ].filter(Boolean).join('\n');

  const prompt = `You are a sharp, concise financial analyst AI agent. Analyze ${name} (${symbol}) and give your sentiment assessment.

Here are the current metrics:
${metricsBlock}

Respond in this exact JSON format (no markdown, no code fences):
{
  "sentiment": "BULLISH" | "BEARISH" | "NEUTRAL",
  "confidence": 1-10,
  "summary": "One sentence overall take",
  "reasons": ["reason 1", "reason 2", "reason 3"],
  "risks": ["risk 1", "risk 2"],
  "outlook": "One sentence forward-looking statement"
}

Be specific to this company. Reference actual metrics. Be opinionated.`;

  const res = await fetch('/api/anthropic/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${text}`);
  }

  const json = await res.json();
  const content = json.content?.[0]?.text;

  if (!content) {
    throw new Error('Empty response from AI');
  }

  return JSON.parse(content);
}
