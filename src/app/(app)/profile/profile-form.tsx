'use client'

import { useActionState } from 'react'
import { updateProfile, ProfileState } from './actions'
import { ISLAMABAD_UNIVERSITIES } from '@/lib/constants'
import styles from './profile.module.css'

const initialState: ProfileState = {}

export default function ProfileForm({ profile }: { profile: any }) {
    const [state, formAction, isPending] = useActionState(updateProfile, initialState)

    return (
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
        </form >
    )
}
