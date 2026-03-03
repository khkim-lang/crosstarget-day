import { createClient, SupabaseClient } from '@supabase/supabase-js'

const sanitize = (val: string | undefined) => {
    if (!val || val === "undefined" || val === "null") return undefined
    // Remove quotes and then trim again for hidden spaces/newlines
    const cleaned = val.trim().replace(/^["']|["']$/g, "").trim()
    return cleaned === "" ? undefined : cleaned
}

let supabaseInstance: SupabaseClient | null = null

export const getSupabase = () => {
    if (supabaseInstance) return supabaseInstance

    const url = sanitize(process.env.NEXT_PUBLIC_SUPABASE_URL)
    const key = sanitize(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    // Log diagnostic info (safely)
    console.log(`[Supabase Init] URL Length: ${url?.length || 0}, Key Length: ${key?.length || 0}`)

    if (!url || !key || !url.startsWith("http")) {
        const errorMsg = !url || !key
            ? "Supabase environment variables are missing in Vercel settings."
            : `Invalid Supabase URL format (starts with "${url.substring(0, 10)}..."). Make sure it starts with https://. (Length: ${url.length})`

        if (process.env.NODE_ENV === "production") {
            console.error(`[Supabase Error] ${errorMsg}`)
            throw new Error(errorMsg)
        }
        // Fallback for build time ONLY
        return createClient("https://placeholder-url.supabase.co", "placeholder-key")
    }

    supabaseInstance = createClient(url, key)
    return supabaseInstance
}

// Export a proxy for backward compatibility
export const supabase = new Proxy({} as SupabaseClient, {
    get: (target, prop) => {
        const client = getSupabase()
        const value = (client as any)[prop]
        if (typeof value === "function") {
            return value.bind(client)
        }
        return value
    },
})
