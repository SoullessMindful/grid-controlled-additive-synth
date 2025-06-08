'use client'

import { useContext, useState } from 'react'
import {
  SoundEngineContext,
  SoundEngineContextType,
} from '@/app/context/SoundEngineContextProvider'
import {
  envelopeProperties,
  EnvelopeProperty,
  envelopePropertyToString,
} from '@/lib/envelope'
import VerticalSlider from '../VerticalSlider'
import HorizontalSlider from '../HorizontalSlider'

export default function SynthMenuGlobalControls() {
  const {
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
    overtoneEnvelopes,
    setOvertoneEnvelopes,
    overtonesCount,
    setOvertonesCount,
  } = useContext(SoundEngineContext) as SoundEngineContextType

  const [activeEnvelopeProperty, setActiveEnvelopeProperty] =
    useState<EnvelopeProperty>('level')

  const overtoneOptions = Array.from({ length: 64 }, (_, i) => i + 1)

  return (
    <div className='px-1 py-1 flex flex-col items-center justify-center'>
      <div className='mb-2'>
        <label className='block mb-0.5'>Volume</label>
        <div>
          <HorizontalSlider
            value={volume}
            onChange={setVolume}
            min={0}
            max={1}
            step={0.01}
          />
        </div>
      </div>
    </div>
  )
}
