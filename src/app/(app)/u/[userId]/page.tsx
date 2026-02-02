import { createClient } from '@/utils/supabase/server'
import styles from '@/components/feed/feed.module.css'
import shared from '@/components/ui/shared.module.css'
import ProjectCard from '@/components/feed/project-card'
import { notFound } from 'next/navigation'

// We use 'params' which is a Promise in recent Next.js versions for async pages
export default async function PublicProfilePage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params
    const supabase = await createClient()

    // Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (!profile) {
        return notFound()
    }

    // Fetch User's Projects
    const { data: projectsData } = await supabase
        .from('projects')
        .select(`
            *,
            profiles (
                full_name,
                university,
                avatar_url
            ),
            likes(count)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    let projects = projectsData || []

    // Enrich with 'is_liked'
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (currentUser) {
        const { data: myLikes } = await supabase
            .from('likes')
            .select('project_id')
            .eq('user_id', currentUser.id)
            .in('project_id', projects.map(p => p.id))

        const likedProjectIds = new Set(myLikes?.map((l: any) => l.project_id))

        projects = projects.map(p => ({
            ...p,
            is_liked: likedProjectIds.has(p.id)
        }))
    }

    const avatarUrl = profile.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${profile.full_name || 'user'}`

    return (
        <div className={shared.fadeIn} style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header / Cover */}
            <div className={shared.glassCard} style={{ textAlign: 'center', padding: '3rem 1rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100px',
                    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', opacity: 0.2
                }}></div>

                <div style={{ position: 'relative', zIndex: 1, marginTop: '2rem' }}>
                    <div style={{
                        width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 1rem',
                        overflow: 'hidden', border: '3px solid rgba(255,255,255,0.2)', padding: '2px', background: '#000'
                    }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    </div>

                    <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                        {profile.full_name || 'Anonymous Student'}
                        {profile.is_verified && (
                            <span style={{ color: '#3b82f6', marginLeft: '0.5rem' }}>Verified</span>
                        )}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        {profile.university || 'No University Listed'}
                    </p>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        {profile.role?.toUpperCase()}
                    </p>
                </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Projects</h2>

            <div className={styles.feedContainer}>
                {projects && projects.length > 0 ? (
                    projects.map((project: any) => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', color: '#666', padding: '3rem' }}>
                        No projects uploaded yet.
                    </div>
                )}
            </div>
        </div>
    )
}
