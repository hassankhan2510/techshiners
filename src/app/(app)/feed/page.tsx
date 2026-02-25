import { createClient } from '@/utils/supabase/server'
import styles from '@/components/feed/feed.module.css'
import shared from '@/components/ui/shared.module.css'
import ProjectCard from '@/components/feed/project-card'
import { MODERATOR_EMAIL } from '@/lib/constants'

async function getProjects(type?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let query = supabase
        .from('projects')
        .select(`
            *,
            profiles (
                full_name,
                university,
                avatar_url,
                role
            ),
            likes(count)
        `)
        .order('created_at', { ascending: false })

    if (type && type !== 'all') {
        query = query.eq('type', type)
    }

    const { data: projectsData, error } = await query

    if (error) {
        console.error('Error fetching feed:', error)
        return []
    }

    let projects = projectsData || []

    if (user) {
        const { data: myLikes } = await supabase
            .from('likes')
            .select('project_id')
            .eq('user_id', user.id)

        const likedProjectIds = new Set(myLikes?.map((l: any) => l.project_id))

        projects = projects.map(p => ({
            ...p,
            is_liked: likedProjectIds.has(p.id)
        }))
    }

    return projects
}

export default async function FeedPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
    const params = await searchParams
    const currentType = params?.type || 'all'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Check moderator status
    let isMod = false
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('email').eq('id', user.id).single()
        isMod = profile?.email === MODERATOR_EMAIL
    }

    const projects = await getProjects(currentType)

    const tabs = [
        { id: 'all', label: 'All Posts' },
        { id: 'project', label: 'Projects' },
        { id: 'startup', label: 'Startups' },
        { id: 'event', label: 'Events' }
    ]

    return (
        <div className={`${styles.feedContainer} ${shared.fadeIn}`}>
            <div className={styles.filterTabs}>
                {tabs.map(tab => (
                    <a key={tab.id} href={`/feed?type=${tab.id}`}
                        className={`${styles.filterTab} ${currentType === tab.id ? styles.filterTabActive : ''}`}>
                        {tab.label}
                    </a>
                ))}
            </div>

            {projects.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No posts found</p>
                    <p style={{ fontSize: '0.85rem' }}>Be the first to share something!</p>
                </div>
            )}

            {projects.map((project: any) => (
                <ProjectCard key={project.id} project={project} currentUserId={user?.id} isModerator={isMod} />
            ))}
        </div>
    )
}
