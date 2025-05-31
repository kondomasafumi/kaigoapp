"use client"
import React, { createContext, useContext, useState } from "react"
import type { Resident } from "@/lib/supabase"

type ResidentContextType = {
  selectedResident: Resident | null
  setSelectedResident: (resident: Resident | null) => void
}

const ResidentContext = createContext<ResidentContextType>({
  selectedResident: null,
  setSelectedResident: () => {},
})

export const ResidentProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null)
  return (
    <ResidentContext.Provider value={{ selectedResident, setSelectedResident }}>
      {children}
    </ResidentContext.Provider>
  )
}

export const useResident = () => useContext(ResidentContext)