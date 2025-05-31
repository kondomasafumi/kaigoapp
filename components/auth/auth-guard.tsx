"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export function AuthGuard({ children, adminOnly = false }: AuthGuardProps) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.warn("🔁 未ログイン → /login に遷移")
        setRedirecting(true)
        router.push("/login")
      } else if (adminOnly && !isAdmin) {
        console.warn("🔁 非管理者 → /dashboard に遷移")
        setRedirecting(true)
        router.push("/dashboard")
      }
    }
  }, [user, loading, adminOnly, isAdmin, router])

  if (loading || redirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}