'use client'

import { useActionState, startTransition, useState } from 'react'
import { createProject, ProjectState } from '../actions'
import styles from './compose.module.css'
import { compressImage } from '@/utils/image-compression'
import { SKILL_OPTIONS } from '@/lib/constants'

const initialState: ProjectState = {}

export default function NewProjectPage() {
    const [state, formAction, isPending] = useActionState(createProject, initialState)
    const [selectedTech, setSelectedTech] = useState<string[]>([])
    const [techSearch, setTechSearch] = useState('')

    const toggleTech = (tech: string) => {
        setSelectedTech(prev =>
            prev.includes(tech)
                ? prev.filter(s => s !== tech)
                : prev.length < 8 ? [...prev, tech] : prev
        )
    }

    const filteredTech = SKILL_OPTIONS.filter(s =>
        s.toLowerCase().includes(techSearch.toLowerCase()) && !selectedTech.includes(s)
    )

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)

        // Add tech stack
        formData.set('tech_stack', selectedTech.join(','))

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
                <div className={styles.typeSelector}>
                    {['project', 'startup', 'event'].map(t => (
                        <label key={t} className={styles.typeLabel}>
                            <input type="radio" name="type" value={t} defaultChecked={t === 'project'} className={styles.typeRadio} />
                            <span className={styles.typePill}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </span>
                        </label>
                    ))}
                </div>

                {/* Main Content */}
                <div style={{ flex: 1, padding: '1rem' }}>
                    <input name="title" required className={styles.titleInput} placeholder="Title" autoFocus />
                    <textarea name="description" required className={styles.descInput}
                        placeholder="What's on your mind? Tell us about your project, idea, or event..." />

                    {/* Image Upload */}
                    <div className={styles.uploadBox}>
                        <label className={styles.uploadLabel}>
                            Attachment — <span style={{ color: 'var(--accent-primary)' }}>Auto-Compressed</span>
                        </label>
                        <input type="file" name="image" accept="image/*" className={styles.fileInput} />
                    </div>
                </div>

                {/* Error */}
                {state.error && <div className={styles.errorMsg}>{state.error}</div>}

                {/* Meta */}
                <div className={styles.metaSection}>
                    <div className={styles.inputGroup}>
                        <span className={styles.inputIcon}>#</span>
                        <input name="skills" className={styles.metaInput} placeholder="Tags (e.g. React, EdTech, Workshop)" />
                    </div>

                    <div className={styles.inputGroup}>
                        <span className={styles.inputIcon}>/</span>
                        <input name="project_url" type="url" className={styles.metaInput} placeholder="External Link (Optional)" />
                    </div>

                    <div className={styles.inputGroup}>
                        <span className={styles.inputIcon}>&lt;&gt;</span>
                        <input name="github_url" type="url" className={styles.metaInput} placeholder="GitHub Repository URL (Optional)" />
                    </div>

                    <div className={styles.inputGroup}>
                        <span className={styles.inputIcon}>~</span>
                        <input name="demo_url" type="url" className={styles.metaInput} placeholder="Live Demo URL (Optional)" />
                    </div>

                    {/* Tech Stack Picker */}
                    <div>
                        <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>
                            Tech Stack <span style={{ opacity: 0.5 }}>(up to 8)</span>
                        </label>
                        {selectedTech.length > 0 && (
                            <div className={styles.techRow}>
                                {selectedTech.map(t => (
                                    <button key={t} type="button" className={styles.techActive} onClick={() => toggleTech(t)}>{t} ✕</button>
                                ))}
                            </div>
                        )}
                        <input type="text" value={techSearch} onChange={e => setTechSearch(e.target.value)}
                            className={styles.metaInput} placeholder="Search tech..." style={{ paddingLeft: '0.85rem' }} />
                        {techSearch && (
                            <div className={styles.techRow} style={{ marginTop: '0.35rem' }}>
                                {filteredTech.slice(0, 10).map(t => (
                                    <button key={t} type="button" className={styles.techPill} onClick={() => { toggleTech(t); setTechSearch('') }}>+ {t}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" className={styles.publishBtn} disabled={isPending}>
                        {isPending ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </form>
        </div>
    )
}
