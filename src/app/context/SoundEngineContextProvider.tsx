'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { MainAppContext, MainAppContextType } from './MainAppContextProvider'
import { range2d } from '@/lib/range'
import {
  BasicWaveform,
  basicWaveforms,
  customWaveforms,
  ProcessedWaveform,
} from '@/lib/waveform'

let ctx: AudioContext | undefined = undefined
let globalGainNode: GainNode | undefined = undefined

export type SoundEngineContextType = {
  noteOn: (row: number, column: number) => void
  noteOff: (row: number, column: number) => void
  noteOnOff: (on: boolean, row: number, column: number) => void
  volume: number
  setVolume: (volume: number) => void
  attack: number
  setAttack: (attack: number) => void
  decay: number
  setDecay: (decay: number) => void
  sustain: number
  setSustain: (sustain: number) => void
  release: number
  setRelease: (release: number) => void
  waveform: ProcessedWaveform
  setWaveform: (waveform: ProcessedWaveform) => void
  availableWaveforms: ProcessedWaveform[]
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
  const [volume, setVolume] = useState(0.5)
  const [attack, setAttack] = useState(0.01)
  const [decay, setDecay] = useState(0.1)
  const [sustain, setSustain] = useState(0.5)
  const [release, setRelease] = useState(0.01)

  const [availableWaveforms, setAvailableWaveforms] =
    useState<ProcessedWaveform[]>(basicWaveforms)
  const [waveform, setWaveform] = useState<ProcessedWaveform>(basicWaveforms[0])

  useEffect(() => {
    if (!ctx) {
      ctx = new AudioContext({
        latencyHint: 'interactive',
      })
    }

    if (!globalGainNode) {
      globalGainNode = ctx.createGain()
      globalGainNode.gain.setValueAtTime(volume, ctx.currentTime)
      globalGainNode.connect(ctx.destination)
    }

    const processedCustom = customWaveforms.map(
      (wf) =>
        ({
          __type__: 'CustomWaveform' as const,
          name: wf.name,
          waveform: ctx!.createPeriodicWave(wf.data[0], wf.data[1]),
        } as ProcessedWaveform)
    )
    setAvailableWaveforms([...basicWaveforms, ...processedCustom])
  }, [])

  useEffect(() => {
    if (!ctx || !globalGainNode) return

    globalGainNode.gain.setValueAtTime(volume, ctx.currentTime)
  }, [volume])

  useEffect(() => {
    // Cleanup old padNodes
    padNodes.forEach((row) =>
      row.forEach((padNode) => {
        if (padNode.osc) {
          try {
            padNode.osc.stop()
          } catch {}
          padNode.osc.disconnect()
        }
        if (padNode.mainGain) {
          padNode.mainGain.disconnect()
        }
      })
    )

    // Create new padNodes
    setPadNodes(
      range2d([0, rowsCount], [0, columnsCount]).map((arr) =>
        arr.map(([row, column]) => ({ note: noteOffset + row * 5 + column }))
      )
    )
  }, [noteOffset, rowsCount, columnsCount])

  const noteOn = (row: number, column: number) => {
    if (!ctx || !globalGainNode) return

    // Use a consistent time reference
    const now = ctx.currentTime

    // Ensure previous note is fully stopped
    noteOff(row, column)

    const padNode = padNodes[row][column]

    if (!padNode.mainGain) {
      const mainGain = ctx.createGain()
      mainGain.connect(globalGainNode)
      padNode.mainGain = mainGain
    }

    const mainGain = padNode.mainGain

    // Create oscillator
    const osc = ctx.createOscillator()
    if (waveform.__type__ === 'BasicWaveform') {
      osc.type = waveform.waveform
    } else {
      osc.setPeriodicWave(waveform.waveform)
    }
    osc.frequency.setValueAtTime(
      440 * Math.pow(2, (padNode.note - 69) / 12),
      now
    )

    // Envelope: Attack -> Decay -> Sustain
    mainGain.gain.cancelScheduledValues(now)
    mainGain.gain.setValueAtTime(0, now)
    mainGain.gain.linearRampToValueAtTime(1, now + attack)
    mainGain.gain.linearRampToValueAtTime(sustain, now + attack + decay)

    osc.connect(mainGain)
    mainGain.connect(globalGainNode)
    osc.start(now)
    padNode.osc = osc
  }

  const noteOff = (row: number, column: number) => {
    if (!ctx || !globalGainNode) return

    const padNode = padNodes[row][column]
    const osc = padNode.osc
    if (!osc) return

    const mainGain = padNode.mainGain
    if (!mainGain) return

    const now = ctx.currentTime
    const releaseEnd = now + release

    // Cancel previous gain schedules and ramp from current value
    mainGain.gain.cancelScheduledValues(now)
    mainGain.gain.setValueAtTime(mainGain.gain.value, now)
    mainGain.gain.linearRampToValueAtTime(0, releaseEnd)

    // Stop oscillator after release
    osc.stop(releaseEnd)
    osc.onended = () => {
      osc.disconnect()
      mainGain.disconnect()
    }

    padNode.osc = undefined
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
        volume,
        setVolume,
        attack,
        setAttack,
        decay,
        setDecay,
        sustain,
        setSustain,
        release,
        setRelease,
        waveform,
        setWaveform,
        availableWaveforms,
      }}
    >
      {children}
    </SoundEngineContext.Provider>
  )
}

type PadNode = {
  note: number
  osc?: OscillatorNode
  mainGain?: GainNode
}
