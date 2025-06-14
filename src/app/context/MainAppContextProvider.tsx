'use client'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import {
  availableScales,
  chromaticScale,
  RootNote,
  Scale,
} from '../../lib/scale'
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
  highlightRootNote: boolean
  setHighlightRootNote: Dispatch<SetStateAction<boolean>>
  displayNoteLetter: boolean
  setDisplayNoteLetter: Dispatch<SetStateAction<boolean>>
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
  const [highlightRootNote, setHighlightRootNote] = useState(false)
  const [displayNoteLetter, setDisplayNoteLetter] = useState(false)

  useEffect(() => {
    const storedSettingsString = localStorage.getItem('gridSettings')
    console.log(storedSettingsString)
    if (storedSettingsString === null) return

    const storedSettings = JSON.parse(storedSettingsString)
    console.log(storedSettings)

    const {
      noteOffset: storedNoteOffset,
      rowsCount: storedRowsCount,
      columnsCount: storedColumnsCount,
      padSize: storedPadSize,
      scaleName: storedScaleName,
      scaleRoot: storedScaleRoot,
      lockToScale: storedLockToScale,
      highlightRootNote: storedHighlightRootNote,
      displayNoteLetter: storedDisplayNoteLetter,
    } = storedSettings

    if (storedNoteOffset !== undefined) setNoteOffset(storedNoteOffset)
    if (storedRowsCount !== undefined) setRowsCount(storedRowsCount)
    if (storedColumnsCount !== undefined) setColumnsCount(storedColumnsCount)
    if (storedPadSize !== undefined) setPadSize(storedPadSize)
    if (storedScaleName !== undefined)
      setScale(
        availableScales.find((s) => s.name === storedScaleName) ??
          chromaticScale
      )
    if (storedScaleRoot !== undefined) setScaleRoot(storedScaleRoot)
    if (storedLockToScale !== undefined) setLockToScale(storedLockToScale)
    if (storedHighlightRootNote !== undefined)
      setHighlightRootNote(storedHighlightRootNote)
    if (storedDisplayNoteLetter !== undefined)
      setDisplayNoteLetter(storedDisplayNoteLetter)
  }, [])

  useEffect(() => {
    const gridSettings = {
      noteOffset,
      rowsCount,
      columnsCount,
      padSize,
      scaleName: scale.name,
      scaleRoot,
      lockToScale,
      highlightRootNote,
      displayNoteLetter,
    }

    localStorage.setItem('gridSettings', JSON.stringify(gridSettings))
  }, [
    noteOffset,
    rowsCount,
    columnsCount,
    padSize,
    scale,
    scaleRoot,
    lockToScale,
    highlightRootNote,
    displayNoteLetter,
  ])

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
        highlightRootNote,
        setHighlightRootNote,
        displayNoteLetter,
        setDisplayNoteLetter,
      }}
    >
      <SoundEngineContextProvider>{children}</SoundEngineContextProvider>
    </MainAppContext.Provider>
  )
}
