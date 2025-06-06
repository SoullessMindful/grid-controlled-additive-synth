'use client'
import { createContext, Dispatch, SetStateAction, useState } from 'react'
import { chromaticScale, RootNote, Scale } from '../../lib/scale'
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
  scale: Scale
  setScale: Dispatch<SetStateAction<Scale>>
  scaleRoot: RootNote
  setScaleRoot: Dispatch<SetStateAction<RootNote>>
  lockToScale: boolean
  setLockToScale: Dispatch<SetStateAction<boolean>>
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
  const [scale, setScale] = useState(chromaticScale)
  const [scaleRoot, setScaleRoot] = useState<RootNote>(0)
  const [lockToScale, setLockToScale] = useState(false)

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
        scale,
        setScale,
        scaleRoot,
        setScaleRoot,
        lockToScale,
        setLockToScale,
      }}
    >
      <SoundEngineContextProvider>{children}</SoundEngineContextProvider>
    </MainAppContext.Provider>
  )
}
