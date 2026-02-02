import Link from 'next/link'
import styles from '../auth.module.css'

export default function CheckEmailPage() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Check Your Email</h1>
                <p className={styles.subtitle}>
                    We've sent you a confirmation link. Please check your email to verify your account.
                </p>

                <div className={styles.links}>
                    <Link href="/auth/login" className={styles.link}>
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
