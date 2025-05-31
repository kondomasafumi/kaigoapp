"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useResident } from "@/context/resident-context"
import { supabase, type Resident } from "@/lib/supabase"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Weight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function DashboardPage() {
  const { user } = useAuth()
  const { setSelectedResident } = useResident()
  const [residents, setResidents] = useState<Resident[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const { data, error } = await supabase
          .from("residents")
          .select("*")
          .order("name")

        if (error) throw error
        setResidents(data as Resident[])
      } catch (error: any) {
        toast({
          title: "エラー",
          description: "利用者情報の取得に失敗しました。",
          variant: "destructive",
        })
        console.error("❌ 利用者取得エラー:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResidents()
  }, [toast])

  const handleResidentSelect = (id: string) => {
    setSelectedId(id)
    const resident = residents.find((r) => r.id === id) || null
    setSelectedResident(resident)
  }

  const handleCategorySelect = (category: string) => {
    if (!selectedId) {
      toast({
        title: "エラー",
        description: "利用者を選択してください。",
        variant: "destructive",
      })
      return
    }

    if (category === "weight") {
      router.push("/dashboard/weight")
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">介護記録ホーム</h1>

      {/* 利用者選択 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>利用者選択</CardTitle>
          <CardDescription>
            記録を入力・確認する利用者を選択してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedId} onValueChange={handleResidentSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="利用者を選択" />
            </SelectTrigger>
            <SelectContent>
              {residents.map((resident) => (
                <SelectItem key={resident.id} value={resident.id}>
                  {resident.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* カテゴリ選択 */}
      <Card>
        <CardHeader>
          <CardTitle>記録カテゴリ選択</CardTitle>
          <CardDescription>記録するカテゴリを選択してください</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Button
              variant="outline"
              className="h-24 flex-col space-y-2"
              onClick={() => handleCategorySelect("weight")}
              disabled={!selectedId}
            >
              <Weight className="h-8 w-8" />
              <span>体重記録</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}