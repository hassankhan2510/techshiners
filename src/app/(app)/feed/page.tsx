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

    // 2. If user is logged in, fetch their likes to determine 'hasLiked'
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
    const projects = await getProjects(currentType)

    return (
        <div className={`${styles.feedContainer} ${shared.fadeIn}`}>
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {[
                    { id: 'all', label: 'All Posts' },
                    { id: 'project', label: 'Projects' },
                    { id: 'startup', label: 'Startups' },
                    { id: 'event', label: 'Events' }
                ].map(tab => (
                    <a
                        key={tab.id}
                        href={`/feed?type=${tab.id}`}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            background: currentType === tab.id ? '#fff' : 'rgba(255,255,255,0.05)',
                            color: currentType === tab.id ? '#000' : '#fff',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            whiteSpace: 'nowrap',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        {tab.label}
                    </a>
                ))}
            </div>

            {projects.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    <p>No posts found in this category. Be the first!</p>
                </div>
            )}


            {projects.map((project: any) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    )
}
