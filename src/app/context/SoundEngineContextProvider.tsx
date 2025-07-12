'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { MainAppContext, MainAppContextType } from './MainAppContextProvider'
import { range2d } from '@/lib/range'
import {
  basicWaveforms,
  customWaveforms,
  ProcessedWaveform,
} from '@/lib/waveform'
import {
  defaultOvertoneEnvelope,
  defaultOvertoneEnvelopes,
  Envelope,
  envelopePhase,
} from '@/lib/envelope'
import {
  defaultFilterParameters,
  FilterParameters,
} from '@/lib/filterParameters'
import { SynthSettingsPreset } from '@/lib/synthSettingsPreset'
import { defaultVoices, Voice, voicePhase } from '@/lib/voice'
import { createMixNode, MixNode } from '@/lib/audionodes/MixNode'
import { defaultOctave, Octave } from '@/lib/octave'
import {
  createEffectChainNode,
  EffectChainNode,
  EffectNodeSettings,
  EffectNodeType,
} from '@/lib/audionodes/EffectChainNode'
import {
  createFilteredNoiseNode,
  FilteredNoiseNode,
} from '@/lib/audionodes/FilteredNoiseNode'

let ctx: AudioContext | undefined = undefined
let globalLimiterNode: DynamicsCompressorNode | undefined = undefined
let globalMeterNode: AnalyserNode | undefined = undefined
let globalHighpassNode: BiquadFilterNode | undefined = undefined
let globalLowpassNode: BiquadFilterNode | undefined = undefined
let globalGainNode: GainNode | undefined = undefined
let effectChain: EffectChainNode | undefined = undefined

export type SoundEngineContextType = {
  padNoteOn: (row: number, column: number) => void
  padNoteOff: (row: number, column: number) => void
  mouseNoteOn: (row: number, column: number) => void
  mouseNoteOff: () => void
  volume: number
  setVolume: (volume: number) => void
  highpassFrequency: number
  setHighpassFrequency: (volume: number) => void
  lowpassFrequency: number
  setLowpassFrequency: (volume: number) => void
  effectSettings: EffectNodeSettings[]
  setEffectSettings: (newSettings: EffectNodeSettings, i: number) => void
  addEffect: (effectType: EffectNodeType, i?: number) => void
  removeEffect: (i: number) => void
  changeEffect: (effectType: EffectNodeType, i: number) => void
  switchEffects: (i1: number, i2: number) => void
  setEffectActive: (active: boolean, i: number) => void
  octave: Octave
  setOctave: React.Dispatch<React.SetStateAction<Octave>>
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
  filterParameters: FilterParameters
  voices: Voice[]
  setVoices: React.Dispatch<React.SetStateAction<Voice[]>>
  setFilterParameters: React.Dispatch<React.SetStateAction<FilterParameters>>
  setSynthSettings: (synthSettings: SynthSettingsPreset) => void
  meter: number
}

export const SoundEngineContext = createContext<
  SoundEngineContextType | undefined
>(undefined)

type OvertoneOsc = {
  overtoneIndex: number
  osc: OscillatorNode | FilteredNoiseNode
  gain: GainNode
  flipGain: GainNode
}

type VoiceNode = {
  overtones: OvertoneOsc[]
  delayNode: DelayNode
  panNode: StereoPannerNode
  mainGainNode: GainNode
  filterNode?: BiquadFilterNode
  filterMixNode?: MixNode
}

type NoteNode = {
  note: number
  voiceNodes?: VoiceNode[]
}

