import { useState } from 'react';
import styles from './Contact.module.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', org: '', type: 'lp', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className={styles.contact} id="contact">
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.left}>
            <p className="section-label">Get In Touch</p>
            <h2 className="section-title">Let&apos;s Build Together</h2>
            <div className="gold-divider" />
            <p className="section-subtitle">
              Whether you&apos;re a founder seeking capital or a limited partner
              interested in Fund I, we want to hear from you.
            </p>

            <div className={styles.infoItems}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>✉</div>
                <div>
                  <div className={styles.infoLabel}>Email</div>
                  <div className={styles.infoValue}>hello@bcventures.vc</div>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>◎</div>
                <div>
                  <div className={styles.infoLabel}>Location</div>
                  <div className={styles.infoValue}>United States</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.right}>
            {submitted ? (
              <div className={styles.successMsg}>
                <div className={styles.successIcon}>✓</div>
                <h3>Message Received</h3>
                <p>Thank you for reaching out. We&apos;ll be in touch soon.</p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Full Name</label>
                    <input
                      className={styles.input}
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Email</label>
                    <input
                      className={styles.input}
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      required
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Organization</label>
                    <input
                      className={styles.input}
                      type="text"
                      name="org"
                      value={form.org}
                      onChange={handleChange}
                      placeholder="Company or Fund"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>I am a...</label>
                    <select
                      className={styles.input}
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                    >
                      <option value="lp">Limited Partner (LP)</option>
                      <option value="founder">Founder</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Message</label>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about yourself or your company..."
                    rows={5}
                    required
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
