"use client"

import { useState, useEffect } from "react"
import { supabase, type WeightRecord } from "@/lib/supabase"
import { useResident } from "@/context/resident-context"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { WeightEditModal } from "./weight-edit-modal"
import { WeightDeleteModal } from "./weight-delete-modal"

export function WeightList({ refresh, onRefresh }: { refresh: number; onRefresh: () => void }) {
  const [records, setRecords] = useState<WeightRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [editRecord, setEditRecord] = useState<WeightRecord | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<WeightRecord | null>(null)
  const { selectedResident } = useResident()
  const { toast } = useToast()

  useEffect(() => {
    const fetchRecords = async () => {
      if (!selectedResident) return

      try {
        setLoading(true)

        const { data, error } = await supabase
          .from("weight_records")
          .select("*")
          .eq("resident_id", selectedResident.id)
          .order("recorded_at", { ascending: false })

        if (error) throw error

        setRecords(data as WeightRecord[])
      } catch (error: any) {
        toast({
          title: "エラー",
          description: "体重記録の取得に失敗しました。",
          variant: "destructive",
        })
        console.error("体重記録取得エラー:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
  }, [selectedResident, refresh, toast])

  const handleEditSuccess = () => {
    setEditRecord(null)
    onRefresh()
  }

  const handleDeleteSuccess = () => {
    setDeleteRecord(null)
    onRefresh()
  }

  if (!selectedResident) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>体重記録一覧</CardTitle>
          <CardDescription>利用者を選択してください</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>体重記録一覧</CardTitle>
          <CardDescription>記録を読み込んでいます...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>体重記録一覧</CardTitle>
          <CardDescription>
            {selectedResident.name}さんの体重記録 ({records.length}件)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">記録がありません</p>
          ) : (
            <div className="space-y-2">
              {records.map((record) => (
                <div key={record.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <div className="font-medium">{formatDate(record.recorded_at)}</div>
                    <div className="text-lg">{record.weight} kg</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => setEditRecord(record)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">編集</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setDeleteRecord(record)}>
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

      {editRecord && (
        <WeightEditModal record={editRecord} onClose={() => setEditRecord(null)} onSuccess={handleEditSuccess} />
      )}

      {deleteRecord && (
        <WeightDeleteModal
          record={deleteRecord}
          onClose={() => setDeleteRecord(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  )
}
