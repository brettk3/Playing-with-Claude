import styles from './Team.module.css';

const TEAM = [
  {
    initials: 'BK',
    name: 'Brett Kessler',
    title: 'Co-Founder & General Partner',
    bio: 'Brett is an MBA candidate at Babson College (Corporate Finance) and a Senior Associate at Grant Thornton LLP, where he specializes in operational due diligence, private market valuation, and AI-augmented financial analysis. Armed with a BS in Information Science from the University of Maryland and certifications in Wall Street Prep Financial Modeling and Bloomberg Market Concepts, Brett brings institutional rigor to early-stage investing. His deep focus on risk assessment, data-driven assurance, and sector research across AI, SaaS, and blockchain gives him a differentiated lens for evaluating technology companies at the frontier.',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/brett-kessler' },
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
            A finance and technology duo combining institutional due diligence
            discipline with a passion for backing the next generation of category-defining companies.
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
