import styles from './nav.module.css'
import ThemeToggle from './theme-toggle'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function TopNav() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <nav className={styles.topNav}>
            <Link href="/feed" className={styles.brandLogo} style={{ textDecoration: 'none' }}>
                TechShin<span style={{ color: 'var(--accent-primary)' }}>ers</span>
            </Link>

            <div className={styles.topActions}>
                <ThemeToggle />
                {user ? (
                    <div className={styles.navIcon}>
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Link href="/auth/login" className={styles.loginBtn}>
                            Log In
                        </Link>
                        <Link href="/auth/signup" className={styles.signupBtn}>
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}
