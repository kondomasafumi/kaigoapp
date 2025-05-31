"use client"

import { useState } from "react"
import { useResident } from "@/context/resident-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WeightForm } from "@/components/weight/weight-form"
import { WeightList } from "@/components/weight/weight-list"
import { WeightChart } from "@/components/weight/weight-chart"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function WeightPage() {
  const [refreshCounter, setRefreshCounter] = useState(0)
  const { selectedResident } = useResident()
  const router = useRouter()

  const handleRefresh = () => {
    setRefreshCounter((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">戻る</span>
        </Button>
        <h1 className="text-2xl font-bold">体重記録</h1>
      </div>

      {selectedResident ? (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>利用者情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">氏名</p>
                  <p className="font-medium">{selectedResident.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">部屋番号</p>
                  <p className="font-medium">{selectedResident.room_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">生年月日</p>
                  <p className="font-medium">{selectedResident.date_of_birth}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">要介護度</p>
                  <p className="font-medium">{selectedResident.care_level}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <WeightForm onSuccess={handleRefresh} />
            <WeightList refresh={refreshCounter} onRefresh={handleRefresh} />
          </div>

          <WeightChart />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>利用者が選択されていません</CardTitle>
            <CardDescription>ダッシュボードから利用者を選択してください</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard")}>ダッシュボードに戻る</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
