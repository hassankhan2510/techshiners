'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export type ProfileState = {
    success?: string
    error?: string
}

const ISLAMABAD_UNIVERSITIES = [
    "National University of Sciences and Technology (NUST)",
    "COMSATS University Islamabad",
    "FAST National University (NUCES)",
    "Air University",
    "Bahria University",
    "International Islamic University (IIUI)",
    "Quaid-i-Azam University (QAU)",
    "SZABIST Islamabad",
    "Iqra University Islamabad",
    "Hamdard University Islamabad",
    "Riphah International University",
    "Foundation University Islamabad",
    "National Defence University (NDU)",
    "PIEAS (Pakistan Institute of Engineering and Applied Sciences)",
    "IST (Institute of Space Technology)",
    "Other"
]

function getAvatarUrl(name: string, gender: string) {
    // Dicebear Avataaars Configuration
    const baseUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(name)}`

    if (gender === 'male') {
        // Short hair, facial hair possible, masculine clothes
        return `${baseUrl}&top=shortHair,curly,dreads,frizzle,shaggy,shortCurly,shortFlat,shortRound,sides,theCaesar,theCaesarAndSidePart&facialHair=beardLight,beardMajestic,beardMedium,moustacheFancy,moustacheMagnum,stubble,none&clothe=blazerAndShirt,collarAndSweater,graphicShirt,hoodie,overall,shirtCrewNeck,shirtScoopNeck,shirtVNeck`
    } else if (gender === 'female') {
        // Long hair, no facial hair
        return `${baseUrl}&top=longHair,bigHair,bob,bun,curvy,dreads01,dreads02,frida,frizzle,fro,hat,hijab,longHairBigHair,longHairBob,longHairBun,longHairCurly,longHairCurvy,longHairDreads,longHairFrida,longHairFro,longHairMiaWallace,longHairNotTooLong,longHairShavedSides,longHairStraight,longHairStraight2,longHairStraightStrand,miaWallace,parting,shavedSides,straight01,straight02,straightStrand&facialHair=none&clothe=blazerAndShirt,collarAndSweater,graphicShirt,hoodie,overall,shirtCrewNeck,shirtScoopNeck,shirtVNeck`
    }

    // Default / Neutral
    return baseUrl
}

export async function updateProfile(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const full_name = formData.get('full_name') as string
    const university = formData.get('university') as string
    const gender = formData.get('gender') as string

    // Generate Avatar based on Name + Gender
    const avatar_url = getAvatarUrl(full_name || user.email || 'user', gender)

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name,
            university,
            avatar_url // Update avatar URL
        })
        .eq('id', user.id)

    if (error) {
        console.error("Profile Update Error:", error)
        return { error: 'Could not update profile' }
    }

    revalidatePath('/profile')
    // Also revalidate feed as avatar changes affect posts there
    revalidatePath('/feed')

    return { success: 'Profile updated successfully' }
}

export async function getProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (profile) return profile

    // JIT Profile Creation: If profile missing but user exists, create it now
    const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
            role: user.user_metadata?.role || 'student',
            avatar_url: `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.email}` // Default Avatar (Neutral)
        })
        .select()
        .single()

    if (error) {
        console.error("JIT Profile Error:", error)
        return null
    }

    return newProfile
}

export async function uploadCV(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const file = formData.get('cv') as File
    if (!file || file.size === 0) return { error: 'No file selected' }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) return { error: 'File too large (max 5MB)' }

    const ext = file.name.split('.').pop()
    const filePath = `${user.id}/cv.${ext}`

    const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(filePath, file, { upsert: true })

    if (uploadError) {
        console.error('CV upload error:', uploadError)
        return { error: 'Upload failed: ' + uploadError.message }
    }

    const { data: { publicUrl } } = supabase.storage
        .from('cvs')
        .getPublicUrl(filePath)

    const { error: updateError } = await supabase
        .from('profiles')
        .update({ cv_url: publicUrl })
        .eq('id', user.id)

    if (updateError) {
        console.error('CV URL update error:', updateError)
        return { error: 'Could not save CV link' }
    }

    revalidatePath('/profile')
    return { success: 'CV uploaded successfully!' }
}

export async function deleteProject(projectId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Delete project error:', error)
        return { error: error.message }
    }

    revalidatePath('/feed')
    return { success: true }
}

export async function contributeToProject(projectId: string, message: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
        .from('contributions')
        .insert({
            project_id: projectId,
            user_id: user.id,
            message: message || 'I want to contribute!'
        })

    if (error) {
        if (error.code === '23505') return { error: 'You already sent a request' }
        console.error('Contribute error:', error)
        return { error: error.message }
    }

    revalidatePath('/feed')
    return { success: true }
}

export async function getContributions(projectId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('contributions')
        .select(`*, profiles(full_name, avatar_url)`)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

    if (error) return []
    return data || []
}
