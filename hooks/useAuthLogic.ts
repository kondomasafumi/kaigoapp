"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase, type User } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

const convertToEmail = (staffNumber: string) => `${staffNumber}@example.com`

export const useAuthLogic = () => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session }, error } = await supabase.auth.getSession()

            if (error || !session?.user?.id) {
                setUser(null)
                setLoading(false) // ← ここが重要！！
                return
            }

            const { data, error: userError } = await supabase
                .from("users")
                .select("*")
                .eq("id", session.user.id)
                .single()

            setUser(userError ? null : (data as User))
            setLoading(false)
        }

        checkUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const userId = session?.user?.id
            if (!userId) {
                setUser(null)
                setLoading(false) // ここも念のため
                return
            }

            const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()
            setUser(error ? null : (data as User))
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signIn = async (staffNumber: string, password: string) => {
        setLoading(true)
        try {
            const email = convertToEmail(staffNumber)
            console.log("📧 ログイン試行:", email, password) // ← ★追加して確認
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error
            const authUserId = data.user?.id
            if (!authUserId) {
                throw new Error("認証に成功しましたが、ユーザーIDが取得できませんでした。")
            }
            const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", data.user.id).single()
            if (userError) throw new Error("職員情報が見つかりません。")
            setUser(userData as User)
            router.push("/dashboard")
            toast({ title: "ログイン成功", description: "システムにログインしました。" })
            console.log("ログイン成功 - UID:", data.user.id)
            console.log("取得ユーザー:", userData)
        } catch (error: any) {
            toast({
                title: "ログインエラー",
                description: error.message || "認証に失敗しました。",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        router.push("/")
        toast({ title: "ログアウト", description: "ログアウトしました。" })
    }

    const signUp = async (staffNumber: string, password: string) => {
        const email = convertToEmail(staffNumber)
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) return toast({ title: "登録エラー", description: error.message, variant: "destructive" })
        await supabase.from("users").insert({ id: data.user?.id, staff_number: staffNumber, role: "admin" })
        toast({ title: "登録成功", description: `${email} を登録しました。` })
    }

    const isAdmin = user?.role === "admin"
    return { user, loading, signIn, signOut, signUp, isAdmin }
}