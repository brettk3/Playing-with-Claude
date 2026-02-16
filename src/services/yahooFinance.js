function getBaseUrl() {
  if (import.meta.env.DEV) {
    return '/api/yahoo';
  }
  return 'https://corsproxy.io/?url=' + encodeURIComponent('https://query2.finance.yahoo.com');
}

export async function fetchQuoteSummary(symbol) {
  const base = getBaseUrl();
  const url = `${base}/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch data for ${symbol} (HTTP ${res.status})`);
  }

  const json = await res.json();

  if (json.chart?.error) {
    throw new Error(json.chart.error.description || `No data for ${symbol}`);
  }

  const result = json.chart?.result?.[0];
  if (!result) {
    throw new Error(`No data available for ${symbol}`);
  }

  return normalizeChartData(result, symbol);
}

function normalizeChartData(result, symbol) {
  const meta = result.meta || {};
  const quotes = result.indicators?.quote?.[0] || {};

  const isCrypto = meta.instrumentType === 'CRYPTOCURRENCY';

  const previousClose = meta.chartPreviousClose ?? null;
  const currentPrice = meta.regularMarketPrice ?? null;
  const dayChange = (currentPrice != null && previousClose != null)
    ? currentPrice - previousClose
    : null;
  const dayChangePercent = (dayChange != null && previousClose)
    ? dayChange / previousClose
    : null;

  return {
    symbol,
    name: meta.longName || meta.shortName || symbol,
    quoteType: meta.instrumentType === 'CRYPTOCURRENCY' ? 'CRYPTOCURRENCY' : 'EQUITY',
    isCrypto,
    currency: meta.currency || 'USD',

    currentPrice,
    previousClose,
    dayChange,
    dayChangePercent,
    dayHigh: meta.regularMarketDayHigh ?? null,
    dayLow: meta.regularMarketDayLow ?? null,
    volume: meta.regularMarketVolume ?? null,

    fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh ?? null,
    fiftyTwoWeekLow: meta.fiftyTwoWeekLow ?? null,

    // These fields aren't available from v8 chart, set to null
    trailingPE: null,
    forwardPE: null,
    priceToSales: null,
    priceToBook: null,
    pegRatio: null,
    marketCap: null,
    enterpriseValue: null,
    beta: null,
    trailingEps: null,
    forwardEps: null,
    profitMargins: null,
    operatingMargins: null,
    returnOnEquity: null,
    revenueGrowth: null,
    debtToEquity: null,
    freeCashflow: null,
    dividendYield: null,
    circulatingSupply: null,
    recommendationKey: null,

    // Chart data for sparkline
    chartPrices: quotes.close?.filter((v) => v != null) || [],
  };
}
