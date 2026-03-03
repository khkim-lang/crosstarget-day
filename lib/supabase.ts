import { createClient, SupabaseClient } from '@supabase/supabase-js'

const sanitize = (val: string | undefined) => {
    if (!val) return undefined
    const cleaned = val.trim().replace(/^["']|["']$/g, "")
    return cleaned === "" ? undefined : cleaned
}

let supabaseInstance: SupabaseClient | null = null

export const getSupabase = () => {
    if (supabaseInstance) return supabaseInstance

    const url = sanitize(process.env.NEXT_PUBLIC_SUPABASE_URL)
    const key = sanitize(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    if (!url || !key) {
        // We throw ONLY when the client is actually requested and values are missing
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Missing Supabase environment variables')
        }
        // Fallback for development/build warning
        return createClient('https://placeholder-url.supabase.co', 'placeholder-key')
    }

    supabaseInstance = createClient(url, key)
    return supabaseInstance
}

// Export a proxy for backward compatibility if possible, or just export the helper
export const supabase = new Proxy({} as SupabaseClient, {
    get: (_, prop) => {
        const client = getSupabase()
        return (client as any)[prop]
    }
})

