'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export type ProjectState = {
    error?: string
    success?: string
}

export async function createProject(prevState: ProjectState, formData: FormData): Promise<ProjectState> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const skillsStr = formData.get('skills') as string
    const project_url = formData.get('project_url') as string
    const type = formData.get('type') as string || 'project'
    const imageFile = formData.get('image') as File

    // Parse comma-separated skills
    const skills = skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(s => s.length > 0) : []

    let image_url = null

    if (imageFile && imageFile.size > 0) {
        // Simple file validation (size/type could be checked here)
        const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('posts')
            .upload(filename, imageFile, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('Upload Error:', uploadError)
            return { error: 'Failed to upload image' }
        }

        const { data: { publicUrl } } = supabase.storage.from('posts').getPublicUrl(filename)
        image_url = publicUrl
    }

    const { error } = await supabase
        .from('projects')
        .insert({
            user_id: user.id,
            title,
            description,
            skills,
            project_url,
            type,
            image_url,
            status: 'published',
            verification_status: 'pending'
        })

    if (error) {
        console.error('Project creation error:', error)
        return { error: 'Could not create post' }
    }

    revalidatePath('/feed')
    redirect('/feed')
}
