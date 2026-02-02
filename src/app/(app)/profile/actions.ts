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
