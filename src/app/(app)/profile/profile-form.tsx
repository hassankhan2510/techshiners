'use client'

import { useActionState, useState } from 'react'
import { updateProfile, uploadCV, ProfileState } from './actions'
import { ISLAMABAD_UNIVERSITIES } from '@/lib/constants'
import styles from './profile.module.css'

const initialState: ProfileState = {}

export default function ProfileForm({ profile }: { profile: any }) {
    const [state, formAction, isPending] = useActionState(updateProfile, initialState)
    const [cvUploading, setCvUploading] = useState(false)
    const [cvMessage, setCvMessage] = useState('')

    const handleCvUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setCvUploading(true)
        setCvMessage('')
        const formData = new FormData(e.currentTarget)
        const result = await uploadCV(formData)
        setCvMessage(result.success || result.error || '')
        setCvUploading(false)
    }

    return (
        <>
            <form action={formAction}>
                {state.error && <div style={{ color: '#ef4444', marginBottom: '0.75rem', fontSize: '0.85rem', padding: '0.5rem 0.75rem', background: 'rgba(239,68,68,0.1)', borderRadius: '8px' }}>{state.error}</div>}
                {state.success && <div style={{ color: '#22c55e', marginBottom: '0.75rem', fontSize: '0.85rem', padding: '0.5rem 0.75rem', background: 'rgba(34,197,94,0.1)', borderRadius: '8px' }}>{state.success}</div>}

                <div className={styles.formGrid}>
                    <div className={styles.group}>
                        <label className={styles.label}>Full Name</label>
                        <input
                            name="full_name"
                            defaultValue={profile.full_name || ''}
                            className={styles.input}
                            placeholder="Your full name"
                            required
                        />
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>Gender (Avatar Style)</label>
                        <select
                            name="gender"
                            className={styles.input}
                            defaultValue=""
                            required
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div className={[styles.group, styles.fullWidth].join(' ')}>
                        <label className={styles.label}>University</label>
                        <select
                            name="university"
                            defaultValue={profile.university || ''}
                            className={styles.input}
                            required
                        >
                            <option value="" disabled>Select University</option>
                            {ISLAMABAD_UNIVERSITIES.map((uni) => (
                                <option key={uni} value={uni}>
                                    {uni}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={[styles.group, styles.fullWidth].join(' ')}>
                        <label className={styles.label}>Email (Read Only)</label>
                        <input
                            disabled
                            value={profile.email || ''}
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="submit" className={styles.button} disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>

            {/* CV Section */}
            <div style={{
                marginTop: '1.5rem', paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-color)'
            }}>
                <h3 style={{ marginBottom: '0.75rem', fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>📄 Resume / CV</h3>

                {profile.cv_url && (
                    <div style={{
                        marginBottom: '0.75rem', padding: '0.65rem 0.85rem',
                        background: 'var(--accent-glow)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px', display: 'flex',
                        justifyContent: 'space-between', alignItems: 'center',
                        flexWrap: 'wrap', gap: '0.5rem'
                    }}>
                        <span style={{ color: '#22c55e', fontSize: '0.85rem' }}>✅ CV Uploaded</span>
                        <a href={profile.cv_url} target="_blank" rel="noopener noreferrer"
                            style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
                            View CV ↗
                        </a>
                    </div>
                )}

                <form onSubmit={handleCvUpload} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                        type="file"
                        name="cv"
                        accept=".pdf,.doc,.docx"
                        style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1, minWidth: '150px' }}
                        required
                    />
                    <button
                        type="submit"
                        className={styles.button}
                        disabled={cvUploading}
                        style={{ marginTop: 0, padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                    >
                        {cvUploading ? 'Uploading...' : 'Upload CV'}
                    </button>
                </form>

                {cvMessage && (
                    <p style={{
                        marginTop: '0.4rem', fontSize: '0.8rem',
                        color: cvMessage.includes('success') ? '#22c55e' : '#ef4444'
                    }}>
                        {cvMessage}
                    </p>
                )}
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.4rem' }}>
                    Max 5MB · PDF, DOC, DOCX
                </p>
            </div>
        </>
    )
}
