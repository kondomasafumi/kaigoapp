"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { useResident } from "@/context/resident-context"
import { formatDateForInput } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export function WeightForm({ onSuccess }: { onSuccess: () => void }) {
  const [weight, setWeight] = useState("")
  const [date, setDate] = useState(formatDateForInput(new Date()))
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const { selectedResident } = useResident()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedResident) {
      toast({
        title: "エラー",
        description: "利用者が選択されていません。",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      const { error } = await supabase.from("weight_records").insert({
        resident_id: selectedResident.id,
        weight: Number.parseFloat(weight),
        recorded_at: date,
        recorded_by: user?.id,
      })

      if (error) throw error

      toast({
        title: "登録完了",
        description: "体重記録を登録しました。",
      })

      setWeight("")
      setDate(formatDateForInput(new Date()))
      onSuccess()
    } catch (error: any) {
      toast({
        title: "エラー",
        description: "体重記録の登録に失敗しました。",
        variant: "destructive",
      })
      console.error("体重記録エラー:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>体重記録</CardTitle>
        <CardDescription>利用者の体重を記録します</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">記録日</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">体重 (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="体重を入力"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={loading || !selectedResident}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                登録中...
              </>
            ) : (
              "登録する"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
