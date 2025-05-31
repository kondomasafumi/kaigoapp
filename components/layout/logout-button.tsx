"use client"

import { useAuth } from "@/context/auth-context"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const { user, signOut } = useAuth()
  if (!user) return null

  return (
    <Button variant="ghost" size="icon" onClick={signOut} title="ログアウト">
      <LogOut className="h-5 w-5" />
      <span className="sr-only">ログアウト</span>
    </Button>
  )
}