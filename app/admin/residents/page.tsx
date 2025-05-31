"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase, type Resident } from "@/lib/supabase"
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

export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteResident, setDeleteResident] = useState<Resident | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        setLoading(true)

        const { data, error } = await supabase.from("residents").select("*").order("name")

        if (error) throw error

        setResidents(data as Resident[])
      } catch (error: any) {
        toast({
          title: "エラー",
          description: "利用者情報の取得に失敗しました。",
          variant: "destructive",
        })
        console.error("利用者取得エラー:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResidents()
  }, [toast])

  const handleDelete = async () => {
    if (!deleteResident) return

    try {
      setDeleting(true)

      const { error } = await supabase.from("residents").delete().eq("id", deleteResident.id)

      if (error) throw error

      setResidents(residents.filter((r) => r.id !== deleteResident.id))
      setDeleteResident(null)

      toast({
        title: "削除完了",
        description: "利用者を削除しました。",
      })
    } catch (error: any) {
      toast({
        title: "エラー",
        description: "利用者の削除に失敗しました。",
        variant: "destructive",
      })
      console.error("利用者削除エラー:", error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">利用者管理</h1>
        <Link href="/admin/residents/new" passHref>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規登録
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>利用者一覧</CardTitle>
          <CardDescription>登録されている利用者の一覧です</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : residents.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">登録されている利用者はいません</p>
          ) : (
            <div className="space-y-2">
              {residents.map((resident) => (
                <div key={resident.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <div className="font-medium">{resident.name}</div>
                    <div className="text-sm text-muted-foreground">
                      部屋: {resident.room_number} / 要介護度: {resident.care_level}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => router.push(`/admin/residents/edit/${resident.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">編集</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setDeleteResident(resident)}>
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

      {deleteResident && (
        <Dialog open onOpenChange={() => setDeleteResident(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>利用者の削除</DialogTitle>
              <DialogDescription>この利用者を削除しますか？関連する記録もすべて削除されます。</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="font-medium">{deleteResident.name}</p>
              <p className="text-sm text-muted-foreground">
                部屋: {deleteResident.room_number} / 要介護度: {deleteResident.care_level}
              </p>
              <p className="text-sm text-muted-foreground mt-2">この操作は元に戻せません。</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDeleteResident(null)}>
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
