"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { formatDateForInput } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface WeightEditModalProps {
  record: WeightRecord
  onClose: () => void
  onSuccess: () => void
}

export function WeightEditModal({ record, onClose, onSuccess }: WeightEditModalProps) {
  const [weight, setWeight] = useState(record.weight.toString())
  const [date, setDate] = useState(formatDateForInput(record.recorded_at))
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      const { error } = await supabase
        .from("weight_records")
        .update({
          weight: Number.parseFloat(weight),
          recorded_at: date,
        })
        .eq("id", record.id)

      if (error) throw error

      toast({
        title: "更新完了",
        description: "体重記録を更新しました。",
      })

      onSuccess()
    } catch (error: any) {
      toast({
        title: "エラー",
        description: "体重記録の更新に失敗しました。",
        variant: "destructive",
      })
      console.error("体重記録更新エラー:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>体重記録の編集</DialogTitle>
          <DialogDescription>体重記録の情報を編集します</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-date">記録日</Label>
              <Input id="edit-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-weight">体重 (kg)</Label>
              <Input
                id="edit-weight"
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  更新中...
                </>
              ) : (
                "更新する"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
