"use client"
import React, { createContext, useContext } from "react"
import { useAuthLogic } from "@/hooks/useAuthLogic"

const AuthContext = createContext<ReturnType<typeof useAuthLogic> | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthLogic()
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
