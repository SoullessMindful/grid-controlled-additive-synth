'use client'
import { createContext, Dispatch, SetStateAction, useState } from 'react'
import SoundEngineContextProvider from './SoundEngineContextProvider'

export type MainAppContextType = {
  noteOffset: number
  setNoteOffset: Dispatch<SetStateAction<number>>
  rowsCount: number
  setRowsCount: Dispatch<SetStateAction<number>>
  columnsCount: number
  setColumnsCount: Dispatch<SetStateAction<number>>
  padSize: number
  setPadSize: Dispatch<SetStateAction<number>>
}

export const MainAppContext = createContext<MainAppContextType | undefined>(
  undefined
)

export default function MainAppContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [noteOffset, setNoteOffset] = useState(45)
  const [rowsCount, setRowsCount] = useState(8)
  const [columnsCount, setColumnsCount] = useState(8)
  const [padSize, setPadSize] = useState(6)

  return (
    <MainAppContext.Provider
      value={{
        noteOffset,
        setNoteOffset,
        rowsCount,
        setRowsCount,
        columnsCount,
        setColumnsCount,
        padSize,
        setPadSize,
      }}
    >
      <SoundEngineContextProvider>{children}</SoundEngineContextProvider>
    </MainAppContext.Provider>
  )
}
