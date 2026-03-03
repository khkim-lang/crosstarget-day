import { createClient, SupabaseClient } from '@supabase/supabase-js'

const sanitize = (val: string | undefined) => {
    if (!val || val === "undefined" || val === "null") return undefined
    const cleaned = val.trim().replace(/^["']|["']$/g, "").trim()
    return cleaned === "" ? undefined : cleaned
}

let supabaseInstance: SupabaseClient | null = null

export const getSupabase = () => {
    if (supabaseInstance) return supabaseInstance

    const url = sanitize(process.env.NEXT_PUBLIC_SUPABASE_URL)
    const key = sanitize(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    console.log(`[Supabase Init] URL present: ${!!url}, Key present: ${!!key}`)
    if (url) {
        console.log(`[Supabase Init] URL starts with: ${url.substring(0, 8)}... (length: ${url.length})`)
    }

    if (!url || !key || !url.startsWith("http")) {
        const errorMsg = !url || !key
            ? "Missing Supabase environment variables"
            : `Invalid Supabase URL format: ${url?.substring(0, 10)}...`

        if (process.env.NODE_ENV === "production") {
            console.error(`[Supabase Error] ${errorMsg}`)
            throw new Error(errorMsg)
        }
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

