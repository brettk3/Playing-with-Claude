import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoMark}>BC</span>
              <span className={styles.logoText}>Ventures</span>
            </div>
            <p className={styles.tagline}>
              Backing the builders of tomorrow.
            </p>
          </div>

          <nav className={styles.nav}>
            <div className={styles.navGroup}>
              <div className={styles.navTitle}>Navigate</div>
              <a href="#about" className={styles.navLink}>About</a>
              <a href="#thesis" className={styles.navLink}>Thesis</a>
              <a href="#focus" className={styles.navLink}>Focus</a>
              <a href="#team" className={styles.navLink}>Team</a>
              <a href="#contact" className={styles.navLink}>Contact</a>
            </div>
            <div className={styles.navGroup}>
              <div className={styles.navTitle}>Connect</div>
              <a href="#contact" className={styles.navLink}>LP Inquiries</a>
              <a href="#contact" className={styles.navLink}>Founder Pitches</a>
              <a href="mailto:hello@bcventures.vc" className={styles.navLink}>Email Us</a>
            </div>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {year} BC Ventures. All rights reserved.
          </p>
          <p className={styles.disclaimer}>
            This website is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any securities.
          </p>
        </div>
      </div>
    </footer>
  );
}
