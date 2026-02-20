'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addComment(projectId: string, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }
    if (!content.trim()) return { error: 'Comment cannot be empty' }

    const { error } = await supabase.from('comments').insert({
        project_id: projectId,
        user_id: user.id,
        content: content.trim(),
    })

    if (error) {
        console.error('Comment error:', error)
        return { error: error.message }
    }

    revalidatePath('/feed')
    return { success: true }
}

export async function deleteComment(commentId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

    if (error) {
        console.error('Delete comment error:', error)
        return { error: error.message }
    }

    revalidatePath('/feed')
    return { success: true }
}

export async function getComments(projectId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('comments')
        .select(`
            *,
            profiles (
                full_name,
                avatar_url
            )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Fetch comments error:', error)
        return []
    }

    return data || []
}
