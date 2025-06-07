'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { MainAppContext, MainAppContextType } from './MainAppContextProvider'
import { range2d } from '@/lib/range'
import {
  BasicWaveform,
  basicWaveforms,
  customWaveforms,
  ProcessedWaveform,
} from '@/lib/waveform'
import { Envelope } from '@/lib/envelope'

let ctx: AudioContext | undefined = undefined
let globalGainNode: GainNode | undefined = undefined

export type SoundEngineContextType = {
  noteOn: (row: number, column: number) => void
  noteOff: (row: number, column: number) => void
  noteOnOff: (on: boolean, row: number, column: number) => void
  volume: number
  setVolume: (volume: number) => void
  level: number
  setLevel: (level: number) => void
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
  overtonesCount: number
  setOvertonesCount: React.Dispatch<React.SetStateAction<number>>
  overtoneEnvelopes: Envelope[]
  setOvertoneEnvelopes: React.Dispatch<React.SetStateAction<Envelope[]>>
}

export const SoundEngineContext = createContext<
  SoundEngineContextType | undefined
>(undefined)

type OvertoneOsc = {
  osc: OscillatorNode
  gain: GainNode
}

type PadNode = {
  note: number
  overtones?: OvertoneOsc[]
  mainGain?: GainNode
}

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
  const [level, setLevel] = useState(0.5)
  const [attack, setAttack] = useState(0.01)
  const [decay, setDecay] = useState(0.1)
  const [sustain, setSustain] = useState(0.5)
  const [release, setRelease] = useState(0.01)

  const [availableWaveforms, setAvailableWaveforms] =
    useState<ProcessedWaveform[]>(basicWaveforms)
  const [waveform, setWaveform] = useState<ProcessedWaveform>(basicWaveforms[0])

  const [overtonesCount, setOvertonesCount] = useState(16)
  const [overtoneEnvelopes, setOvertoneEnvelopes] = useState<Envelope[]>(
    Array(overtonesCount)
      .fill(1)
      .fill(0, 1)
      .map(
        (level) =>
          ({
            level,
          } as Envelope)
      )
  )

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
        // Cleanup all overtones if present
        if (padNode.overtones) {
          padNode.overtones.forEach(({ osc, gain }) => {
            try {
              osc.stop()
            } catch {}
            osc.disconnect()
            gain.disconnect()
          })
          padNode.overtones = undefined
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

  // Update overtoneEnvelopes when overtonesCount changes
  useEffect(() => {
    setOvertoneEnvelopes((prev) => {
      if (overtonesCount < prev.length) {
        // Crop to new size
        return prev.slice(0, overtonesCount)
      } else if (overtonesCount > prev.length) {
        // Add new envelopes with level=0
        return [
          ...prev,
          ...Array(overtonesCount - prev.length)
            .fill(0)
            .map(() => ({ level: 0 } as Envelope)),
        ]
      } else {
        return prev
      }
    })
  }, [overtonesCount])

  const noteOn = (row: number, column: number) => {
    if (!ctx || !globalGainNode) return

    // Use a consistent time reference
    const now = ctx.currentTime
    noteOff(row, column)

    const padNode = padNodes[row][column]

    if (!padNode.mainGain) {
      const mainGain = ctx.createGain()
      mainGain.connect(globalGainNode)
      padNode.mainGain = mainGain
    }
    const mainGain = padNode.mainGain

    // Create one oscillator per overtone with non-zero level
    const overtones: OvertoneOsc[] = overtoneEnvelopes
      .map((env, i) => ({ env, i }))
      .filter(({ env }) => env.level !== 0)
      .map(({ env, i }) => {
        const osc = ctx!.createOscillator()
        const overtoneIndex = i + 1 // 1st harmonic is fundamental
        const freq = 440 * Math.pow(2, (padNode.note - 69) / 12) * overtoneIndex
        if (waveform.__type__ === 'BasicWaveform') {
          osc.type = waveform.waveform
        } else {
          osc.setPeriodicWave(waveform.waveform)
        }
        osc.frequency.setValueAtTime(freq, now)

        const gain = ctx!.createGain()
        gain.gain.setValueAtTime(env.level, now) // Constant level

        osc.connect(gain)
        gain.connect(mainGain)
        osc.start(now)

        return { osc, gain }
      })

    // Apply envelope to mainGain only
    mainGain.gain.cancelScheduledValues(now)
    mainGain.gain.setValueAtTime(0, now)
    mainGain.gain.linearRampToValueAtTime(level, now + attack)
    mainGain.gain.linearRampToValueAtTime(level * sustain, now + attack + decay)

    padNode.overtones = overtones
  }

  const noteOff = (row: number, column: number) => {
    if (!ctx || !globalGainNode) return

    const padNode = padNodes[row][column]
    if (!padNode.overtones) return

    const now = ctx.currentTime
    const releaseEnd = now + release

    padNode.overtones.forEach(({ osc, gain }) => {
      gain.gain.cancelScheduledValues(now)
      gain.gain.setValueAtTime(gain.gain.value, now)
      gain.gain.linearRampToValueAtTime(0, releaseEnd)

      osc.stop(releaseEnd)
      osc.onended = () => {
        osc.disconnect()
        gain.disconnect()
      }
    })

    padNode.overtones = undefined
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
        level,
        setLevel,
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
        overtonesCount,
        setOvertonesCount,
        overtoneEnvelopes,
        setOvertoneEnvelopes,
      }}
    >
      {children}
    </SoundEngineContext.Provider>
  )
}
