import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import OnboardingWizard from './onboarding-wizard'

export default async function OnboardingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/auth/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // If already onboarded, go to feed
    if (profile?.onboarding_complete) {
        redirect('/feed')
    }

    return <OnboardingWizard profile={profile} />
}
