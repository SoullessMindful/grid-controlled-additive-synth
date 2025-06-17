'use client'

import { useContext } from 'react'
import {
  SoundEngineContext,
  SoundEngineContextType,
} from '@/app/context/SoundEngineContextProvider'
import HorizontalSlider from '../HorizontalSlider'

export default function SynthMenuGlobalTab() {
  const { volume, setVolume, highpassFrequency, setHighpassFrequency, lowpassFrequency, setLowpassFrequency } = useContext(
    SoundEngineContext
  ) as SoundEngineContextType

  return (
    <div className='px-1 py-1 flex flex-col items-center justify-center'>
      <div className='mb-2'>
        <label className='block mb-0.5'>Highpass: {highpassFrequency}Hz</label>
        <div>
          <HorizontalSlider
            value={highpassFrequency}
            onChange={(v) => {
              if (v > 20000 || v > lowpassFrequency) return
                
              setHighpassFrequency(Math.round(v))
            }}
            exponential
            minExp={20}
            maxExp={20000}
          />
        </div>
        <label className='block mb-0.5'>Lowpass: {lowpassFrequency}Hz</label>
        <div>
          <HorizontalSlider
            value={lowpassFrequency}
            onChange={(v) => {
              if (v < 20 || v < highpassFrequency) return
                
              setLowpassFrequency(Math.round(v))
            }}
            exponential
            minExp={20}
            maxExp={20000}
          />
        </div>
      </div>
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
