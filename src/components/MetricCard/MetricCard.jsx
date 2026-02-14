import styles from './MetricCard.module.css';

export default function MetricCard({ label, value, sublabel }) {
  if (value === '\u2014' || value == null) return null;

  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {sublabel && <span className={styles.sublabel}>{sublabel}</span>}
    </div>
  );
}
