import styles from './About.module.css';

const PRINCIPLES = [
  {
    icon: '◆',
    title: 'Founder First',
    desc: 'We lead with conviction in extraordinary founders, not market maps. The right team can create a category.',
  },
  {
    icon: '◆',
    title: 'Long-Term Partners',
    desc: 'We invest at the earliest stages and stay committed through every milestone — pre-seed through exit.',
  },
  {
    icon: '◆',
    title: 'Hands-On Value',
    desc: 'Beyond capital, we bring networks, operational experience, and unfiltered strategic guidance.',
  },
];

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.left}>
            <p className="section-label">Who We Are</p>
            <h2 className="section-title">Built by Operators,<br />Backed by Conviction</h2>
            <div className="gold-divider" />
            <p className="section-subtitle">
              BC Ventures was founded by Brett and Chase — two operators-turned-investors
              who have built and scaled companies from the ground up. We understand
              what it takes to go from zero to one, and we back founders with the
              same tenacity we applied to our own journeys.
            </p>
            <p className={styles.bodyText}>
              We invest at the pre-seed and seed stages when conviction matters most
              and risk is highest. Our capital comes with real partnership — strategic
              guidance, a curated network, and the hard truths that help companies succeed.
            </p>
          </div>

          <div className={styles.right}>
            {PRINCIPLES.map((p) => (
              <div key={p.title} className={styles.card}>
                <div className={styles.cardIcon}>{p.icon}</div>
                <div>
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                  <p className={styles.cardDesc}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
