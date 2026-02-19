import { useState } from 'react';
import styles from './LendingDashboard.module.css';
import {
  SUMMARY_METRICS as M,
  PRODUCTS,
  MONTHLY_ORIGINATIONS,
  CREDIT_BUCKETS,
  AS_OF_DATE,
  REPORTING_PERIOD,
} from '../../data/lendingData';

// ─── Formatting helpers ────────────────────────────────────────────────────────

function fmtBig(v) {
  if (v == null) return '—';
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
}

function fmtCount(v) {
  if (v == null) return '—';
  return v.toLocaleString('en-US');
}

function fmtPct(v, decimals = 2) {
  if (v == null) return '—';
  return `${(v * 100).toFixed(decimals)}%`;
}

function fmtCurrency(v) {
  if (v == null) return '—';
  return `$${Math.round(v).toLocaleString('en-US')}`;
}

function fmtRate(v) {
  if (v == null) return '—';
  return `${(v * 100).toFixed(2)}%`;
}

function Delta({ value }) {
  if (value == null) return null;
  const positive = value >= 0;
  const sign = positive ? '+' : '';
  const cls = positive ? styles.deltaPos : styles.deltaNeg;
  return (
    <span className={cls}>
      {sign}{(value * 100).toFixed(1)}% QoQ
    </span>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function KpiCard({ label, value, delta, highlight }) {
  return (
    <div className={`${styles.kpiCard} ${highlight ? styles.kpiHighlight : ''}`}>
      <span className={styles.kpiLabel}>{label}</span>
      <span className={styles.kpiValue}>{value}</span>
      {delta != null && <Delta value={delta} />}
    </div>
  );
}

function MetricRow({ label, value, sub }) {
  return (
    <div className={styles.metricRow}>
      <span className={styles.metricLabel}>{label}</span>
      <span className={styles.metricValue}>{value}</span>
      {sub && <span className={styles.metricSub}>{sub}</span>}
    </div>
  );
}

function SectionHeader({ label, title }) {
  return (
    <div className={styles.sectionHeader}>
      <span className="section-label">{label}</span>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className="gold-divider" />
    </div>
  );
}

function OriginationsBar() {
  const max = Math.max(...MONTHLY_ORIGINATIONS.map((m) => m.loans));
  return (
    <div className={styles.barChart}>
      <div className={styles.barGrid}>
        {MONTHLY_ORIGINATIONS.map((m) => {
          const h = (m.loans / max) * 100;
          return (
            <div key={m.month} className={styles.barCol}>
              <span className={styles.barTip}>{m.loans.toLocaleString()}</span>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ height: `${h}%` }} />
              </div>
              <span className={styles.barLabel}>{m.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CreditBucketBar() {
  return (
    <div className={styles.creditBuckets}>
      {CREDIT_BUCKETS.map((b) => (
        <div key={b.range} className={styles.bucketRow}>
          <span className={styles.bucketRange}>{b.range}</span>
          <div className={styles.bucketTrack}>
            <div
              className={styles.bucketFill}
              style={{ width: `${b.share * 100}%` }}
            />
          </div>
          <span className={styles.bucketShare}>{fmtPct(b.share, 0)}</span>
          <span className={styles.bucketLtv}>LTV {fmtPct(b.avgLtv, 1)}</span>
        </div>
      ))}
    </div>
  );
}

function ProductTable() {
  const [selected, setSelected] = useState('heloc');
  const product = PRODUCTS.find((p) => p.id === selected);

  return (
    <div className={styles.productSection}>
      <div className={styles.productTabs}>
        {PRODUCTS.map((p) => (
          <button
            key={p.id}
            className={`${styles.productTab} ${selected === p.id ? styles.productTabActive : ''}`}
            onClick={() => setSelected(p.id)}
          >
            {p.shortName}
            {p.badge && <span className={styles.productBadge}>{p.badge}</span>}
          </button>
        ))}
      </div>

      {product && (
        <div className={styles.productDetail}>
          <div className={styles.productMeta}>
            <h3 className={styles.productName}>{product.name}</h3>
            <span className={styles.portfolioShare}>
              {fmtPct(product.shareOfPortfolio, 1)} of portfolio
            </span>
          </div>

          <div className={styles.productGrid}>
            <div className={styles.productMetricCard}>
              <span className={styles.pmLabel}>Loans Originated (TTM)</span>
              <span className={styles.pmValue}>{fmtCount(product.loansOriginated)}</span>
              <Delta value={product.originatedDelta} />
            </div>
            <div className={styles.productMetricCard}>
              <span className={styles.pmLabel}>Outstanding Balance</span>
              <span className={styles.pmValue}>{fmtBig(product.outstandingBalance)}</span>
            </div>
            <div className={styles.productMetricCard}>
              <span className={styles.pmLabel}>Avg Loan Size</span>
              <span className={styles.pmValue}>{fmtCurrency(product.avgLoanSize)}</span>
            </div>
            <div className={styles.productMetricCard}>
              <span className={styles.pmLabel}>Avg FICO Score</span>
              <span className={styles.pmValue}>{product.avgFico}</span>
            </div>
            {product.avgLtv != null && (
              <div className={styles.productMetricCard}>
                <span className={styles.pmLabel}>Wtd Avg LTV</span>
                <span className={styles.pmValue}>{fmtPct(product.avgLtv, 1)}</span>
              </div>
            )}
            <div className={styles.productMetricCard}>
              <span className={styles.pmLabel}>Avg Interest Rate</span>
              <span className={styles.pmValue}>{fmtRate(product.avgRate)}</span>
            </div>
            <div className={`${styles.productMetricCard} ${styles.pmAlert}`}>
              <span className={styles.pmLabel}>30+ Day Delinquency</span>
              <span className={styles.pmValue}>{fmtPct(product.delinquencyRate)}</span>
            </div>
            <div className={`${styles.productMetricCard} ${styles.pmAlert}`}>
              <span className={styles.pmLabel}>Default Rate</span>
              <span className={styles.pmValue}>{fmtPct(product.defaultRate)}</span>
            </div>
            <div className={`${styles.productMetricCard} ${styles.pmAlert}`}>
              <span className={styles.pmLabel}>Net Charge-Off Rate</span>
              <span className={styles.pmValue}>{fmtPct(product.nco)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function LendingDashboard() {
  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <p className="section-label">Lending Analytics</p>
          <h1 className={styles.title}>Figure Lending Metrics</h1>
          <p className={styles.subtitle}>
            Portfolio performance, origination volume, and credit quality
          </p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.periodBadge}>
            <span className={styles.periodLabel}>Reporting Period</span>
            <span className={styles.periodValue}>{REPORTING_PERIOD}</span>
          </div>
          <div className={styles.periodBadge}>
            <span className={styles.periodLabel}>As of</span>
            <span className={styles.periodValue}>{AS_OF_DATE}</span>
          </div>
        </div>
      </div>

      {/* Top KPI Strip */}
      <div className={styles.kpiStrip}>
        <KpiCard
          label="Loans Guaranteed (TTM)"
          value={fmtCount(M.totalLoansGuaranteed)}
          delta={M.totalLoansGuaranteedDelta}
          highlight
        />
        <KpiCard
          label="Total Portfolio Balance"
          value={fmtBig(M.totalPortfolioBalance)}
          delta={M.totalPortfolioBalanceDelta}
        />
        <KpiCard
          label="HELOC Outstanding"
          value={fmtBig(M.helocOutstandingBalance)}
          delta={M.helocOutstandingBalanceDelta}
        />
        <KpiCard
          label="Total Revenue (TTM)"
          value={fmtBig(M.totalRevenue)}
          delta={M.totalRevenueDelta}
        />
        <KpiCard
          label="Wtd Avg FICO"
          value={M.weightedAvgFico}
          delta={M.weightedAvgFicoDelta}
        />
      </div>

      {/* Originations Chart */}
      <div className={styles.panel}>
        <SectionHeader label="Volume" title="Monthly Originations" />
        <p className={styles.panelSub}>Number of loans originated per month (last 12 months)</p>
        <OriginationsBar />
      </div>

      {/* Product Breakdown */}
      <div className={styles.panel}>
        <SectionHeader label="Products" title="Loan Product Breakdown" />
        <ProductTable />
      </div>

      {/* Two-column: Portfolio Quality + Revenue */}
      <div className={styles.twoCol}>
        {/* Portfolio / Origination Metrics */}
        <div className={styles.panel}>
          <SectionHeader label="Originations" title="Portfolio Metrics" />
          <div className={styles.metricList}>
            <MetricRow label="Avg Loan Size" value={fmtCurrency(M.avgLoanSize)} sub={`+${(M.avgLoanSizeDelta * 100).toFixed(1)}% QoQ`} />
            <MetricRow label="Wtd Avg LTV" value={fmtPct(M.weightedAvgLtv, 1)} sub={`${(M.weightedAvgLtvDelta * 100).toFixed(1)}% QoQ`} />
            <MetricRow label="Wtd Avg Coupon Rate" value={fmtRate(M.weightedAvgCoupon)} />
            <MetricRow label="Cost of Funds" value={fmtRate(M.costOfFunds)} />
            <MetricRow label="Net Interest Margin" value={fmtRate(M.netInterestMargin)} sub={`+${(M.netInterestMarginDelta * 100).toFixed(2)}% QoQ`} />
            <MetricRow label="Return on Assets" value={fmtPct(M.returnOnAssets, 1)} sub={`+${(M.returnOnAssetsDelta * 100).toFixed(1)}% QoQ`} />
            <MetricRow label="Revenue per Loan" value={fmtCurrency(M.revenuePrLoan)} />
          </div>
        </div>

        {/* Credit Quality */}
        <div className={styles.panel}>
          <SectionHeader label="Credit Quality" title="Risk Metrics" />
          <div className={styles.metricList}>
            <MetricRow
              label="30+ Day Delinquency"
              value={fmtPct(M.delinquency30Plus)}
              sub={`${(M.delinquency30PlusDelta * 100).toFixed(2)}% QoQ`}
            />
            <MetricRow
              label="Default Rate"
              value={fmtPct(M.defaultRate)}
              sub={`${(M.defaultRateDelta * 100).toFixed(2)}% QoQ`}
            />
            <MetricRow
              label="Net Charge-Off Rate"
              value={fmtPct(M.netChargeOffRate)}
              sub={`${(M.netChargeOffRateDelta * 100).toFixed(2)}% QoQ`}
            />
          </div>

          <div className={styles.creditSection}>
            <p className={styles.creditTitle}>FICO Distribution</p>
            <CreditBucketBar />
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className={styles.panel}>
        <SectionHeader label="Revenue" title="Revenue Breakdown (TTM)" />
        <div className={styles.revenueGrid}>
          <div className={styles.revenueCard}>
            <span className={styles.rvLabel}>Total Revenue</span>
            <span className={styles.rvValue}>{fmtBig(M.totalRevenue)}</span>
            <Delta value={M.totalRevenueDelta} />
          </div>
          <div className={styles.revenueCard}>
            <span className={styles.rvLabel}>Net Interest Income</span>
            <span className={styles.rvValue}>{fmtBig(M.netInterestIncome)}</span>
            <Delta value={M.netInterestIncomeDelta} />
            <span className={styles.rvShare}>{fmtPct(M.netInterestIncome / M.totalRevenue, 1)} of revenue</span>
          </div>
          <div className={styles.revenueCard}>
            <span className={styles.rvLabel}>Origination Fee Revenue</span>
            <span className={styles.rvValue}>{fmtBig(M.originationFeeRevenue)}</span>
            <Delta value={M.originationFeeRevenueDelta} />
            <span className={styles.rvShare}>{fmtPct(M.originationFeeRevenue / M.totalRevenue, 1)} of revenue</span>
          </div>
          <div className={styles.revenueCard}>
            <span className={styles.rvLabel}>Revenue per Loan</span>
            <span className={styles.rvValue}>{fmtCurrency(M.revenuePrLoan)}</span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        Data shown is illustrative and for demonstration purposes only.
        Based on publicly available Figure Technologies reporting and industry benchmarks.
      </div>
    </div>
  );
}
