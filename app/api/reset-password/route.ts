import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service Role Key を使用
)

export async function POST() {
  const email = "12345@example.com"
  const newPassword = "new-password-123"

  // ユーザー情報取得
  const { data: userList, error: fetchError } = await supabaseAdmin.auth.admin.listUsers({ email })

  if (fetchError || !userList.users.length) {
    return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 })
  }

  const user = userList.users[0]

  // パスワードを更新
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    password: newPassword,
  })

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ message: "パスワードをリセットしました" })
}
