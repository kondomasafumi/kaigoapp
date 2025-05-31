import { supabase } from "./supabase"

// 職員番号をメールアドレスに変換する関数 - @example.comに変更
const convertToEmail = (staffNumber: string): string => {
  return `${staffNumber}@example.com`
}

// Supabaseの初期設定を行う関数
export async function setupSupabase() {
  try {
    console.log("Supabase初期設定を開始...")

    // 管理者ユーザーが存在するか確認
    const { data: existingAdmin, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("staff_number", "admin")
      .single()

    if (!checkError && existingAdmin) {
      console.log("管理者ユーザーは既に存在します")
      return
    }

    // Supabase Authにユーザーを作成
    const adminEmail = convertToEmail("admin")
    const adminPassword = "admin123"

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
    })

    if (authError) {
      throw authError
    }

    if (!authData.user) {
      throw new Error("ユーザー作成に失敗しました")
    }

    // 作成されたユーザーのIDを取得
    const userId = authData.user.id

    // usersテーブルに管理者ユーザーを作成
    const { error: createError } = await supabase.from("users").insert({
      id: userId, // Auth userのIDと同じIDを使用
      staff_number: "admin",
      name: "システム管理者",
      role: "admin",
    })

    if (createError) {
      throw createError
    }

    console.log("Supabase初期設定が完了しました")
    console.log(`管理者ユーザー: ${adminEmail} / パスワード: ${adminPassword}`)
  } catch (error) {
    console.error("Supabase初期設定エラー:", error)
  }
}
