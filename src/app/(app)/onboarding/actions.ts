'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function completeOnboarding(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const full_name = formData.get('full_name') as string
    const university = formData.get('university') as string
    const gender = formData.get('gender') as string
    const bio = formData.get('bio') as string
    const skillsStr = formData.get('skills') as string
    const skills = skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(Boolean) : []

    // Generate avatar
    const baseUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(full_name)}`
    let avatar_url = baseUrl
    if (gender === 'male') {
        avatar_url = `${baseUrl}&top=shortHair,curly,dreads,frizzle,shaggy,shortCurly,shortFlat,shortRound,sides,theCaesar&facialHair=beardLight,beardMedium,stubble,none`
    } else if (gender === 'female') {
        avatar_url = `${baseUrl}&top=longHair,bigHair,bob,bun,curvy,fro,hat,hijab&facialHair=none`
    }

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name,
            university,
            bio,
            skills,
            avatar_url,
            onboarding_complete: true
        })
        .eq('id', user.id)

    if (error) {
        console.error('Onboarding error:', error)
        return { error: 'Failed to save profile' }
    }

    revalidatePath('/profile')
    revalidatePath('/feed')
    return { success: true }
}
