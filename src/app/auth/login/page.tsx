'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import styles from '../auth.module.css'
import { login } from '../actions'

function LoginForm() {
    const searchParams = useSearchParams()
    const errorFromUrl = searchParams.get('error')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(errorFromUrl || '')

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setError('')
        try {
            await login(formData)
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
                    <label className={styles.label} htmlFor="password">Password</label>
                    <div className={styles.inputWrap}>
                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className={styles.input}
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>
                </div>

                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? (
                        <span className={styles.spinner}></span>
                    ) : 'Log In'}
                </button>
            </form>
        </>
    )
}

export default function LoginPage() {
    return (
        <div className={styles.container}>
            <div className={styles.blob1}></div>
            <div className={styles.blob2}></div>

            <div className={styles.card}>
                <div className={styles.logoWrap}>
                    <div className={styles.logoIcon}>TS</div>
                    <h1 className={styles.title}>TechShin<span className={styles.titleAccent}>ers</span></h1>
                </div>
                <p className={styles.subtitle}>Welcome back! Log in to continue.</p>

                <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
                    <LoginForm />
                </Suspense>
            </div>

            <div className={styles.bottomCard}>
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className={styles.link}>
                    Sign up
                </Link>
            </div>
        </div>
    )
}
