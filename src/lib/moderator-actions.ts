'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { MODERATOR_EMAIL } from '@/lib/constants'

async function isModerator() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user.id)
        .single()

    return profile?.email === MODERATOR_EMAIL
}

export async function moderatorDeleteProject(projectId: string) {
    if (!(await isModerator())) return { error: 'Not authorized' }

    const supabase = await createClient()

    // Delete related data first
    await supabase.from('likes').delete().eq('project_id', projectId)
    await supabase.from('comments').delete().eq('project_id', projectId)
    await supabase.from('contributions').delete().eq('project_id', projectId)

    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

    if (error) return { error: error.message }

    revalidatePath('/feed')
    revalidatePath('/ranks')
    return { success: true }
}

export async function moderatorDeleteComment(commentId: string) {
    if (!(await isModerator())) return { error: 'Not authorized' }

    const supabase = await createClient()
    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

    if (error) return { error: error.message }

    revalidatePath('/feed')
    return { success: true }
}

export async function checkIsModerator() {
    return isModerator()
}