export default function SoundEngineContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { noteOffset, rowsCount, columnsCount } = useContext(
    MainAppContext
  ) as MainAppContextType

  const [availableWaveforms, setAvailableWaveforms] =
    useState<ProcessedWaveform[]>(basicWaveforms)

  const [padNodes, setPadNodes] = useState<NoteNode[][]>([])
  const [mouseNode, setMouseNode] = useState<NoteNode | undefined>(undefined)

  // Synth settings begin
  const [volume, setVolume] = useState(0.5)
  const [highpassFrequency, setHighpassFrequency] = useState(20)
  const [lowpassFrequency, setLowpassFrequency] = useState(20000)
  const [octave, setOctave] = useState(defaultOctave)
  const [effectSettings, setEffectSettings] = useState<EffectNodeSettings[]>([])
  const updateEffectSettings = () => {
    if (effectChain) {
      setEffectSettings(effectChain.settings)
    }
  }
  const [level, setLevel] = useState(0.5)
  const [attack, setAttack] = useState(0.01)
  const [decay, setDecay] = useState(0.1)
  const [sustain, setSustain] = useState(0.5)
  const [release, setRelease] = useState(0.01)

  const [filterParameters, setFilterParameters] = useState<FilterParameters>(
    defaultFilterParameters
  )

  const [waveform, setWaveform] = useState<ProcessedWaveform>(basicWaveforms[0])

  const [overtonesCount, setOvertonesCount] = useState(16)
  const [overtoneEnvelopes, setOvertoneEnvelopes] = useState<Envelope[]>(
    defaultOvertoneEnvelopes(overtonesCount)
  )
  const [voices, setVoices] = useState<Voice[]>(defaultVoices)

  const [meter, setMeter] = useState(-Infinity)

  const setSynthSettings = (preset: SynthSettingsPreset) => {
    setVolume(preset.volume)
    setHighpassFrequency(preset.highpassFilterFrequency)
    setLowpassFrequency(preset.lowpassFilterFrequency)
    setOctave(preset.octave)
    setVoices(preset.voices)
    setLevel(preset.globalEnvelope.level)
    setAttack(preset.globalEnvelope.attack)
    setDecay(preset.globalEnvelope.decay)
    setSustain(preset.globalEnvelope.sustain)
    setRelease(preset.globalEnvelope.release)
    const foundWaveform =
      availableWaveforms.find((wf) => wf.name === preset.waveformName) ??
      availableWaveforms[0]
    setWaveform(
      preset.waveformQ && foundWaveform.__type__ === 'NoiseWaveform'
        ? {
            ...foundWaveform,
            Q: preset.waveformQ,
          }
        : foundWaveform
    )
    setOvertonesCount(preset.overtoneEnvelopes.length)
    setOvertoneEnvelopes(preset.overtoneEnvelopes)
    setFilterParameters(preset.filterParameters)
  }
  // Synth settings end

  useEffect(() => {
    if (!ctx) {
      ctx = new AudioContext({
        latencyHint: 'interactive',
      })
    }

    const now = ctx.currentTime

    if (!globalLimiterNode) {
      globalLimiterNode = ctx.createDynamicsCompressor()
      globalLimiterNode.knee.setValueAtTime(0, now)
      globalLimiterNode.threshold.setValueAtTime(-3, now)
      globalLimiterNode.attack.setValueAtTime(0.01, now)
      globalLimiterNode.release.setValueAtTime(0.05, now)
      globalLimiterNode.ratio.setValueAtTime(20, now)
      globalLimiterNode.connect(ctx.destination)
    }

    if (!globalMeterNode) {
      globalMeterNode = ctx.createAnalyser()
      globalMeterNode.fftSize = 4096
      const meterInterval = (1000 * globalMeterNode.fftSize) / ctx.sampleRate

      setInterval(() => {
        if (!globalMeterNode) return

        const ftdd = new Float32Array(globalMeterNode.frequencyBinCount)
        globalMeterNode.getFloatTimeDomainData(ftdd)
        const absMax = ftdd
          .map((v) => Math.abs(v))
          .reduce((max, v) => (max >= v ? max : v))
        const db = absMax > 0 ? 20 * Math.log10(absMax) : -Infinity
        setMeter(db)
      }, meterInterval)
    }

    if (!globalHighpassNode) {
      globalHighpassNode = ctx.createBiquadFilter()
      globalHighpassNode.type = 'highpass'
      globalHighpassNode.Q.setValueAtTime(1.4, now)
      globalHighpassNode.frequency.setValueAtTime(20, now)
      globalHighpassNode.connect(globalLimiterNode)
      globalHighpassNode.connect(globalMeterNode)
    }

    if (!globalLowpassNode) {
      globalLowpassNode = ctx.createBiquadFilter()
      globalLowpassNode.type = 'lowpass'
      globalLowpassNode.Q.setValueAtTime(1.4, now)
      globalLowpassNode.frequency.setValueAtTime(20000, now)
      globalLowpassNode.connect(globalHighpassNode)
    }

    if (!effectChain) {
      effectChain = createEffectChainNode(ctx)
      effectChain.connect(globalLowpassNode)
    }

    if (!globalGainNode) {
      globalGainNode = ctx.createGain()
      globalGainNode.gain.setValueAtTime(volume, ctx.currentTime)
      globalGainNode.connect(effectChain.input)
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
    if (!ctx || !globalHighpassNode) return

    globalHighpassNode.frequency.setValueAtTime(
      highpassFrequency,
      ctx.currentTime
    )
  }, [highpassFrequency])

  useEffect(() => {
    if (!ctx || !globalLowpassNode) return

    globalLowpassNode.frequency.setValueAtTime(
      lowpassFrequency,
      ctx.currentTime
    )
  }, [lowpassFrequency])

  useEffect(() => {
    if (!ctx || !globalGainNode) return

    globalGainNode.gain.setValueAtTime(volume, ctx.currentTime)
  }, [volume])

  useEffect(() => {
    // Cleanup old padNodes
    padNodes.forEach((row) =>
      row.forEach((padNode) => {
        if (padNode.voiceNodes) {
          padNode.voiceNodes.forEach((v) => {
            v.overtones.forEach(({ osc, gain }) => {
              try {
                osc.stop()
              } catch {}
              osc.disconnect()
              gain.disconnect()
            })

            v.delayNode.disconnect()

            v.panNode.disconnect()

            v.mainGainNode.disconnect()

            v.filterNode?.disconnect()
          })
          padNode.voiceNodes = undefined
        }
      })
    )

    // Create new padNodes
    if (
      rowsCount !== undefined &&
      columnsCount !== undefined &&
      noteOffset !== undefined
    ) {
      setPadNodes(
        range2d([0, rowsCount], [0, columnsCount]).map((arr) =>
          arr.map(([row, column]) => ({ note: noteOffset + row * 5 + column }))
        )
      )
    } else {
      setPadNodes([])
    }
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
            .map(() => defaultOvertoneEnvelope),
        ]
      } else {
        return prev
      }
    })
  }, [overtonesCount])

  const noteOn = (noteNode: NoteNode) => {
    if (!ctx || !globalGainNode) return

    const currentCtx = ctx
    const currentGlobalGainNode = globalGainNode

    const scheduler: ((now: number) => void)[] = []
    noteOff(noteNode)

    const voiceNodes: VoiceNode[] = voices
      .filter(({ active }) => active)
      .map((voice) => {
        const panNode = currentCtx.createStereoPanner()
        const delayNode = currentCtx.createDelay()
        const mainGainNode = currentCtx.createGain()

        scheduler.push((now) => {
          panNode.pan.setValueAtTime(voice.pan, now)
          panNode.connect(currentGlobalGainNode)

          delayNode.delayTime.setValueAtTime(voice.delay, now)
          delayNode.connect(panNode)

          mainGainNode.gain.cancelScheduledValues(now)
          mainGainNode.gain.setValueAtTime(0.001, now)
          mainGainNode.gain.exponentialRampToValueAtTime(
            level || 0.001,
            now + attack
          )
          mainGainNode.gain.exponentialRampToValueAtTime(
            level * sustain || 0.001,
            now + attack + decay
          )
        })

        let filterNode: BiquadFilterNode | undefined = undefined
        let filterMixNode: MixNode | undefined = undefined

        if (filterParameters.type === undefined) {
          mainGainNode.connect(delayNode)
        } else {
          filterMixNode = createMixNode(currentCtx)
          filterNode = currentCtx.createBiquadFilter()
          filterNode.type = filterParameters.type

          scheduler.push((now) => {
            if (!filterMixNode || !filterNode) return

            filterMixNode.mix.setValueAtTime(filterParameters.mix.value, now)
            if (filterParameters.mix.modulation !== undefined) {
              const mod = filterParameters.mix.modulation
              filterMixNode.mix.exponentialRampToValueAtTime(
                mod.level || 0.001,
                now + mod.attack
              )
              filterMixNode.mix.exponentialRampToValueAtTime(
                mod.sustain || 0.001,
                now + mod.attack + mod.decay
              )
            }

            filterNode.Q.cancelScheduledValues(now)
            filterNode.Q.setValueAtTime(filterParameters.Q.value, now)
            if (filterParameters.Q.modulation !== undefined) {
              const mod = filterParameters.Q.modulation
              filterNode.Q.exponentialRampToValueAtTime(
                mod.level || 0.001,
                now + mod.attack
              )
              filterNode.Q.exponentialRampToValueAtTime(
                mod.sustain || 0.001,
                now + mod.attack + mod.decay
              )
            }
            filterNode.frequency.setValueAtTime(
              filterParameters.frequency.value,
              now
            )
            if (filterParameters.frequency.modulation !== undefined) {
              const mod = filterParameters.frequency.modulation
              filterNode.frequency.exponentialRampToValueAtTime(
                mod.level || 0.001,
                now + mod.attack
              )
              filterNode.frequency.exponentialRampToValueAtTime(
                mod.sustain || 0.001,
                now + mod.attack + mod.decay
              )
            }
          })

          filterMixNode.connect(delayNode)
          filterNode.connect(filterMixNode.wet)
          mainGainNode.connect(filterNode)
          mainGainNode.connect(filterMixNode.dry)
        }

        const overtones = overtoneEnvelopes
          .map((env, i) => ({ env, i }))
          .filter(({ env }) => env.level !== 0)
          .map(({ env, i }) => {
            let osc
            const overtoneIndex = i + 1 // 1st harmonic is fundamental
            const freq =
              440 *
              Math.pow(2, (noteNode.note - 69) / 12) *
              overtoneIndex *
              2 ** octave
            switch (waveform.__type__) {
              case 'BasicWaveform':
                osc = currentCtx.createOscillator()
                osc.type = waveform.waveform
                break
              case 'CustomWaveform':
                osc = currentCtx.createOscillator()
                osc.setPeriodicWave(waveform.waveform)
                break
              case 'NoiseWaveform':
                osc = createFilteredNoiseNode(currentCtx, waveform.noiseType)
                osc.Q.value = waveform.Q
                osc.gain.value = 3 * Math.pow(waveform.Q, 0.6)
            }

            const gain = currentCtx.createGain()
            const flipGain = currentCtx.createGain()

            scheduler.push((now) => {
              osc.frequency.setValueAtTime(freq, now)
              osc.detune.setValueAtTime(voice.detune, now)

              gain.gain.cancelScheduledValues(now)
              gain.gain.setValueAtTime(0.001, now)
              gain.gain.exponentialRampToValueAtTime(
                env.level || 0.001,
                now + env.attack
              )
              gain.gain.exponentialRampToValueAtTime(
                env.level * env.sustain || 0.001,
                now + env.attack + env.decay
              )

              flipGain.gain.setValueAtTime(
                voice.level * envelopePhase(env) * voicePhase(voice),
                now
              )

              osc.start(now)
            })

            osc.connect(gain)
            gain.connect(flipGain)
            flipGain.connect(mainGainNode)

            return { osc, gain, flipGain, overtoneIndex }
          })

        return {
          overtones,
          panNode,
          delayNode,
          filterNode,
          mainGainNode,
        }
      })

    const now = currentCtx.currentTime
    scheduler.forEach((cb) => cb(now))
    noteNode.voiceNodes = voiceNodes
  }

  const noteOff = (noteNode: NoteNode) => {
    if (!ctx || !globalGainNode) return

    if (!noteNode.voiceNodes) return

    const now = ctx.currentTime
    const releaseEnd = now + release

    noteNode.voiceNodes.forEach(
      ({
        overtones,
        panNode,
        delayNode,
        mainGainNode,
        filterNode,
        filterMixNode,
      }) => {
        overtones.forEach(({ osc, gain, flipGain, overtoneIndex }) => {
          const env = overtoneEnvelopes[overtoneIndex - 1]
          const overtoneReleaseEnd = env ? now + env.release : releaseEnd

          gain.gain.cancelScheduledValues(now)
          gain.gain.setValueAtTime(gain.gain.value, now)
          gain.gain.exponentialRampToValueAtTime(0.001, overtoneReleaseEnd)

          osc.stop(releaseEnd)
          osc.onended = () => {
            osc.disconnect()
            gain.disconnect()
            flipGain.disconnect()
          }
        })

        mainGainNode.gain.cancelScheduledValues(now)
        mainGainNode.gain.setValueAtTime(mainGainNode.gain.value, now)
        mainGainNode.gain.exponentialRampToValueAtTime(0.001, releaseEnd)

        const cleanupDelay = (release + delayNode.delayTime.value) * 1000 + 100

        setTimeout(() => {
          mainGainNode.disconnect()
          delayNode.disconnect()
          panNode.disconnect()
          filterNode?.disconnect()
          filterMixNode?.disconnect()
        }, cleanupDelay)
      }
    )

    noteNode.voiceNodes = undefined
  }

  return (
    <SoundEngineContext.Provider
      value={{
        padNoteOn: (row, column) => noteOn(padNodes[row][column]),
        padNoteOff: (row, column) => noteOff(padNodes[row][column]),
        mouseNoteOn: (row, column) => {
          if (noteOffset === undefined) return

          const newMouseNode = {
            ...mouseNode,
            note: noteOffset + row * 5 + column,
          }
          noteOn(newMouseNode)
          setMouseNode(newMouseNode)
        },
        mouseNoteOff: () => {
          if (mouseNode) {
            noteOff(mouseNode)
            setMouseNode(undefined)
          }
        },
        volume,
        setVolume,
        highpassFrequency,
        setHighpassFrequency,
        lowpassFrequency,
        setLowpassFrequency,
        octave,
        setOctave,
        effectSettings,
        setEffectSettings: (newSettings, i) => {
          effectChain?.setSettings(newSettings, i)
          updateEffectSettings()
        },
        addEffect: (effectType, i) => {
          effectChain?.addEffect(effectType, i)
          updateEffectSettings()
        },
        removeEffect: (i) => {
          effectChain?.removeEffect(i)
          updateEffectSettings()
        },
        changeEffect: (effectType, i) => {
          effectChain?.changeEffect(effectType, i)
          updateEffectSettings()
        },
        switchEffects: (i1, i2) => {
          effectChain?.switchEffects(i1, i2)
          updateEffectSettings()
        },
        setEffectActive: (active, i) => {
          effectChain?.setEffectActive(active, i)
          updateEffectSettings()
        },
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
        voices,
        setVoices,
        filterParameters,
        setFilterParameters,
        setSynthSettings,
        meter,
      }}
    >
      {children}
    </SoundEngineContext.Provider>
  )
}
