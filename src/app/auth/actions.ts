'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        const msg = error.message?.toLowerCase() || ''
        if (msg.includes('invalid login credentials') || msg.includes('invalid')) {
            redirect('/auth/login?error=Invalid email or password. Please try again.')
        }
        if (msg.includes('email not confirmed')) {
            redirect('/auth/login?error=Please confirm your email first. Check your inbox.')
        }
        redirect('/auth/login?error=Could not authenticate. Please try again.')
    }

    revalidatePath('/', 'layout')
    redirect('/feed')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const full_name = formData.get('full_name') as string
    const role = formData.get('role') as string || 'student'

    // Check password length client-side equivalent
    if (!password || password.length < 6) {
        redirect('/auth/signup?error=Password must be at least 6 characters.')
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name,
                role,
            },
        },
    })

    if (error) {
        const msg = error.message?.toLowerCase() || ''
        if (msg.includes('already registered') || msg.includes('already been registered') || msg.includes('user already registered')) {
            redirect('/auth/signup?error=This email is already registered. Try logging in instead.')
        }
        if (msg.includes('valid email')) {
            redirect('/auth/signup?error=Please enter a valid email address.')
        }
        if (msg.includes('password')) {
            redirect('/auth/signup?error=Password must be at least 6 characters.')
        }
        redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`)
    }

    // Supabase returns user with identities=[] when email already exists (no error thrown)
    if (data?.user?.identities?.length === 0) {
        redirect('/auth/signup?error=An account with this email already exists. Try logging in.')
    }

    revalidatePath('/', 'layout')
    redirect('/auth/check-email')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/auth/login')
}
