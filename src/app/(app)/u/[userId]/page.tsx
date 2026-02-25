import { createClient } from '@/utils/supabase/server'
import shared from '@/components/ui/shared.module.css'
import styles from '@/components/feed/feed.module.css'
import ProjectCard from '@/components/feed/project-card'
import { notFound } from 'next/navigation'
import { computeBadges, MODERATOR_EMAIL } from '@/lib/constants'

export default async function PublicProfilePage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params
    const supabase = await createClient()

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (!profile) return notFound()

    // Fetch projects
    const { data: projectsData } = await supabase
        .from('projects')
        .select(`*, profiles(full_name, university, avatar_url), likes(count)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    let projects = projectsData || []

    // Current user checks
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    let isMod = false

    if (currentUser) {
        const { data: myLikes } = await supabase
            .from('likes')
            .select('project_id')
            .eq('user_id', currentUser.id)
            .in('project_id', projects.map(p => p.id))

        const likedProjectIds = new Set(myLikes?.map((l: any) => l.project_id))
        projects = projects.map(p => ({ ...p, is_liked: likedProjectIds.has(p.id) }))

        const { data: modProfile } = await supabase.from('profiles').select('email').eq('id', currentUser.id).single()
        isMod = modProfile?.email === MODERATOR_EMAIL
    }

    // Compute stats for badges
    const projectCount = projects.length
    const maxLikes = projects.reduce((max, p) => Math.max(max, p.likes?.[0]?.count || 0), 0)
    const totalLikes = projects.reduce((sum, p) => sum + (p.likes?.[0]?.count || 0), 0)

    const { data: contribs } = await supabase
        .from('contributions')
        .select('id')
        .eq('user_id', userId)

    const contributionCount = contribs?.length || 0

    const badges = computeBadges(profile, { projectCount, maxLikes, contributionCount })

    const avatarUrl = profile.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${profile.full_name || 'user'}`

    return (
        <div className={shared.fadeIn} style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header Card */}
            <div className={shared.glassCard} style={{ textAlign: 'center', padding: '0', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                {/* Cover Gradient */}
                <div style={{
                    height: '120px',
                    background: 'var(--gradient-accent)',
                    opacity: 0.9,
                }}></div>

                <div style={{ padding: '0 1.5rem 1.5rem', marginTop: '-50px', position: 'relative', zIndex: 1 }}>
                    {/* Avatar */}
                    <div style={{
                        width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 0.75rem',
                        overflow: 'hidden', border: '4px solid var(--bg-card)', background: 'var(--bg-card)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    </div>

                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                        {profile.full_name || 'Anonymous Student'}
                        {profile.is_verified && (
                            <span style={{ color: 'var(--accent-primary)', marginLeft: '0.4rem', fontSize: '0.8em' }}>✓</span>
                        )}
                    </h1>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {profile.university || 'No University Listed'}
                    </p>

                    <span style={{
                        display: 'inline-block', marginTop: '0.3rem',
                        fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase',
                        letterSpacing: '0.08em', padding: '0.2rem 0.6rem',
                        background: 'var(--input-bg)', borderRadius: '4px', fontWeight: 600,
                    }}>
                        {profile.role}
                    </span>

                    {/* Bio */}
                    {profile.bio && (
                        <p style={{
                            marginTop: '0.75rem', color: 'var(--text-secondary)',
                            fontSize: '0.88rem', lineHeight: 1.5, maxWidth: '400px', margin: '0.75rem auto 0',
                        }}>
                            {profile.bio}
                        </p>
                    )}

                    {/* Stats Bar */}
                    <div style={{
                        display: 'flex', justifyContent: 'center', gap: '2rem',
                        marginTop: '1.25rem', padding: '0.85rem 0',
                        borderTop: '1px solid var(--border-color)',
                        borderBottom: '1px solid var(--border-color)',
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{projectCount}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Projects</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{totalLikes}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Likes</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{badges.length}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Badges</div>
                        </div>
                    </div>

                    {/* Badges */}
                    {badges.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
                            {badges.map(b => (
                                <div key={b.id} title={b.description} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                    padding: '0.3rem 0.7rem', borderRadius: '99px',
                                    background: 'var(--accent-glow)', border: '1px solid var(--border-color)',
                                    fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 600,
                                }}>
                                    {b.icon} {b.label}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Skills */}
                    {profile.skills && profile.skills.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
                            {profile.skills.map((s: string) => (
                                <span key={s} style={{
                                    padding: '0.25rem 0.65rem', borderRadius: '99px',
                                    background: 'var(--input-bg)', border: '1px solid var(--border-color)',
                                    fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500,
                                }}>
                                    {s}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Social Links */}
                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
                        {profile.github_url && (
                            <a href={profile.github_url} target="_blank" rel="noopener noreferrer" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                padding: '0.4rem 0.9rem', background: 'var(--input-bg)',
                                border: '1px solid var(--border-color)', borderRadius: '99px',
                                color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500,
                                transition: 'all 0.2s',
                            }}>
                                GitHub
                            </a>
                        )}
                        {profile.linkedin_url && (
                            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                padding: '0.4rem 0.9rem', background: 'var(--input-bg)',
                                border: '1px solid var(--border-color)', borderRadius: '99px',
                                color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500,
                            }}>
                                LinkedIn
                            </a>
                        )}
                        {profile.cv_url && (
                            <a href={profile.cv_url} target="_blank" rel="noopener noreferrer" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                padding: '0.4rem 0.9rem', background: 'var(--gradient-accent)',
                                borderRadius: '99px', color: '#fff', textDecoration: 'none',
                                fontSize: '0.82rem', fontWeight: 600,
                            }}>
                                Download CV
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Projects */}
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Projects
            </h2>

            <div className={styles.feedContainer}>
                {projects && projects.length > 0 ? (
                    projects.map((project: any) => (
                        <ProjectCard key={project.id} project={project} currentUserId={currentUser?.id} isModerator={isMod} />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                        No projects uploaded yet.
                    </div>
                )}
            </div>
        </div>
    )
}
