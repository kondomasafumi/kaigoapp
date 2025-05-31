import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { id, password } = await req.json()

  const { error } = await supabaseAdmin.auth.admin.updateUserById(id, { password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ message: "パスワード更新成功" })
}