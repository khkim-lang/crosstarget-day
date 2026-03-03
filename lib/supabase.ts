import { createClient } from '@supabase/supabase-js'

const sanitize = (val: string | undefined) => {
    if (!val) return val
    // Trim spaces/newlines and remove literal quotes
    return val.trim().replace(/^["']|["']$/g, "")
}

const supabaseUrl = sanitize(process.env.NEXT_PUBLIC_SUPABASE_URL)
const supabaseAnonKey = sanitize(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// Using placeholders to prevent build errors if env vars are missing
// The app will still need real credentials to function correctly.
export const supabase = createClient(
    supabaseUrl || "https://placeholder-url.supabase.co",
    supabaseAnonKey || "placeholder-key"
)

if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === "development") {
        console.warn(
            "⚠️ Supabase credentials missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
        )
    }
}
