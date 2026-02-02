'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleLike(projectId: string) {
    const supabase = await createClient()

    // Check Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Check if already liked
    const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .single()

    if (existingLike) {
        // Unlike
        const { error } = await supabase
            .from('likes')
            .delete()
            .eq('user_id', user.id)
            .eq('project_id', projectId)

        if (error) return { error: 'Failed to unlike' }
    } else {
        // Like
        const { error } = await supabase
            .from('likes')
            .insert({
                user_id: user.id,
                project_id: projectId
            })

        if (error) return { error: 'Failed to like' }
    }

    // Revalidate paths where card is shown. Ideally validatethe specific path or tag
    revalidatePath('/feed')
    revalidatePath('/explore')
    // We can't easily revalidate dynamic [userId] paths without knowing the ID, 
    // but typically user stays on page. 
    // For now, simple revalidation.
    return { success: true }
}
