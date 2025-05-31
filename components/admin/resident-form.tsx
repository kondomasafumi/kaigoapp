"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { supabase, type Resident } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { formatDateForInput } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea";

interface ResidentFormProps {
  resident?: Resident
  isEdit?: boolean
}

export function ResidentForm({ resident, isEdit = false }: ResidentFormProps) {
  const [name, setName] = useState(resident?.name || "")
  const [roomNumber, setRoomNumber] = useState(resident?.room_number || "")
  const [birthday, setBirthday] = useState(resident?.birthday ? formatDateForInput(resident.birthday) : "")
  const [careLevel, setCareLevel] = useState(resident?.care_level || "")
  const [gender, setGender] = useState(resident?.gender || "")
  const [medicalHistory, setMedicalHistory] = useState(resident?.medical_history || "")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      if (isEdit && resident) {
        // 更新処理
        const { error } = await supabase
          .from("residents")
          .update({
            name,
            room_number: roomNumber,
            birthday: birthday,
            care_level: careLevel,
            gender: gender,
            medical_history: medicalHistory,
          })
          .eq("id", resident.id)

        if (error) throw error

        toast({
          title: "更新完了",
          description: "利用者情報を更新しました。",
        })
      } else {
        // 新規登録処理
        const { error } = await supabase.from("residents").insert({
          name,
          room_number: roomNumber,
          birthday: birthday,
          care_level: careLevel,
          gender: gender,
          medical_history: medicalHistory,
        })

        if (error) throw error

        toast({
          title: "登録完了",
          description: "利用者を登録しました。",
        })
      }

      router.push("/admin/residents")
    } catch (error: any) {
      toast({
        title: "エラー",
        description: isEdit ? "利用者情報の更新に失敗しました。" : "利用者の登録に失敗しました。",
        variant: "destructive",
      })
      console.error("利用者登録/更新エラー:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "利用者情報編集" : "新規利用者登録"}</CardTitle>
        <CardDescription>{isEdit ? "利用者の情報を編集します" : "新しい利用者を登録します"}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">氏名</Label>
            <Input id="name" placeholder="氏名を入力" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roomNumber">部屋番号</Label>
            <Input
              id="roomNumber"
              placeholder="部屋番号を入力"
              value={roomNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomNumber(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthday">生年月日</Label>
            <Input
              id="birthday"
              type="date"
              value={birthday}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBirthday(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">性別</Label>
            <Select value={gender} onValueChange={setGender} required>
              <SelectTrigger id="gender">
                <SelectValue placeholder="性別を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="男性">男性</SelectItem>
                <SelectItem value="女性">女性</SelectItem>
                <SelectItem value="その他">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="careLevel">要介護度</Label>
            <Select value={careLevel} onValueChange={setCareLevel} required>
              <SelectTrigger id="careLevel">
                <SelectValue placeholder="要介護度を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="自立">自立</SelectItem>
                <SelectItem value="要支援1">要支援1</SelectItem>
                <SelectItem value="要支援2">要支援2</SelectItem>
                <SelectItem value="要介護1">要介護1</SelectItem>
                <SelectItem value="要介護2">要介護2</SelectItem>
                <SelectItem value="要介護3">要介護3</SelectItem>
                <SelectItem value="要介護4">要介護4</SelectItem>
                <SelectItem value="要介護5">要介護5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="medicalHistory">病歴・備考</Label>
            <Textarea
              id="medicalHistory"
              placeholder="既往歴・注意事項などを入力(任意)"
              value={medicalHistory}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMedicalHistory(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/residents")}>
            キャンセル
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "更新中..." : "登録中..."}
              </>
            ) : isEdit ? (
              "更新する"
            ) : (
              "登録する"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
