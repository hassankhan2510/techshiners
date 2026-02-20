'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark')

    useEffect(() => {
        const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
        if (saved) {
            setTheme(saved)
            document.documentElement.setAttribute('data-theme', saved)
        }
    }, [])

    const toggle = () => {
        const next = theme === 'dark' ? 'light' : 'dark'
        setTheme(next)
        document.documentElement.setAttribute('data-theme', next)
        localStorage.setItem('theme', next)
    }

    return (
        <button
            onClick={toggle}
            aria-label="Toggle theme"
            style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '1.2rem', padding: '6px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-primary)',
                transition: 'transform 0.3s ease'
            }}
        >
            {theme === 'dark' ? '☀️' : '🌙'}
        </button>
    )
}
