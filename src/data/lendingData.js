// Mock Figure lending metrics data
// All monetary values in USD

export const SUMMARY_METRICS = {
  totalLoansGuaranteed: 12_847,
  totalLoansGuaranteedDelta: 0.086,        // +8.6% QoQ
  totalPortfolioBalance: 4_210_000_000,    // $4.21B
  totalPortfolioBalanceDelta: 0.112,
  helocOutstandingBalance: 3_140_000_000,  // $3.14B
  helocOutstandingBalanceDelta: 0.094,
  totalRevenue: 187_400_000,               // $187.4M (TTM)
  totalRevenueDelta: 0.073,
  netInterestIncome: 143_200_000,          // $143.2M (TTM)
  netInterestIncomeDelta: 0.058,
  originationFeeRevenue: 44_200_000,       // $44.2M (TTM)
  originationFeeRevenueDelta: 0.127,
  weightedAvgFico: 738,
  weightedAvgFicoDelta: 0.006,
  weightedAvgLtv: 0.643,                   // 64.3%
  weightedAvgLtvDelta: -0.009,
  defaultRate: 0.0118,                     // 1.18%
  defaultRateDelta: -0.0014,
  delinquency30Plus: 0.0234,               // 2.34%
  delinquency30PlusDelta: -0.0021,
  netChargeOffRate: 0.0082,                // 0.82%
  netChargeOffRateDelta: -0.0009,
  netInterestMargin: 0.0412,               // 4.12%
  netInterestMarginDelta: 0.0018,
  returnOnAssets: 0.034,                   // 3.4%
  returnOnAssetsDelta: 0.002,
  avgLoanSize: 127_400,                    // $127,400
  avgLoanSizeDelta: 0.022,
  weightedAvgCoupon: 0.0889,              // 8.89%
  costOfFunds: 0.0477,                    // 4.77%
  revenuePrLoan: 14_590,                  // $14,590
};

export const PRODUCTS = [
  {
    id: 'heloc',
    name: 'Home Equity Line of Credit',
    shortName: 'HELOC',
    badge: 'Flagship',
    loansOriginated: 9_214,
    originatedDelta: 0.092,
    outstandingBalance: 3_140_000_000,
    avgLoanSize: 148_200,
    avgFico: 742,
    avgLtv: 0.621,
    avgRate: 0.0912,
    delinquencyRate: 0.0198,
    defaultRate: 0.0101,
    nco: 0.0071,
    shareOfPortfolio: 0.746,
  },
  {
    id: 'personal',
    name: 'Personal Loans',
    shortName: 'Personal',
    badge: null,
    loansOriginated: 2_418,
    originatedDelta: 0.054,
    outstandingBalance: 712_000_000,
    avgLoanSize: 42_300,
    avgFico: 728,
    avgLtv: null,
    avgRate: 0.1344,
    delinquencyRate: 0.0342,
    defaultRate: 0.0178,
    nco: 0.0124,
    shareOfPortfolio: 0.169,
  },
  {
    id: 'mortgage',
    name: 'Mortgage Refinance',
    shortName: 'Mortgage',
    badge: null,
    loansOriginated: 1_215,
    originatedDelta: 0.038,
    outstandingBalance: 358_000_000,
    avgLoanSize: 294_800,
    avgFico: 751,
    avgLtv: 0.714,
    avgRate: 0.0698,
    delinquencyRate: 0.0218,
    defaultRate: 0.0089,
    nco: 0.0055,
    shareOfPortfolio: 0.085,
  },
];

// Monthly originations (last 12 months, ending Feb 2026)
export const MONTHLY_ORIGINATIONS = [
  { month: 'Mar', loans: 978,  volume: 124_600_000 },
  { month: 'Apr', loans: 1_012, volume: 129_100_000 },
  { month: 'May', loans: 1_088, volume: 138_400_000 },
  { month: 'Jun', loans: 1_141, volume: 144_900_000 },
  { month: 'Jul', loans: 1_098, volume: 140_200_000 },
  { month: 'Aug', loans: 1_167, volume: 148_500_000 },
  { month: 'Sep', loans: 1_204, volume: 153_200_000 },
  { month: 'Oct', loans: 1_193, volume: 151_800_000 },
  { month: 'Nov', loans: 1_142, volume: 145_400_000 },
  { month: 'Dec', loans: 1_087, volume: 138_700_000 },
  { month: 'Jan', loans: 1_231, volume: 156_900_000 },
  { month: 'Feb', loans: 1_306, volume: 166_400_000 },
];

export const CREDIT_BUCKETS = [
  { range: '780+',     share: 0.28, avgLtv: 0.581 },
  { range: '740–779',  share: 0.31, avgLtv: 0.628 },
  { range: '700–739',  share: 0.22, avgLtv: 0.664 },
  { range: '660–699',  share: 0.13, avgLtv: 0.697 },
  { range: '<660',     share: 0.06, avgLtv: 0.721 },
];

export const AS_OF_DATE = 'February 2026';
export const REPORTING_PERIOD = 'Q4 2025 / TTM';
