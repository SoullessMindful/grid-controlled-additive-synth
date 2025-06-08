'use client'

import { useContext } from 'react'
import {
  SoundEngineContext,
  SoundEngineContextType,
} from '@/app/context/SoundEngineContextProvider'
import HorizontalSlider from '../HorizontalSlider'

export default function SynthMenuGlobalTab() {
  const { volume, setVolume } = useContext(
    SoundEngineContext
  ) as SoundEngineContextType

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
