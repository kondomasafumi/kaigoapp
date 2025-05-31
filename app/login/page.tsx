"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [staffNumber, setStaffNumber] = useState("")
  const [password, setPassword] = useState("")
  const { signIn, loading, user, signUp } = useAuth()
  const router = useRouter()
useEffect(() => {
  if (!loading && user) {
    router.push("/dashboard")
  }
}, [user, loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn(staffNumber, password)
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">介護記録管理システム</CardTitle>
          <CardDescription className="text-center">職員IDとパスワードでログインしてください</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="staffNumber">職員ID</Label>
              <Input
                id="staffNumber"
                placeholder="職員IDを入力（例: 12345）"
                value={staffNumber}
                onChange={(e) => setStaffNumber(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">※ 管理者から発行された職員IDを入力してください</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                placeholder="パスワードを入力"
                autoComplete="current-password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ログイン中...
                </>
              ) : (
                "ログイン"
              )}
            </Button>
            {signUp && (
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={async () => {
                  await signUp(staffNumber, password)
                }}
              >
                管理者アカウントを登録（開発用）
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}