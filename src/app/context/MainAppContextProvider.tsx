'use client'
import { createContext, useState } from 'react'

export type MainAppContextType = {
  state: number,
  setState: (value: number) => void,
}

export const MainAppContext = createContext<MainAppContextType | undefined>(
  undefined
)

export default function MainAppContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [state, setState] = useState(0)
  return (
    <MainAppContext.Provider value={{
      state,
      setState,
    }}>{children}</MainAppContext.Provider>
  )
}
