"use client"

import { ResidentForm } from "@/components/admin/resident-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NewResidentPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/residents")} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">戻る</span>
        </Button>
        <h1 className="text-2xl font-bold">新規利用者登録</h1>
      </div>

      <ResidentForm />
    </div>
  )
}
