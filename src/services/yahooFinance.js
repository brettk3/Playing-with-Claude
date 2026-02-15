const MODULES = 'price,summaryDetail,defaultKeyStatistics,financialData';

function getBaseUrl() {
  if (import.meta.env.DEV) {
    return '/api/yahoo';
  }
  return 'https://corsproxy.io/?url=' + encodeURIComponent('https://query2.finance.yahoo.com');
}

export async function fetchQuoteSummary(symbol) {
  const base = getBaseUrl();
  const url = `${base}/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=${MODULES}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch data for ${symbol} (HTTP ${res.status})`);
  }

  const json = await res.json();

  if (json.quoteSummary?.error) {
    throw new Error(json.quoteSummary.error.description || `No data for ${symbol}`);
  }

  const result = json.quoteSummary?.result?.[0];
  if (!result) {
    throw new Error(`No data available for ${symbol}`);
  }

  return normalizeStockData(result, symbol);
}

function normalizeStockData(raw, symbol) {
  const price = raw.price || {};
  const summary = raw.summaryDetail || {};
  const keyStats = raw.defaultKeyStatistics || {};
  const financial = raw.financialData || {};

  const isCrypto = price.quoteType === 'CRYPTOCURRENCY';

  return {
    symbol,
    name: price.longName || price.shortName || symbol,
    quoteType: price.quoteType,
    isCrypto,
    currency: price.currency || 'USD',

    currentPrice: price.regularMarketPrice?.raw ?? financial.currentPrice?.raw ?? null,
    dayChange: price.regularMarketChange?.raw ?? null,
    dayChangePercent: price.regularMarketChangePercent?.raw ?? null,
    dayHigh: price.regularMarketDayHigh?.raw ?? null,
    dayLow: price.regularMarketDayLow?.raw ?? null,
    volume: price.regularMarketVolume?.raw ?? null,

    trailingPE: summary.trailingPE?.raw ?? null,
    forwardPE: summary.forwardPE?.raw ?? keyStats.forwardPE?.raw ?? null,
    priceToSales: summary.priceToSalesTrailing12Months?.raw ?? null,
    priceToBook: keyStats.priceToBook?.raw ?? null,
    pegRatio: keyStats.pegRatio?.raw ?? null,

    marketCap: price.marketCap?.raw ?? null,
    enterpriseValue: keyStats.enterpriseValue?.raw ?? null,
    fiftyTwoWeekHigh: summary.fiftyTwoWeekHigh?.raw ?? null,
    fiftyTwoWeekLow: summary.fiftyTwoWeekLow?.raw ?? null,
    beta: summary.beta?.raw ?? null,

    trailingEps: keyStats.trailingEps?.raw ?? null,
    forwardEps: keyStats.forwardEps?.raw ?? null,
    profitMargins: financial.profitMargins?.raw ?? null,
    operatingMargins: financial.operatingMargins?.raw ?? null,
    returnOnEquity: financial.returnOnEquity?.raw ?? null,
    revenueGrowth: financial.revenueGrowth?.raw ?? null,
    debtToEquity: financial.debtToEquity?.raw ?? null,
    freeCashflow: financial.freeCashflow?.raw ?? null,
    dividendYield: summary.dividendYield?.raw ?? null,

    circulatingSupply: summary.circulatingSupply?.raw ?? null,

    recommendationKey: financial.recommendationKey ?? null,
  };
}
