"use client"

import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, User, Users, Weight, LogOut } from "lucide-react"

export function Navbar() {
  const { user, signOut, isAdmin } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="font-semibold text-lg">
            介護記録管理システム
          </Link>
        </div>
        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
          <Link
            href="/dashboard"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <div className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>ホーム</span>
            </div>
          </Link>
          <Link
            href="/dashboard/weight"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname.startsWith("/dashboard/weight") ? "text-primary" : "text-muted-foreground",
            )}
          >
            <div className="flex items-center space-x-2">
              <Weight className="h-4 w-4" />
              <span>体重記録</span>
            </div>
          </Link>
          {isAdmin && (
            <>
              <Link
                href="/admin/residents"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname.startsWith("/admin/residents") ? "text-primary" : "text-muted-foreground",
                )}
              >
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>利用者管理</span>
                </div>
              </Link>
              <Link
                href="/admin/users"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname.startsWith("/admin/users") ? "text-primary" : "text-muted-foreground",
                )}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>職員管理</span>
                </div>
              </Link>
            </>
          )}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            {user.name} ({user.role === "admin" ? "管理者" : "職員"})
          </div>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">ログアウト</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
