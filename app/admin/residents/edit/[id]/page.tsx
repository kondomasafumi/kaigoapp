"use client"

import { useState, useEffect } from "react"
import { ResidentForm } from "@/components/admin/resident-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { supabase, type Resident } from "@/lib/supabase"

export default function EditResidentPage({ params }: { params: { id: string } }) {
  const [resident, setResident] = useState<Resident | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { id } = params

  useEffect(() => {
    const fetchResident = async () => {
      try {
        setLoading(true)

        const { data, error } = await supabase.from("residents").select("*").eq("id", id).single()

        if (error) throw error

        setResident(data as Resident)
      } catch (error: any) {
        toast({
          title: "エラー",
          description: "利用者情報の取得に失敗しました。",
          variant: "destructive",
        })
        console.error("利用者取得エラー:", error)
        router.push("/admin/residents")
      } finally {
        setLoading(false)
      }
    }

    fetchResident()
  }, [id, router, toast])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!resident) return null

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/residents")} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">戻る</span>
        </Button>
        <h1 className="text-2xl font-bold">利用者情報編集</h1>
      </div>

      <ResidentForm resident={resident} isEdit />
    </div>
  )
}
