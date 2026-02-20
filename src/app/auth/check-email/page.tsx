import Link from 'next/link'
import styles from '../auth.module.css'

export default function CheckEmailPage() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Tech Shiners</h1>

                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
                    <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.75rem' }}>Check Your Email</h2>
                    <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        We've sent you a confirmation link.<br />
                        Please check your email to verify your account.
                    </p>
                </div>
            </div>

            <div className={styles.bottomCard}>
                Already verified?{' '}
                <Link href="/auth/login" className={styles.link}>
                    Log in
                </Link>
            </div>
        </div>
    )
}
