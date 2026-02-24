import { redirect } from 'next/navigation'
import { getProfile } from './actions'
import styles from './profile.module.css'
import ProfileForm from './profile-form'

export default async function ProfilePage() {
    const profile = await getProfile()

    if (!profile) {
        redirect('/auth/login')
    }

    const avatarUrl = profile.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${profile.full_name || 'user'}`

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                        <h1 className={styles.title}>Your Profile</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            Manage your verified academic identity.
                        </p>
                    </div>
                    <a href={`/u/${profile.id}`} target="_blank" style={{
                        color: 'var(--accent-primary)', textDecoration: 'none', background: 'var(--accent-glow)',
                        padding: '0.4rem 0.85rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600,
                        border: '1px solid var(--border-color)', whiteSpace: 'nowrap'
                    }}>
                        View Public Profile ↗
                    </a>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cover}></div>

                <div className={styles.content}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatar}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: 'var(--bg-secondary)' }} />
                        </div>
                        <div className={styles.userInfo}>
                            <h2 className={styles.name}>{profile.full_name}</h2>
                            <span className={styles.role}>{profile.role}</span>
                        </div>
                    </div>

                    <ProfileForm profile={profile} />
                </div>
            </div>
        </div>
    )
}
