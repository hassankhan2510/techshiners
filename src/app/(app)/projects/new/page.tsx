'use client'

import { useActionState, startTransition } from 'react'
import { createProject, ProjectState } from '../actions'
import styles from './compose.module.css'
import { compressImage } from '@/utils/image-compression'

const initialState: ProjectState = {}

export default function NewProjectPage() {
    const [state, formAction, isPending] = useActionState(createProject, initialState)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)

        startTransition(async () => {
            const file = formData.get('image') as File
            if (file && file.size > 0) {
                try {
                    const compressed = await compressImage(file)
                    formData.set('image', compressed)
                } catch (err) {
                    console.error("Compression failed, using original", err)
                }
            }

            formAction(formData)
        })
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                {/* Type Selector */}
                <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem' }}>
                    {['project', 'startup', 'event'].map(t => (
                        <label key={t} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: 0.8 }}>
                            <input type="radio" name="type" value={t} defaultChecked={t === 'project'} style={{ marginRight: '0.5rem' }} />
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </label>
                    ))}
                </div>

                {/* Main Content Area */}
                <div style={{ flex: 1, padding: '1rem' }}>
                    <input
                        name="title"
                        required
                        className={styles.titleInput}
                        placeholder="Title"
                        autoFocus
                    />

                    <textarea
                        name="description"
                        required
                        className={styles.descInput}
                        placeholder="What's on your mind? Tell us about your project, idea, or event..."
                    />

                    {/* Image Upload */}
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#888' }}>
                            📷 Attachment (Image / Logo) — <span style={{ color: '#0095f6' }}>Auto-Compressed</span>
                        </label>
                        <input type="file" name="image" accept="image/*" style={{ color: '#ccc' }} />
                    </div>
                </div>

                {/* Error Message */}
                {state.error && <div style={{ color: '#ff4444', marginBottom: '1rem', padding: '0 1rem' }}>{state.error}</div>}

                {/* Metadata / Footer */}
                <div className={styles.metaSection}>
                    <div className={styles.inputGroup}>
                        <span className={styles.inputIcon}>⚡</span>
                        <input name="skills" className={styles.metaInput} placeholder="Tags (e.g. React, EdTech, Workshop)" />
                    </div>

                    <div className={styles.inputGroup}>
                        <span className={styles.inputIcon}>🔗</span>
                        <input name="project_url" type="url" className={styles.metaInput} placeholder="External Link (Optional)" />
                    </div>

                    <button type="submit" className={styles.publishBtn} disabled={isPending}>
                        {isPending ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </form>
        </div>
    )
}
