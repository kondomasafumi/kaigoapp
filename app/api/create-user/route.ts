import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextRequest, NextResponse } from "next/server"

interface CreateUserPayload {
    staffNumber: string
    password: string
    name: string
    role: "admin" | "staff"
}

export async function POST(req: NextRequest) {

    const body = await req.json()
    const { staffNumber, password, name, role } = body as CreateUserPayload

    if (!staffNumber || !password || !name || !(role === "admin" || role === "staff")) {
        return NextResponse.json({ error: "入力が不正です" }, { status: 400 })
    }

    // 認証ユーザー作成（Auth）
    const { data: createdUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: `${staffNumber}@example.com`,
        password,
        user_metadata: { name },
    })
    if (authError) {
        console.error("Authエラー:", authError)
        return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // アプリ側usersテーブルへ挿入
    const { error: insertError } = await supabaseAdmin.from("users").insert({
        id: createdUser.user?.id,
        staff_number: staffNumber,
        name,
        role,
    })
    if (insertError) {
        console.error("DB挿入エラー:", insertError)
        return NextResponse.json({ error: insertError.message }, { status: 400 })
    }

    return NextResponse.json({
        message: "登録成功",
        userId: createdUser.user?.id,
        role,
        name,
    })
}
