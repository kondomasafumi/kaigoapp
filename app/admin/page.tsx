"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, UserPlus, Users, UserCog } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">管理者ホーム</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 利用者管理カード */}
        <Card>
          <CardHeader>
            <CardTitle>利用者管理</CardTitle>
            <CardDescription>利用者情報の登録・編集・削除</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Link href="/admin/residents">
              <Button className="w-full">
                <User className="mr-2 h-4 w-4" />
                利用者一覧
              </Button>
            </Link>
            <Link href="/admin/residents/new">
              <Button variant="outline" className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                新規利用者登録
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* 職員管理カード */}
        <Card>
          <CardHeader>
            <CardTitle>職員管理</CardTitle>
            <CardDescription>職員情報の登録・編集・削除</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Link href="/admin/users">
              <Button className="w-full">
                <Users className="mr-2 h-4 w-4" />
                職員一覧
              </Button>
            </Link>
            <Link href="/admin/users/new">
              <Button variant="outline" className="w-full">
                <UserCog className="mr-2 h-4 w-4" />
                新規職員登録
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}