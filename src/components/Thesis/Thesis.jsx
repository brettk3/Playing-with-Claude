import styles from './Thesis.module.css';

const PILLARS = [
  {
    num: '01',
    title: 'Exceptional Founders',
    desc: 'We back rare individuals with uncommon drive, domain expertise, and the resilience to navigate uncertainty. We look for missionaries, not mercenaries.',
  },
  {
    num: '02',
    title: 'Large, Emergent Markets',
    desc: 'We seek opportunities in markets that are undergoing fundamental transformation — where incumbents are slow and startups can redefine the category.',
  },
  {
    num: '03',
    title: 'Unfair Advantages',
    desc: 'The best companies are built on durable moats: proprietary technology, network effects, unique distribution, or regulatory expertise that compounds over time.',
  },
  {
    num: '04',
    title: 'Capital Efficiency',
    desc: 'We favor founders who build resourcefully. The discipline forged early creates the culture that scales — companies that do more with less win.',
  },
];

export default function Thesis() {
  return (
    <section className={styles.thesis} id="thesis">
      <div className="container">
        <div className={styles.header}>
          <p className="section-label">Investment Thesis</p>
          <h2 className="section-title">What We Believe</h2>
          <div className="gold-divider" />
          <p className="section-subtitle">
            We have a clear point of view on where venture returns are generated and
            what separates enduring companies from the rest.
          </p>
        </div>

        <div className={styles.pillars}>
          {PILLARS.map((p) => (
            <div key={p.num} className={styles.pillar}>
              <div className={styles.pillarNum}>{p.num}</div>
              <h3 className={styles.pillarTitle}>{p.title}</h3>
              <p className={styles.pillarDesc}>{p.desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.quote}>
          <blockquote className={styles.quoteText}>
            "We don&apos;t invest in ideas — we invest in the people who refuse to
            stop until the idea becomes a reality."
          </blockquote>
          <cite className={styles.quoteCite}>— BC Ventures</cite>
        </div>
      </div>
    </section>
  );
}
