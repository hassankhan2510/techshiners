import Link from 'next/link'
import styles from '../auth.module.css'
import { login } from '../actions'

export default function LoginPage() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Tech Shiners</h1>

                <form className={styles.form}>
                    <div className={styles.group}>
                        <label className={styles.label} htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className={styles.input}
                            placeholder="Phone number, username, or email"
                        />
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label} htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className={styles.input}
                            placeholder="Password"
                        />
                    </div>

                    <button formAction={login} className={styles.button}>
                        Log in
                    </button>
                </form>
            </div>

            <div className={styles.bottomCard}>
                Don't have an account?{' '}
                <Link href="/auth/signup" className={styles.link}>
                    Sign up
                </Link>
            </div>
        </div>
    )
}
