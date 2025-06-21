'use client'

import { useContext } from 'react'
import {
  SoundEngineContext,
  SoundEngineContextType,
} from '@/app/context/SoundEngineContextProvider'
import HorizontalSlider from '../HorizontalSlider'
import { PlusIcon, StopIcon as StopIconSolid } from '@heroicons/react/24/solid'
import { StopIcon as StopIconOutline } from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/solid'
import { defaultVoice } from '@/lib/voice'

export default function SynthMenuGlobalTab() {
  const {
    volume,
    setVolume,
    highpassFrequency,
    setHighpassFrequency,
    lowpassFrequency,
    setLowpassFrequency,
    voices,
    setVoices,
  } = useContext(SoundEngineContext) as SoundEngineContextType

  return (
    <div className='px-1 py-1 flex flex-col items-center justify-center'>
      <div className='mb-2 px-1'>
        <div className='mb-0.5 w-full'>Voices</div>
        <div className='h-15 p-1 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl'>
          {voices.map((voice, i) => (
            <div
              key={`voice ${i}`}
              className='mb-1 w-full'
            >
              <label className='mr-1'>
                <input
                  type='checkbox'
                  checked={voice.active}
                  onChange={(e) => {
                    const newVoices = [...voices]
                    const newVoice = { ...newVoices[i] }

                    newVoice.active = e.target.checked
                    newVoices[i] = newVoice
                    setVoices(newVoices)
                  }}
                  className='appearance-none'
                />
                {voice.active ? (
                  <StopIconOutline className='size-1 inline mr-0.5 fill-blue-500' />
                ) : (
                  <StopIconSolid className='size-1 inline mr-0.5' />
                )}
              </label>
              <span className='mr-1'>
                <label className='mr-0.5'>Level</label>
                <HorizontalSlider
                  value={voice.level}
                  onChange={(newLevel) => {
                    const newVoices = [...voices]
                    const newVoice = { ...newVoices[i] }

                    newVoice.level = newLevel
                    newVoices[i] = newVoice
                    setVoices(newVoices)
                  }}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </span>
              <span className='mr-1'>
                <label className='mr-0.5'>Detune</label>
                <HorizontalSlider
                  value={voice.detune}
                  onChange={(newDetune) => {
                    const newVoices = [...voices]
                    const newVoice = { ...newVoices[i] }

                    newVoice.detune = newDetune
                    newVoices[i] = newVoice
                    setVoices(newVoices)
                  }}
                  min={-15}
                  max={15}
                  step={1}
                />
              </span>
              <span className='min-w-2'>
                {i !== 0 && (
                  <TrashIcon
                    className='size-1 inline cursor-pointer'
                    onClick={() =>
                      setVoices(voices.filter((_, ii) => i !== ii))
                    }
                  />
                )}
              </span>
            </div>
          ))}
          {voices.length < 5 && (
            <div className='w-full text-center'>
              <PlusIcon
                className='inline size-2 cursor-pointer'
                onClick={() => setVoices([...voices, defaultVoice])}
              />
            </div>
          )}
        </div>
      </div>
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
