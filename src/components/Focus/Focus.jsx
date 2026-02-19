import styles from './Focus.module.css';

const SECTORS = [
  {
    icon: '⬡',
    name: 'Artificial Intelligence',
    desc: 'Foundation models, vertical AI applications, and AI-native infrastructure redefining how industries operate.',
  },
  {
    icon: '⬡',
    name: 'Future of Work',
    desc: 'Tools that empower individuals and teams — from automation to remote collaboration and workforce intelligence.',
  },
  {
    icon: '⬡',
    name: 'Fintech & Financial Infrastructure',
    desc: 'Payments, lending, insurance, and capital markets platforms built for the digital-first generation.',
  },
  {
    icon: '⬡',
    name: 'Health & Biotech',
    desc: 'Digital health, diagnostics, and biotech companies improving outcomes and access at scale.',
  },
  {
    icon: '⬡',
    name: 'Climate & Sustainability',
    desc: 'Technology-driven approaches to decarbonization, clean energy, and sustainable supply chains.',
  },
  {
    icon: '⬡',
    name: 'Consumer & Commerce',
    desc: 'Next-generation consumer brands, social commerce, and platforms that reshape how people buy and connect.',
  },
];

export default function Focus() {
  return (
    <section className={styles.focus} id="focus">
      <div className="container">
        <div className={styles.header}>
          <p className="section-label">Sectors</p>
          <h2 className="section-title">Where We Invest</h2>
          <div className="gold-divider" />
          <p className="section-subtitle">
            We are sector-informed, not sector-constrained. We follow exceptional
            founders wherever they build.
          </p>
        </div>

        <div className={styles.grid}>
          {SECTORS.map((s) => (
            <div key={s.name} className={styles.card}>
              <div className={styles.cardIcon}>{s.icon}</div>
              <h3 className={styles.cardName}>{s.name}</h3>
              <p className={styles.cardDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
