import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Supabase URLまたはService Role Keyが設定されていません。")
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
