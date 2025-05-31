import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/auth-context"
import { ResidentProvider } from "@/context/resident-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "介護業務システム",
  description: "介護施設職員向け体重記録見える化アプリ",
  generator: "v0.dev"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="light" style={{ colorScheme: "light" }}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ResidentProvider>
              {children}
              <Toaster />
            </ResidentProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}