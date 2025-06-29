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
import { availableOctaves, displayOctave } from '@/lib/octave'
import { CheckButton } from '../CheckButton'

export default function SynthMenuGlobalTab() {
  const {
    volume,
    setVolume,
    highpassFrequency,
    setHighpassFrequency,
    lowpassFrequency,
    setLowpassFrequency,
    octave,
    setOctave,
    voices,
    setVoices,
  } = useContext(SoundEngineContext) as SoundEngineContextType

  return (
    <div className='px-1 py-1 flex flex-col items-center justify-center'>
      <div className='mb-2 px-1'>
        <div className='mb-0.5 w-full'>Voices</div>
        <div className='h-30 p-1 bg-gray-200 dark:bg-gray-800 rounded-2xl'>
          {voices.map((voice, i) => (
            <div
              key={`voice ${i}`}
              className='mb-1 w-full'
            >
              <div className='grid grid-cols-[3rem,5rem,15rem,5rem,15rem,auto] grid-rows-2 gap-0.5 items-center'>
                <div className='row-span-2'>
                  <label>
                    <CheckButton
                      value={voice.active}
                      onChange={(newActive) => {
                        const newVoices = [...voices]
                        const newVoice = { ...newVoices[i] }

                        newVoice.active = newActive
                        newVoices[i] = newVoice
                        setVoices(newVoices)
                      }}
                    />
                  </label>
                </div>
                <div>
                  <label>Level</label>
                </div>
                <div>
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
                    className='w-15 h-2 thumb-w-1 thumb-r-1'
                  />
                </div>
                <div className='col-start-2 row-start-2'>
                  <label>Pan</label>
                </div>
                <div className='col-start-3 row-start-2'>
                  <HorizontalSlider
                    value={voice.pan}
                    onChange={(newPan) => {
                      const newVoices = [...voices]
                      const newVoice = { ...newVoices[i] }

                      newVoice.pan = newPan
                      newVoices[i] = newVoice
                      setVoices(newVoices)
                    }}
                    min={-1}
                    max={1}
                    trackCenter={0}
                    step={0.05}
                    className='w-15 h-2 thumb-w-1 thumb-r-1'
                  />
                </div>
                <div className='col-start-4 row-start-1'>
                  <label>Detune</label>
                </div>
                <div className='col-start-5 row-start-1'>
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
                    trackCenter={0}
                    step={1}
                    className='w-15 h-2 thumb-w-1 thumb-r-1'
                  />
                </div>
                <div className='col-start-4 row-start-2'>
                  <label>Delay</label>
                </div>
                <div className='col-start-5 row-start-2'>
                  <HorizontalSlider
                    value={voice.delay}
                    onChange={(newDelay) => {
                      const newVoices = [...voices]
                      const newVoice = { ...newVoices[i] }

                      newVoice.delay = newDelay
                      newVoices[i] = newVoice
                      setVoices(newVoices)
                    }}
                    min={0}
                    max={0.02}
                    step={0.0001}
                    className='w-15 h-2 thumb-w-1 thumb-r-1'
                  />
                </div>
                <div className='row-span-2 col-start-6 row-start-1'>
                  <div className='size-1.5'>
                    {i !== 0 && (
                      <TrashIcon
                        className='size-1.5 inline cursor-pointer'
                        onClick={() =>
                          setVoices(voices.filter((_, ii) => i !== ii))
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
              <span>
                <div>
                  <span className='mr-1'></span>
                  <span className='mr-1'></span>
                </div>
              </span>
              <span className='min-w-2'></span>
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
        <label>Octave </label>
        <select
          value={displayOctave(octave)}
          onChange={(e) => {
            const selected = availableOctaves.find(
              (oct) => oct === parseInt(e.target.value)
            )
            fetch('/LOG/OCTAVE/'+e.target.value+'/'+selected)
            if (selected !== undefined) setOctave(selected)
          }}
          className='w-12 h-2.5 px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
        >
          {availableOctaves.map((oct) => (
            <option
              key={displayOctave(oct)}
              value={displayOctave(oct)}
            >
              {displayOctave(oct)}
            </option>
          ))}
        </select>
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
            trackCenterExp={20000}
            className='w-15 h-2 thumb-w-1 thumb-r-1'
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
            className='w-15 h-2 thumb-w-1 thumb-r-1'
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
            className='w-15 h-2 thumb-w-1 thumb-r-1'
          />
        </div>
      </div>
    </div>
  )
}
