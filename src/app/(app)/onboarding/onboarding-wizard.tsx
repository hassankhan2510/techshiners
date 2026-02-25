'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ISLAMABAD_UNIVERSITIES, SKILL_OPTIONS } from '@/lib/constants'
import { completeOnboarding } from './actions'
import styles from './onboarding.module.css'

export default function OnboardingWizard({ profile }: { profile: any }) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    // Form state
    const [fullName, setFullName] = useState(profile?.full_name || '')
    const [university, setUniversity] = useState(profile?.university || '')
    const [gender, setGender] = useState('')
    const [bio, setBio] = useState('')
    const [selectedSkills, setSelectedSkills] = useState<string[]>([])
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

    const handleComplete = async () => {
        setLoading(true)
        setError('')

        const formData = new FormData()
        formData.set('full_name', fullName)
        formData.set('university', university)
        formData.set('gender', gender)
        formData.set('bio', bio)
        formData.set('skills', selectedSkills.join(','))

        const result = await completeOnboarding(formData)

        if (result.error) {
            setError(result.error)
            setLoading(false)
        } else {
            setStep(3)
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.blob1}></div>
            <div className={styles.blob2}></div>

            {/* Progress */}
            <div className={styles.progress}>
                {[1, 2, 3].map(i => (
                    <div key={i} className={`${styles.dot} ${step >= i ? styles.dotActive : ''}`} />
                ))}
            </div>

            {/* Step 1: Profile Basics */}
            {step === 1 && (
                <div className={styles.card}>
                    <div className={styles.stepIcon}>01</div>
                    <h1 className={styles.title}>Let&apos;s set up your profile</h1>
                    <p className={styles.subtitle}>Tell us about yourself so others can find you.</p>

                    <div className={styles.form}>
                        <div className={styles.group}>
                            <label className={styles.label}>Full Name</label>
                            <input className={styles.input} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" />
                        </div>

                        <div className={styles.group}>
                            <label className={styles.label}>University</label>
                            <select className={styles.input} value={university} onChange={e => setUniversity(e.target.value)}>
                                <option value="">Select University</option>
                                {ISLAMABAD_UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>

                        <div className={styles.group}>
                            <label className={styles.label}>Gender (for avatar style)</label>
                            <div className={styles.genderRow}>
                                {['male', 'female'].map(g => (
                                    <button key={g} type="button"
                                        className={`${styles.genderBtn} ${gender === g ? styles.genderActive : ''}`}
                                        onClick={() => setGender(g)}
                                    >
                                        {g === 'male' ? '👨' : '👩'} {g.charAt(0).toUpperCase() + g.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.group}>
                            <label className={styles.label}>Short Bio <span className={styles.optional}>(optional)</span></label>
                            <textarea className={styles.input} value={bio} onChange={e => setBio(e.target.value)}
                                placeholder="CS student passionate about AI..." rows={2} style={{ resize: 'none' }} />
                        </div>

                        <button className={styles.nextBtn}
                            disabled={!fullName || !university || !gender}
                            onClick={() => setStep(2)}
                        >
                            Next — Pick Your Skills
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Skills */}
            {step === 2 && (
                <div className={styles.card}>
                    <div className={styles.stepIcon}>02</div>
                    <h1 className={styles.title}>What are your skills?</h1>
                    <p className={styles.subtitle}>Pick up to 10. These help others find you for projects.</p>

                    {/* Selected */}
                    {selectedSkills.length > 0 && (
                        <div className={styles.selectedSkills}>
                            {selectedSkills.map(s => (
                                <button key={s} className={styles.skillChipSelected} onClick={() => toggleSkill(s)}>
                                    {s} ✕
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Search */}
                    <input className={styles.input} value={skillSearch} onChange={e => setSkillSearch(e.target.value)}
                        placeholder="Search skills..." style={{ marginBottom: '0.75rem' }} />

                    {/* Options Grid */}
                    <div className={styles.skillGrid}>
                        {filteredSkills.slice(0, 20).map(s => (
                            <button key={s} className={styles.skillChip} onClick={() => toggleSkill(s)}>
                                {s}
                            </button>
                        ))}
                    </div>

                    <p className={styles.counter}>{selectedSkills.length}/10 selected</p>

                    {error && <div className={styles.errorMsg}>{error}</div>}

                    <div className={styles.btnRow}>
                        <button className={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
                        <button className={styles.nextBtn} onClick={handleComplete} disabled={loading}>
                            {loading ? 'Saving...' : 'Complete Setup'}
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
                <div className={styles.card}>
                    <div className={styles.successIcon}>Done</div>
                    <h1 className={styles.title}>You&apos;re all set!</h1>
                    <p className={styles.subtitle}>Your profile is ready. Start exploring or share your first project.</p>

                    <div className={styles.btnRow}>
                        <button className={styles.backBtn} onClick={() => router.push('/feed')}>
                            Browse Feed
                        </button>
                        <button className={styles.nextBtn} onClick={() => router.push('/projects/new')}>
                            Create First Post
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
