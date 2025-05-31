"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase, type User } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)

        const { data, error } = await supabase.from("users").select("*").order("name")
        console.log("取得データ:", data)
        if (error) throw error

        setUsers(data as User[])
      } catch (error: any) {
        toast({
          title: "エラー",
          description: "職員情報の取得に失敗しました。",
          variant: "destructive",
        })
        console.error("職員取得エラー:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [toast])

  const handleDelete = async () => {
    if (!deleteUser) return

    try {
      setDeleting(true)

      const { error } = await supabase.from("users").delete().eq("id", deleteUser.id)

      if (error) throw error

      setUsers(users.filter((u) => u.id !== deleteUser.id))
      setDeleteUser(null)

      toast({
        title: "削除完了",
        description: "職員を削除しました。",
      })
    } catch (error: any) {
      toast({
        title: "エラー",
        description: "職員の削除に失敗しました。",
        variant: "destructive",
      })
      console.error("職員削除エラー:", error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">職員管理</h1>
        <Link href="/admin/users/new" passHref>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規登録
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>職員一覧</CardTitle>
          <CardDescription>登録されている職員の一覧です</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">登録されている職員はいません</p>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      職員ID: {user.staff_number}
                      {/* employee_number から staff_number に変更 */}
                      <Badge className="ml-2" variant={user.role === "admin" ? "default" : "outline"}>
                        {user.role === "admin" ? "管理者" : "職員"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => router.push(`/admin/users/edit/${user.id}`)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">編集</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setDeleteUser(user)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">削除</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {deleteUser && (
        <Dialog open onOpenChange={() => setDeleteUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>職員の削除</DialogTitle>
              <DialogDescription>この職員を削除しますか？</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="font-medium">{deleteUser.name}</p>
              <p className="text-sm text-muted-foreground">
                職員ID: {deleteUser.staff_number}
                {/* employee_number から staff_number に変更 */} / 権限:{" "}
                {deleteUser.role === "admin" ? "管理者" : "職員"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">この操作は元に戻せません。</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDeleteUser(null)}>
                キャンセル
              </Button>
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    削除中...
                  </>
                ) : (
                  "削除する"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
