'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import styles from '../auth.module.css'
import { signup } from '../actions'

function SignupForm() {
    const searchParams = useSearchParams()
    const errorFromUrl = searchParams.get('error')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(errorFromUrl || '')

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setError('')
        try {
            await signup(formData)
        } catch {
            setError('Something went wrong. Please try again.')
            setLoading(false)
        }
    }

    return (
        <>
            {error && (
                <div className={styles.errorMsg}>
                    {error}
                </div>
            )}

            <form action={handleSubmit} className={styles.form}>
                <div className={styles.group}>
                    <label className={styles.label} htmlFor="email">Email</label>
                    <div className={styles.inputWrap}>
                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="3" /><path d="M2 7l10 7 10-7" /></svg>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className={styles.input}
                            placeholder="you@university.edu"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className={styles.group}>
                    <label className={styles.label} htmlFor="full_name">Full Name</label>
                    <div className={styles.inputWrap}>
                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        <input
                            id="full_name"
                            name="full_name"
                            type="text"
                            required
                            className={styles.input}
                            placeholder="Your full name"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className={styles.group}>
                    <label className={styles.label} htmlFor="password">Password</label>
                    <div className={styles.inputWrap}>
                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className={styles.input}
                            placeholder="Min 6 characters"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className={styles.group}>
                    <label className={styles.label} htmlFor="role">I am a...</label>
                    <div className={styles.roleToggle}>
                        <label className={styles.roleOption}>
                            <input type="radio" name="role" value="student" defaultChecked className={styles.roleRadio} />
                            <span className={styles.roleLabel}>Student</span>
                        </label>
                        <label className={styles.roleOption}>
                            <input type="radio" name="role" value="company" className={styles.roleRadio} />
                            <span className={styles.roleLabel}>Company</span>
                        </label>
                    </div>
                </div>

                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? (
                        <span className={styles.spinner}></span>
                    ) : 'Create Account'}
                </button>

                <p className={styles.terms}>
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                </p>
            </form>
        </>
    )
}

export default function SignupPage() {
    return (
        <div className={styles.container}>
            <div className={styles.blob1}></div>
            <div className={styles.blob2}></div>

            <div className={styles.card}>
                <div className={styles.logoWrap}>
                    <div className={styles.logoIcon}>TS</div>
                    <h1 className={styles.title}>Join TechShin<span className={styles.titleAccent}>ers</span></h1>
                </div>
                <p className={styles.subtitle}>Create your account and showcase your tech projects.</p>

                <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
                    <SignupForm />
                </Suspense>
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
