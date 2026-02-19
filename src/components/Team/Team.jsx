import styles from './Team.module.css';

const TEAM = [
  {
    initials: 'BK',
    name: 'Brett K.',
    title: 'Co-Founder & General Partner',
    bio: 'Brett is an operator-turned-investor with a background in building and scaling technology companies. Before founding BC Ventures, he led growth at multiple venture-backed startups, gaining firsthand insight into what founders need at the earliest stages. He brings strategic vision, a deep operator network, and relentless founder advocacy to every investment.',
    links: [
      { label: 'LinkedIn', href: '#' },
      { label: 'Twitter', href: '#' },
    ],
  },
  {
    initials: 'C',
    name: 'Chase',
    title: 'Co-Founder & General Partner',
    bio: 'Chase is a seasoned entrepreneur and investor with extensive experience across technology, finance, and consumer markets. His track record of building companies from inception to scale gives him a unique perspective on what makes a breakthrough business. Chase is known for his pattern recognition, market instincts, and deep commitment to the founders he backs.',
    links: [
      { label: 'LinkedIn', href: '#' },
      { label: 'Twitter', href: '#' },
    ],
  },
];

export default function Team() {
  return (
    <section className={styles.team} id="team">
      <div className="container">
        <div className={styles.header}>
          <p className="section-label">The Team</p>
          <h2 className="section-title">Partners</h2>
          <div className="gold-divider" />
          <p className="section-subtitle">
            Two operators who have lived the founder journey and now dedicate
            themselves to supporting the next generation of builders.
          </p>
        </div>

        <div className={styles.grid}>
          {TEAM.map((member) => (
            <div key={member.name} className={styles.card}>
              <div className={styles.avatar}>
                <span className={styles.initials}>{member.initials}</span>
              </div>
              <div className={styles.info}>
                <h3 className={styles.name}>{member.name}</h3>
                <p className={styles.title}>{member.title}</p>
                <p className={styles.bio}>{member.bio}</p>
                <div className={styles.links}>
                  {member.links.map((l) => (
                    <a key={l.label} href={l.href} className={styles.link}>
                      {l.label} →
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
