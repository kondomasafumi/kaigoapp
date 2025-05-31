"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { supabase, type WeightRecord } from "@/lib/supabase"
import { formatDate } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface WeightDeleteModalProps {
  record: WeightRecord
  onClose: () => void
  onSuccess: () => void
}

export function WeightDeleteModal({ record, onClose, onSuccess }: WeightDeleteModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      setLoading(true)

      const { error } = await supabase.from("weight_records").delete().eq("id", record.id)

      if (error) throw error

      toast({
        title: "削除完了",
        description: "体重記録を削除しました。",
      })

      onSuccess()
    } catch (error: any) {
      toast({
        title: "エラー",
        description: "体重記録の削除に失敗しました。",
        variant: "destructive",
      })
      console.error("体重記録削除エラー:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>体重記録の削除</DialogTitle>
          <DialogDescription>この体重記録を削除しますか？</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>
            <span className="font-medium">{formatDate(record.recorded_at)}</span>の記録
            <span className="block text-lg font-semibold mt-1">{record.weight} kg</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">この操作は元に戻せません。</p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? (
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
  )
}
