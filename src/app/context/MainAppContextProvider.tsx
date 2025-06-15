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
  rootC,
  RootNote,
  Scale,
} from '../../lib/scale'
import SoundEngineContextProvider from './SoundEngineContextProvider'

export type MainAppContextType = {
  noteOffset?: number
  setNoteOffset: (v: number) => void
  rowsCount?: number
  setRowsCount: (v: number) => void
  columnsCount?: number
  setColumnsCount: (v: number) => void
  padSize?: number
  setPadSize: (v: number) => void
  scale?: Scale
  setScale: (v: Scale) => void
  scaleRoot?: RootNote
  setScaleRoot: (v: RootNote) => void
  lockToScale?: boolean
  setLockToScale: (v: boolean) => void
  highlightRootNote?: boolean
  setHighlightRootNote: (v: boolean) => void
  displayNoteLetter?: boolean
  setDisplayNoteLetter: (v: boolean) => void
}

const DEFAULT_SETTINGS = {
  noteOffset: 45,
  rowsCount: 8,
  columnsCount: 8,
  padSize: 6,
  scaleName: 'chromatic',
  scaleRoot: rootC,
  lockToScale: false,
  highlightRootNote: false,
  displayNoteLetter: false,
} as const

export const MainAppContext = createContext<MainAppContextType | undefined>(
  undefined
)

export default function MainAppContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [noteOffset, setNoteOffset] = useState<number | undefined>(undefined)
  const [rowsCount, setRowsCount] = useState(8)
  const [columnsCount, setColumnsCount] = useState(8)
  const [padSize, setPadSize] = useState(6)
  const [scale, setScale] = useState(chromaticScale)
  const [scaleRoot, setScaleRoot] = useState<RootNote>(0)
  const [lockToScale, setLockToScale] = useState(false)
  const [highlightRootNote, setHighlightRootNote] = useState(false)
  const [displayNoteLetter, setDisplayNoteLetter] = useState(false)

  useEffect(() => {
    const settings = { ...DEFAULT_SETTINGS }

    const storedSettingsString = localStorage.getItem('gridSettings')

    if (storedSettingsString) {
      try {
        const storedSettings = JSON.parse(storedSettingsString)
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

        if (storedNoteOffset !== undefined)
          settings.noteOffset = storedNoteOffset
        if (storedRowsCount !== undefined) settings.rowsCount = storedRowsCount
        if (storedColumnsCount !== undefined)
          settings.columnsCount = storedColumnsCount
        if (storedPadSize !== undefined) settings.padSize = storedPadSize
        if (storedScaleName !== undefined) settings.scaleName = storedScaleName
        if (storedScaleRoot !== undefined) settings.scaleRoot = storedScaleRoot
        if (storedLockToScale !== undefined)
          settings.lockToScale = storedLockToScale
        if (storedHighlightRootNote !== undefined)
          settings.highlightRootNote = storedHighlightRootNote
        if (storedDisplayNoteLetter !== undefined)
          settings.displayNoteLetter = storedDisplayNoteLetter
      } catch {}
    }

    setNoteOffset(settings.noteOffset)
    setRowsCount(settings.rowsCount)
    setColumnsCount(settings.columnsCount)
    setPadSize(settings.padSize)
    setScale(
      availableScales.find((s) => s.name === settings.scaleName) ??
        chromaticScale
    )
    setScaleRoot(settings.scaleRoot)
    setLockToScale(settings.lockToScale)
    setHighlightRootNote(settings.highlightRootNote)
    setDisplayNoteLetter(settings.displayNoteLetter)
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
