import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.bg} />
      <div className={styles.grid} />

      <div className={`container ${styles.content}`}>
        <div className={styles.badge}>Early Stage Venture Capital</div>

        <h1 className={styles.headline}>
          Backing the <span className={styles.accent}>Builders</span>
          <br />
          of Tomorrow
        </h1>

        <p className={styles.sub}>
          BC Ventures is an early-stage venture fund investing in exceptional
          founders building transformative companies across technology,
          frontier tech, and the future of work.
        </p>

        <div className={styles.actions}>
          <a href="#contact" className={styles.primaryBtn}>
            Connect With Us
          </a>
          <a href="#thesis" className={styles.secondaryBtn}>
            Our Thesis
          </a>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>Fund I</span>
            <span className={styles.statLabel}>Currently Raising</span>
          </div>
          <div className={styles.dividerVert} />
          <div className={styles.stat}>
            <span className={styles.statNum}>Pre-Seed</span>
            <span className={styles.statLabel}>Primary Stage</span>
          </div>
          <div className={styles.dividerVert} />
          <div className={styles.stat}>
            <span className={styles.statNum}>$250K–$1M</span>
            <span className={styles.statLabel}>Check Size</span>
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <div className={styles.scrollDot} />
      </div>
    </section>
  );
}
