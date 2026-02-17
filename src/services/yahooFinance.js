const CHART_CONFIGS = {
  '1D': { interval: '5m', range: '1d' },
  '1W': { interval: '15m', range: '5d' },
  '1M': { interval: '1h', range: '1mo' },
  '3M': { interval: '1d', range: '3mo' },
  '1Y': { interval: '1d', range: '1y' },
  'ALL': { interval: '1wk', range: 'max' },
};

function getBaseUrl() {
  if (import.meta.env.DEV) {
    return '/api/yahoo';
  }
  return 'https://corsproxy.io/?url=' + encodeURIComponent('https://query2.finance.yahoo.com');
}

async function yahooFetch(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchQuoteSummary(symbol) {
  const base = getBaseUrl();
  const url = `${base}/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;

  const json = await yahooFetch(url);

  if (json.chart?.error) {
    throw new Error(json.chart.error.description || `No data for ${symbol}`);
  }

  const result = json.chart?.result?.[0];
  if (!result) {
    throw new Error(`No data available for ${symbol}`);
  }

  return normalizeChartData(result, symbol);
}

export async function fetchChartData(symbol, period = '1M') {
  const config = CHART_CONFIGS[period] || CHART_CONFIGS['1M'];
  const base = getBaseUrl();
  const url = `${base}/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${config.interval}&range=${config.range}`;

  const json = await yahooFetch(url);

  const result = json.chart?.result?.[0];
  if (!result) return [];

  const timestamps = result.timestamp || [];
  const quotes = result.indicators?.quote?.[0] || {};

  return timestamps.map((ts, i) => ({
    time: ts,
    open: quotes.open?.[i] ?? null,
    high: quotes.high?.[i] ?? null,
    low: quotes.low?.[i] ?? null,
    close: quotes.close?.[i] ?? null,
    volume: quotes.volume?.[i] ?? null,
  })).filter(d => d.close != null);
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

    marketCap: null,
    trailingPE: null,
    forwardPE: null,
    priceToSales: null,
    priceToBook: null,
    pegRatio: null,
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

    chartPrices: quotes.close?.filter((v) => v != null) || [],
  };
}
