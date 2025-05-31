// app/api/reset-admin/route.ts
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service Role Key を使用
)

const targetEmail = "admin@example.com"
const newPassword = "admin1234"

export async function POST() {
  //  すでにリセット済みか確認（例: usersテーブルのカスタムフラグやログなどをチェック）
  const { data: userList, error: fetchError } = await supabase.auth.admin.listUsers({ email: targetEmail })

  if (fetchError || !userList.users.length) {
    return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 })
  }

  const user = userList.users[0]

  //  すでにadmin1234になってる場合（パスワード確認できないので再実行でも問題ないように）
  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    password: newPassword,
  })

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ message: "✅ パスワードをリセットしました" })
}
