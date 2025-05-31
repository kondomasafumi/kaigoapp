import type { ReactNode } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Navbar } from "@/components/layout/navbar"
import { LogoutButton } from "@/components/layout/logout-button"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="relative flex flex-col min-h-screen">

        {/* ログアウトボタン：右上固定（スマホ・PC共通） */}
        <div className="fixed top-2 right-4 z-50">
          <LogoutButton />
        </div>

        {/* ナビバー（PC上部） */}
        <header className="hidden md:block sticky top-0 w-full border-b bg-white z-40">
          <Navbar />
        </header>

        {/* メインコンテンツ */}
        <main className="flex-1 p-6">{children}</main>

        {/* ナビバー（スマホ下部） */}
        <nav className="block md:hidden fixed bottom-0 w-full border-t bg-white z-40">
          <Navbar />
        </nav>
      </div>
    </AuthGuard>
  )
}