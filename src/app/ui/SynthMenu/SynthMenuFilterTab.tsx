'use client'

import { useContext } from 'react'
import {
  SoundEngineContext,
  SoundEngineContextType,
} from '@/app/context/SoundEngineContextProvider'

export default function SynthMenuFilterTab() {
  const { } = useContext(
    SoundEngineContext
  ) as SoundEngineContextType

  return (
    <div className='px-1 py-1 flex flex-col items-center justify-center'>
      <div className='mb-2'>
      </div>
    </div>
  )
}
