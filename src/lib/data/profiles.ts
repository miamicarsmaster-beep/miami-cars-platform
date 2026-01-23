import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/types/database'

export async function getProfiles(): Promise<Profile[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching profiles:', error)
        return []
    }

    return data || []
}

export async function getInvestors(): Promise<Profile[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'investor')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching investors:', error)
        return []
    }

    return data || []
}

export async function getProfileById(id: string): Promise<Profile | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching profile:', error)
        return null
    }

    return data
}
