import styles from './nav.module.css'
import ThemeToggle from './theme-toggle'

export default function TopNav() {
    return (
        <nav className={styles.topNav}>
            <div className={styles.brandLogo}>
                TechShin<span style={{ color: 'var(--accent-primary)' }}>ers</span>
            </div>

            <div className={styles.topActions}>
                <ThemeToggle />
                <div className={styles.navIcon}>
                    {/* Bell - Notification */}
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                </div>
            </div>
        </nav>
    )
}
