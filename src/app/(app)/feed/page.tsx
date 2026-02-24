import { createClient } from '@/utils/supabase/server'
import styles from '@/components/feed/feed.module.css'
import shared from '@/components/ui/shared.module.css'
import ProjectCard from '@/components/feed/project-card'

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

    // If user is logged in, fetch their likes
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

export default async function FeedPage({ searchParams }: { searchParams: { type?: string } }) {
    const { type } = searchParams || {}
    const currentType = type || 'all'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const projects = await getProjects(currentType)

    const tabs = [
        { id: 'all', label: 'All Posts' },
        { id: 'project', label: 'Projects' },
        { id: 'startup', label: 'Startups' },
        { id: 'event', label: 'Events' }
    ]

    return (
        <div className={`${styles.feedContainer} ${shared.fadeIn}`}>
            {/* Filter Tabs */}
            <div className={styles.filterTabs}>
                {tabs.map(tab => (
                    <a
                        key={tab.id}
                        href={`/feed?type=${tab.id}`}
                        className={`${styles.filterTab} ${currentType === tab.id ? styles.filterTabActive : ''}`}
                    >
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
                <ProjectCard key={project.id} project={project} currentUserId={user?.id} />
            ))}
        </div>
    )
}
