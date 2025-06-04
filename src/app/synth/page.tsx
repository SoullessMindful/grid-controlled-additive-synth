'use client'

import { useContext, useState } from 'react'
import { HorizontalSlider } from '../ui/Slider'
import {
  SoundEngineContext,
  SoundEngineContextType,
} from '../context/SoundEngineContextProvider'

export default function SynthPage() {
  const { volume, setVolume } = useContext(
    SoundEngineContext
  ) as SoundEngineContextType

  return (
    <div className='flex flex-col justify-center items-stretch w-full h-full'>
      <div className='flex-1 m-1 bg-gray-100 dark:bg-gray-900 rounded-md flex flex-col items-center justify-center'>
        <div>
          <div>Volume</div>
          <div>
            <input
              type='range'
              value={volume}
              min={0}
              max={1}
              step={0.01}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
