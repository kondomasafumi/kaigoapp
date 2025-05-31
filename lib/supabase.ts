import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URLまたはAnonymous Keyが設定されていません。")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  staff_number: string
  name: string
  role: "admin" | "staff"
  created_at: string
}

export type Resident = {
  id: string
  name: string
  birthday: string         // ← Supabaseの型：date（文字列で扱う）
  gender: string           // ← 新規追加
  care_level: string
  room_number: string
  medical_history: string  // ← 新規追加
  created_at: string
}

export type WeightRecord = {
  id: string
  resident_id: string
  weight: number
  recorded_at: string
  recorded_by: string
  created_at: string
}
