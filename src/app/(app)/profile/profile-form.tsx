'use client'

import { useActionState, useState } from 'react'
import { updateProfile, uploadCV, ProfileState } from './actions'
import { ISLAMABAD_UNIVERSITIES, SKILL_OPTIONS } from '@/lib/constants'
import styles from './profile.module.css'

const initialState: ProfileState = {}

export default function ProfileForm({ profile }: { profile: any }) {
    const [state, formAction, isPending] = useActionState(updateProfile, initialState)
    const [cvUploading, setCvUploading] = useState(false)
    const [cvMessage, setCvMessage] = useState('')
    const [selectedSkills, setSelectedSkills] = useState<string[]>(profile.skills || [])
    const [skillSearch, setSkillSearch] = useState('')

    const toggleSkill = (skill: string) => {
        setSelectedSkills(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : prev.length < 10 ? [...prev, skill] : prev
        )
    }

    const filteredSkills = SKILL_OPTIONS.filter(s =>
        s.toLowerCase().includes(skillSearch.toLowerCase()) && !selectedSkills.includes(s)
    )

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
            <form action={(formData) => {
                formData.set('skills', selectedSkills.join(','))
                formAction(formData)
            }}>
                {state.error && <div className={styles.alertError}>{state.error}</div>}
                {state.success && <div className={styles.alertSuccess}>{state.success}</div>}

                <div className={styles.formGrid}>
                    <div className={styles.group}>
                        <label className={styles.label}>Full Name</label>
                        <input name="full_name" defaultValue={profile.full_name || ''} className={styles.input} placeholder="Your full name" required />
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>Gender (Avatar Style)</label>
                        <select name="gender" className={styles.input} defaultValue="" required>
                            <option value="" disabled>Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div className={[styles.group, styles.fullWidth].join(' ')}>
                        <label className={styles.label}>University</label>
                        <select name="university" defaultValue={profile.university || ''} className={styles.input} required>
                            <option value="" disabled>Select University</option>
                            {ISLAMABAD_UNIVERSITIES.map((uni) => (
                                <option key={uni} value={uni}>{uni}</option>
                            ))}
                        </select>
                    </div>

                    <div className={[styles.group, styles.fullWidth].join(' ')}>
                        <label className={styles.label}>Bio</label>
                        <textarea name="bio" defaultValue={profile.bio || ''} className={styles.input}
                            placeholder="A short bio about yourself..." rows={3} style={{ resize: 'none' }} />
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>GitHub URL</label>
                        <input name="github_url" type="url" defaultValue={profile.github_url || ''} className={styles.input} placeholder="https://github.com/username" />
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>LinkedIn URL</label>
                        <input name="linkedin_url" type="url" defaultValue={profile.linkedin_url || ''} className={styles.input} placeholder="https://linkedin.com/in/username" />
                    </div>

                    <div className={[styles.group, styles.fullWidth].join(' ')}>
                        <label className={styles.label}>Email (Read Only)</label>
                        <input disabled value={profile.email || ''} className={styles.input} />
                    </div>

                    {/* Skills Section */}
                    <div className={[styles.group, styles.fullWidth].join(' ')}>
                        <label className={styles.label}>Skills <span style={{ opacity: 0.5, fontWeight: 400 }}>(up to 10)</span></label>

                        {selectedSkills.length > 0 && (
                            <div className={styles.skillRow}>
                                {selectedSkills.map(s => (
                                    <button key={s} type="button" className={styles.skillActive} onClick={() => toggleSkill(s)}>
                                        {s} ✕
                                    </button>
                                ))}
                            </div>
                        )}

                        <input type="text" value={skillSearch} onChange={e => setSkillSearch(e.target.value)}
                            className={styles.input} placeholder="Search skills to add..." />

                        {skillSearch && (
                            <div className={styles.skillRow} style={{ marginTop: '0.35rem' }}>
                                {filteredSkills.slice(0, 12).map(s => (
                                    <button key={s} type="button" className={styles.skillPill} onClick={() => { toggleSkill(s); setSkillSearch('') }}>
                                        + {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="submit" className={styles.button} disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>

            {/* CV Section */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Resume / CV</h3>

                {profile.cv_url && (
                    <div className={styles.cvStatus}>
                        <span style={{ color: '#22c55e', fontSize: '0.85rem' }}>✅ CV Uploaded</span>
                        <a href={profile.cv_url} target="_blank" rel="noopener noreferrer" className={styles.cvLink}>View CV ↗</a>
                    </div>
                )}

                <form onSubmit={handleCvUpload} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input type="file" name="cv" accept=".pdf,.doc,.docx"
                        style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1, minWidth: '150px' }} required />
                    <button type="submit" className={styles.button} disabled={cvUploading}
                        style={{ marginTop: 0, padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                        {cvUploading ? 'Uploading...' : 'Upload CV'}
                    </button>
                </form>

                {cvMessage && (
                    <p style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: cvMessage.includes('success') ? '#22c55e' : '#ef4444' }}>
                        {cvMessage}
                    </p>
                )}
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.4rem' }}>Max 5MB · PDF, DOC, DOCX</p>
            </div>
        </>
    )
}
