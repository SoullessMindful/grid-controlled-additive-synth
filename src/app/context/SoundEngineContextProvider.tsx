'use client'

import { createContext, use, useContext, useEffect, useState } from 'react'
import { MainAppContext, MainAppContextType } from './MainAppContextProvider'
import { range2d } from '@/lib/range'

let ctx: AudioContext | undefined = undefined

export type SoundEngineContextType = {
  noteOn: (row: number, column: number) => void
  noteOff: (row: number, column: number) => void
  noteOnOff: (on: boolean, row: number, column: number) => void
}

export const SoundEngineContext = createContext<
  SoundEngineContextType | undefined
>(undefined)
export default function SoundEngineContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { noteOffset, rowsCount, columnsCount } = useContext(
    MainAppContext
  ) as MainAppContextType

  const [padNodes, setPadNodes] = useState<PadNode[][]>(
    range2d([0, rowsCount], [0, columnsCount]).map((arr) =>
      arr.map(([row, column]) => ({ note: noteOffset + row * 5 + column }))
    )
  )

  useEffect(() => {
    if (!ctx) {
      ctx = new AudioContext({
        latencyHint: 'interactive',
      })
    }
  }, [])

  useEffect(() => {
    setPadNodes(
      range2d([0, rowsCount], [0, columnsCount]).map((arr) =>
        arr.map(([row, column]) => ({ note: noteOffset + row * 5 + column }))
      )
    )
  }, [noteOffset, rowsCount, columnsCount])

  const noteOn = (row: number, column: number) => {
    if (!ctx) return

    const padNode = padNodes[row][column]
    if (!padNode.osc) {
      const osc = ctx.createOscillator()
      osc.frequency.setValueAtTime(
        440 * Math.pow(2, (padNode.note - 69) / 12),
        ctx.currentTime
      )
      osc.connect(ctx.destination)
      osc.start()
      padNode.osc = osc
    }
  }

  const noteOff = (row: number, column: number) => {
    if (!ctx) return

    const padNode = padNodes[row][column]
    if (padNode.osc) {
      padNode.osc.stop()
      padNode.osc.disconnect()
      padNode.osc = undefined
    }
  }

  const noteOnOff = (on: boolean, row: number, column: number) => {
    if (on) {
      return noteOn(row, column)
    } else {
      return noteOff(row, column)
    }
  }

  return (
    <SoundEngineContext.Provider
      value={{
        noteOn,
        noteOff,
        noteOnOff,
      }}
    >
      {children}
    </SoundEngineContext.Provider>
  )
}

type PadNode = {
  note: number
  osc?: OscillatorNode
}
