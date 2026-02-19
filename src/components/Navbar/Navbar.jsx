import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Thesis', href: '#thesis' },
  { label: 'Focus', href: '#focus' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ currentView = 'home', onViewChange }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (onViewChange) onViewChange('home');
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <a href="#" className={styles.logo} onClick={handleLogoClick}>
          <span className={styles.logoMark}>BC</span>
          <span className={styles.logoText}>Ventures</span>
        </a>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {currentView === 'home' && NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={styles.link}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <button
              className={`${styles.dashboardBtn} ${currentView === 'lending' ? styles.dashboardBtnActive : ''}`}
              onClick={() => {
                onViewChange && onViewChange(currentView === 'lending' ? 'home' : 'lending');
                setMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {currentView === 'lending' ? '← Back to Site' : 'Lending Dashboard'}
            </button>
          </li>
          {currentView === 'home' && (
            <li>
              <a href="#contact" className={styles.cta} onClick={() => setMenuOpen(false)}>
                LP Inquiries
              </a>
            </li>
          )}
        </ul>

        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
