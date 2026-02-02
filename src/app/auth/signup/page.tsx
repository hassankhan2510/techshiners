import Link from 'next/link'
import styles from '../auth.module.css'
import { signup } from '../actions'

export default function SignupPage() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Tech Shiners</h1>
                <p style={{ color: '#888', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                    Sign up to see projects and ideas from your friends.
                </p>

                <form className={styles.form}>
                    <div className={styles.group}>
                        <label className={styles.label} htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className={styles.input}
                            placeholder="Mobile Number or Email"
                        />
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label} htmlFor="full_name">Full Name</label>
                        <input
                            id="full_name"
                            name="full_name"
                            type="text"
                            required
                            className={styles.input}
                            placeholder="Full Name"
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

                    <div className={styles.group}>
                        <select id="role" name="role" className={styles.input}>
                            <option value="student">Student</option>
                            <option value="company">Company</option>
                        </select>
                    </div>

                    <p style={{ fontSize: '0.75rem', color: '#888', textAlign: 'center', margin: '10px 0' }}>
                        People who use our service may have uploaded your contact information to Tech Shiners.
                    </p>

                    <button formAction={signup} className={styles.button}>
                        Sign Up
                    </button>
                </form>
            </div>

            <div className={styles.bottomCard}>
                Have an account?{' '}
                <Link href="/auth/login" className={styles.link}>
                    Log in
                </Link>
            </div>
        </div>
    )
}
