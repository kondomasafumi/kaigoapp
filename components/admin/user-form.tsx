"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { supabase, type User } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"


interface UserFormProps {
  user?: User
  isEdit?: boolean
}

export function UserForm({ user, isEdit = false }: UserFormProps) {
  const [staffNumber, setStaffNumber] = useState(user?.staff_number || "") // employee_number から staff_number に変更
  const [name, setName] = useState(user?.name || "")
  const [role, setRole] = useState<"admin" | "staff">(user?.role || "staff")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      if (isEdit && user?.id) {
        // 更新処理
        const { error } = await supabase
          .from("users")
          .update({
            staff_number: staffNumber, // employee_number から staff_number に変更
            name,
            role,
          })
          .eq("id", user.id)

        if (error) throw error

        // パスワード変更がある場合
        if (password) {
          const res = await fetch("/api/update-user-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: user.id, password }),
          })
          if (!res.ok) {
            const result = await res.json()
            throw new Error(result.error || "登録に失敗しました")
          }
        }

        toast({
          title: "更新完了",
          description: "職員情報を更新しました。",
        })
      } else {
        // 新規登録処理

        const res = await fetch("/api/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            staffNumber,
            name,
            password,
            role,
          }),
        })

        const result = await res.json()
        if (!res.ok) throw new Error(result.error || "登録に失敗しました")

        toast({ title: "登録完了", description: "職員を登録しました。" })
        router.push("/admin/users")
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          title: "エラー",
          description: err.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "不明なエラー",
          description: String(err),
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "職員情報編集" : "新規職員登録"}</CardTitle>
        <CardDescription>{isEdit ? "職員の情報を編集します" : "新しい職員を登録します"}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="staffNumber">職員ID</Label>
            <Input
              id="staffNumber"
              placeholder="職員IDを入力"
              value={staffNumber}
              onChange={(e) => setStaffNumber(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">氏名</Label>
            <Input id="name" placeholder="氏名を入力" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">権限</Label>
            <Select value={role} onValueChange={(value) => {
              if (value === "admin" || value === "staff") setRole(value)
            }}>
              <SelectTrigger id="role">
                <SelectValue placeholder="権限を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">管理者</SelectItem>
                <SelectItem value="staff">職員</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{isEdit ? "パスワード（変更する場合のみ）" : "パスワード"}</Label>
            <Input
              id="password"
              type="password"
              placeholder={isEdit ? "新しいパスワードを入力" : "パスワードを入力"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isEdit}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/users")}>
            キャンセル
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "更新中..." : "登録中..."}
              </>
            ) : isEdit ? (
              "更新する"
            ) : (
              "登録する"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}


