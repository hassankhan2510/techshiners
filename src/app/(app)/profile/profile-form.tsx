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
                {state.error && <div style={{ color: 'red', marginBottom: '1rem' }}>{state.error}</div>}
                {state.success && <div style={{ color: 'green', marginBottom: '1rem' }}>{state.success}</div>}

                <div className={styles.formGrid}>
                    <div className={styles.group}>
                        <label className={styles.label}>Full Name</label>
                        <input
                            name="full_name"
                            defaultValue={profile.full_name || ''}
                            className={styles.input}
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
                marginTop: '2rem', paddingTop: '2rem',
                borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
                <h3 style={{ marginBottom: '1rem', fontWeight: 600, fontSize: '1.1rem' }}>📄 Resume / CV</h3>

                {profile.cv_url && (
                    <div style={{
                        marginBottom: '1rem', padding: '0.75rem 1rem',
                        background: 'rgba(0, 149, 246, 0.1)',
                        border: '1px solid rgba(0, 149, 246, 0.2)',
                        borderRadius: '8px', display: 'flex',
                        justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <span style={{ color: '#0095f6', fontSize: '0.9rem' }}>✅ CV Uploaded</span>
                        <a href={profile.cv_url} target="_blank" rel="noopener noreferrer"
                            style={{ color: '#0095f6', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                            View CV ↗
                        </a>
                    </div>
                )}

                <form onSubmit={handleCvUpload} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                        type="file"
                        name="cv"
                        accept=".pdf,.doc,.docx"
                        style={{ color: '#ccc', fontSize: '0.9rem' }}
                        required
                    />
                    <button
                        type="submit"
                        className={styles.button}
                        disabled={cvUploading}
                        style={{ marginTop: 0, padding: '0.5rem 1.25rem' }}
                    >
                        {cvUploading ? 'Uploading...' : 'Upload CV'}
                    </button>
                </form>

                {cvMessage && (
                    <p style={{
                        marginTop: '0.5rem', fontSize: '0.85rem',
                        color: cvMessage.includes('success') ? 'green' : 'red'
                    }}>
                        {cvMessage}
                    </p>
                )}
                <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Max 5MB · PDF, DOC, DOCX
                </p>
            </div>
        </>
    )
}
