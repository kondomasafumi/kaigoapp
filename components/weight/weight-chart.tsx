"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase, type WeightRecord } from "@/lib/supabase"
import { useResident } from "@/context/resident-context"
import { useToast } from "@/components/ui/use-toast"
import { getWeekRange, getMonthRange, formatDate } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { ChartContainer } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function WeightChart() {
  const [weekData, setWeekData] = useState<any[]>([])
  const [monthData, setMonthData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { selectedResident } = useResident()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedResident) return

      try {
        setLoading(true)

        // 週間データの取得
        const weekRange = getWeekRange()
        const { data: weekRecords, error: weekError } = await supabase
          .from("weight_records")
          .select("*")
          .eq("resident_id", selectedResident.id)
          .gte("recorded_at", weekRange.start.toISOString())
          .lte("recorded_at", weekRange.end.toISOString())
          .order("recorded_at")

        if (weekError) throw weekError

        // 月間データの取得
        const monthRange = getMonthRange()
        const { data: monthRecords, error: monthError } = await supabase
          .from("weight_records")
          .select("*")
          .eq("resident_id", selectedResident.id)
          .gte("recorded_at", monthRange.start.toISOString())
          .lte("recorded_at", monthRange.end.toISOString())
          .order("recorded_at")

        if (monthError) throw monthError

        // データの整形
        setWeekData(formatChartData(weekRecords as WeightRecord[]))
        setMonthData(formatChartData(monthRecords as WeightRecord[]))
      } catch (error: any) {
        toast({
          title: "エラー",
          description: "体重記録の取得に失敗しました。",
          variant: "destructive",
        })
        console.error("体重記録取得エラー:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedResident, toast])

  const formatChartData = (records: WeightRecord[]) => {
    return records.map((record) => ({
      date: formatDate(record.recorded_at),
      weight: record.weight,
    }))
  }

  if (!selectedResident) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>体重変化グラフ</CardTitle>
          <CardDescription>利用者を選択してください</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>体重変化グラフ</CardTitle>
          <CardDescription>データを読み込んでいます...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>体重変化グラフ</CardTitle>
        <CardDescription>{selectedResident.name}さんの体重変化</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="week">
          <TabsList className="mb-4">
            <TabsTrigger value="week">週間</TabsTrigger>
            <TabsTrigger value="month">月間</TabsTrigger>
          </TabsList>
          <TabsContent value="week">
            {weekData.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">この期間のデータがありません</p>
            ) : (
              <ChartContainer
                config={{
                  weight: {
                    label: "体重 (kg)",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="var(--color-weight)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </TabsContent>
          <TabsContent value="month">
            {monthData.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">この期間のデータがありません</p>
            ) : (
              <ChartContainer
                config={{
                  weight: {
                    label: "体重 (kg)",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="var(--color-weight)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
