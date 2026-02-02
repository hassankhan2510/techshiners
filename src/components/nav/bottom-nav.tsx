'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './nav.module.css'

export default function BottomNav() {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

    return (
        <nav className={styles.bottomNav}>
            <Link href="/feed" className={`${styles.navItem} ${isActive('/feed') ? styles.active : ''}`}>
                {/* Home Icon */}
                <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconSvg}>
                    {isActive('/feed') ? (
                        <path d="M22 12.1664V20C22 21.1046 21.1046 22 20 22H16V16H8V22H4C2.89543 22 2 21.1046 2 20V12.1664C2 11.6669 2.18671 11.1856 2.52358 10.819L10.5979 2.01633C11.3533 1.19286 12.6467 1.19286 13.4021 2.01634L21.4764 10.819C21.8133 11.1856 22 11.6669 22 12.1664Z" fill="currentColor" />
                    ) : (
                        <path d="M9.99996 2.01634L1.92559 10.819C1.58872 11.1856 1.40201 11.6669 1.40201 12.1664V20C1.40201 21.435 2.56515 22.5982 4.00015 22.5982H8.00015V16.5982H15.9999V22.5982H19.9999C21.435 22.5982 22.598 21.435 22.598 20V12.1664C22.598 11.6669 22.4113 11.1856 22.0744 10.819L13.9999 2.01633C12.9248 0.844359 11.0751 0.844358 9.99996 2.01634Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    )}
                </svg>
                <span className={styles.navLabel}>Home</span>
            </Link>

            <Link href="/explore" className={`${styles.navItem} ${isActive('/explore') ? styles.active : ''}`}>
                {/* Explore / Search Icon */}
                <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconSvg}>
                    <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth={isActive('/explore') ? '3' : '2'} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
                <span className={styles.navLabel}>Explore</span>
            </Link>

            <Link href="/projects/new" className={styles.navItem}>
                {/* Central Upload Button */}
                <div className={styles.uploadButton}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 4V20M4 12H20" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </Link>

            <Link href="/ranks" className={`${styles.navItem} ${isActive('/ranks') ? styles.active : ''}`}>
                {/* Ranks / Trophy Icon */}
                <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconSvg}>
                    {isActive('/ranks') ? (
                        <path d="M12 15C15.866 15 19 11.866 19 8V3H5V8C5 11.866 8.13401 15 12 15Z" fill="currentColor" />
                    ) : (
                        <path d="M8 21H16M12 17V21M17 8V3H7V8C7 10.7614 9.23858 13 12 13C14.7614 13 17 10.7614 17 8ZM17 8H19C20.1046 8 21 7.10457 21 6V5C21 3.89543 20.1046 3 19 3H17M7 8H5C3.89543 8 3 7.10457 3 6V5C3 3.89543 3.89543 3 5 3H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    )}
                </svg>
                <span className={styles.navLabel}>Ranks</span>
            </Link>

            <Link href="/profile" className={`${styles.navItem} ${isActive('/profile') ? styles.active : ''}`}>
                {/* Profile Icon */}
                <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconSvg}>
                    {isActive('/profile') ? (
                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12ZM12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor" />
                    ) : (
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    )}
                </svg>
                <span className={styles.navLabel}>Me</span>
            </Link>
        </nav>
    )
}
