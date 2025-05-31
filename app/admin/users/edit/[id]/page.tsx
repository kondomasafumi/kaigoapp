"use client"

import { useState, useEffect, useCallback } from "react"
import { UserForm } from "@/components/admin/user-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { supabase, type User } from "@/lib/supabase"

export default function EditUserPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { id } = params

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)

        const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

        if (error) throw error

        setUser(data as User)
      } catch (error: any) {
        toast({
          title: "エラー",
          description: error.message || "職員情報の取得に失敗しました。もう一度お試しください。",
          variant: "destructive",
        })
        console.error("職員取得エラー:", error)
        router.push("/admin/users")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id, router, toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <p>読み込み中...</p>
      </div>
    )
  }

  if (!user) {
    return null;
  }

  const handleBack = useCallback(() => {
    router.push("/admin/users");
  }, [router]);

  return (
    <div className="container mx-auto sm:max-w-md lg:max-w-lg">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">戻る</span>
        </Button>
        <h1 className="text-2xl font-bold">職員情報編集</h1>
      </div>

      <UserForm user={user} isEdit />
    </div>
  )
}