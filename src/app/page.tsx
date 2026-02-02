import Link from 'next/link'
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Dynamic Background */}
      <div className={styles.background}>
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
      </div>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              ✨ Redefining University Recruitment
            </div>

            <h1 className={styles.title}>
              Don't Just Be Verified.<br />
              Be Undeniable.
            </h1>

            <p className={styles.subtitle}>
              Turn your academic projects into professional proof.
              Tech Shiners is the only platform where your skills are verified by your university,
              giving you the edge you deserve.
            </p>

            <div className={styles.actions}>
              <Link href="/auth/signup" className={styles.primaryBtn}>
                Get Your Verified Profile
              </Link>
              <Link href="#how-it-works" className={styles.secondaryBtn}>
                How It Works
              </Link>
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className={styles.section} id="features">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why We Are Different</h2>
            <p className={styles.sectionSubtitle}>We don't just host resumes. We prove potential.</p>
          </div>

          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>✅</div>
              <h3 className={styles.cardTitle}>University Verified</h3>
              <p className={styles.cardText}>
                No more self-proclaimed "experts". Your skills are validated by your professors and coursework.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>🚀</div>
              <h3 className={styles.cardTitle}>Project-First</h3>
              <p className={styles.cardText}>
                Employers want to see what you've built. Showcase your labs, assignments, and FYPs as live portfolios.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>💎</div>
              <h3 className={styles.cardTitle}>Premium Identity</h3>
              <p className={styles.cardText}>
                Stand out with a profile designed to impress. Glassmorphism, smooth animations, and top-tier aesthetics.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className={styles.section} id="how-it-works">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Your Path to Hired</h2>
          </div>

          <div className={styles.grid} style={{ maxWidth: '800px' }}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>Sign Up with University Email</h3>
                <p className={styles.cardText}>We link your account directly to your institution for instant credibility.</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>Upload Projects & Get Verified</h3>
                <p className={styles.cardText}>Submit your work. Your university admins or professors verify the authenticity.</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>Get Discovered by Top Employers</h3>
                <p className={styles.cardText}>Companies filter for "Verified Talent" and find you before you even graduate.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
