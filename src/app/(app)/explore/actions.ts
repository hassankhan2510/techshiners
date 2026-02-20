'use server'

import { createClient } from '@/utils/supabase/server'

export async function searchProjects(term: string, university: string) {
    const supabase = await createClient()

    let query = supabase
        .from('projects')
        .select(`
            *,
            profiles (
                full_name,
                university,
                avatar_url,
                role
            )
        `)
        .order('created_at', { ascending: false })

    // Apply Search Term Filter
    if (term) {
        // Search in title, description, or skills
        // Note: For array column (skills), we use 'cs' (contains) or 'ov' (overlap) but for text search 'ilike' is best.
        // Complex OR logic on joined tables is tricky in simple Supabase query builder.
        // We'll focus on Title/Description first for simplicity.
        // Or logic: title.ilike.%term% OR description.ilike.%term%
        query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`)
    }

    // After fetching, we filter by University manually or if possible via inner join filter.
    // Supabase filtering on foreign tables: !inner join
    if (university) {
        // We filter projects where the *profile* matches the university.
        // Syntax: profiles!inner(university)
        query = supabase
            .from('projects')
            .select(`
                *,
                profiles!inner (
                    full_name,
                    university,
                    avatar_url,
                    role
                ),
                likes(count)
            `)
            .eq('profiles.university', university)
            .order('created_at', { ascending: false })

        // Re-apply term if needed (logic duplication to handle the separate select call)
        if (term) {
            query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`)
        }
    } else {
        // Standard Select (Needs to include likes count)
        query = supabase
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

        if (term) {
            query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`)
        }
    }

    const { data: projectsData, error } = await query

    if (error) {
        console.error("Search Error:", error)
        return []
    }

    let projects = projectsData || []

    // Enrich with 'is_liked'
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const { data: myLikes } = await supabase
            .from('likes')
            .select('project_id')
            .eq('user_id', user.id)
            .in('project_id', projects.map(p => p.id)) // optimization

        const likedProjectIds = new Set(myLikes?.map((l: any) => l.project_id))

        projects = projects.map(p => ({
            ...p,
            is_liked: likedProjectIds.has(p.id)
        }))
    }

    return projects
}

export async function searchPeople(term: string, university: string) {
    const supabase = await createClient()

    let query = supabase
        .from('profiles')
        .select('id, full_name, avatar_url, university, role')
        .order('full_name', { ascending: true })

    if (term) {
        query = query.ilike('full_name', `%${term}%`)
    }

    if (university) {
        query = query.eq('university', university)
    }

    const { data, error } = await query.limit(50)

    if (error) {
        console.error('Search people error:', error)
        return []
    }

    return data || []
}

export async function getUniversityStats() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('university')

    if (error) {
        console.error('University stats error:', error)
        return []
    }

    // Count unique universities
    const counts: Record<string, number> = {}
    for (const p of data || []) {
        if (p.university) {
            counts[p.university] = (counts[p.university] || 0) + 1
        }
    }

    return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
}
