"use client"

import { UserForm } from "@/components/admin/user-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NewUserPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/users")} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">戻る</span>
        </Button>
        <h1 className="text-2xl font-bold">新規職員登録</h1>
      </div>

      <UserForm />
    </div>
  )
}
