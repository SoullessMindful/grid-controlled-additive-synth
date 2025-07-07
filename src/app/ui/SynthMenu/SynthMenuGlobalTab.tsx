'use client'

import { Fragment, useContext, useState } from 'react'
import {
  SoundEngineContext,
  SoundEngineContextType,
} from '@/app/context/SoundEngineContextProvider'
import HorizontalSlider from '../HorizontalSlider'
import { NoSymbolIcon, PlusIcon } from '@heroicons/react/24/solid'
import { TrashIcon } from '@heroicons/react/24/solid'
import { defaultVoice, MAX_VOICES_COUNT } from '@/lib/voice'
import { availableOctaves, displayOctave } from '@/lib/octave'
import { CheckButton } from '../CheckButton'
import EffectChainControl from './SynthMenuGlobal/EffectChainControl'

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

  const [selectedVoice, setSelectedVoice] = useState(0)

  return (
    <div className='px-1 py-1 flex flex-col items-center justify-center'>
      <div className='mb-2 px-1'>
        <div className='mb-0.5 w-full'>Voices</div>
        <div className='h-20 p-1 flex flex-row justify-start items-start bg-gray-200 dark:bg-gray-800 rounded-2xl'>
          <div className='w-12 h-full pr-0.5 border-r-2 overflow-y-auto border-r-gray-700 dark:border-gray-300'>
            {voices.map((_, i) => (
              <div
                key={`voice ${i}`}
                className={`w-full p-0.5 flex justify-between items-center ${
                  selectedVoice === i ? 'bg-gray-300 dark:bg-gray-700' : ''
                } cursor-pointer`}
                onClick={() => setSelectedVoice(i)}
              >
                {i === 0 ? 'Main Voice' : `Voice ${i}`}
                {i !== 0 && (
                  <TrashIcon
                    className='size-1 cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation()

                      setVoices(voices.filter((_, ii) => i !== ii))

                      if (i < selectedVoice || (i === selectedVoice && i === voices.length - 1)) {
                        setSelectedVoice(selectedVoice - 1)
                      }
                    }}
                  />
                )}
              </div>
            ))}
            {voices.length < MAX_VOICES_COUNT && (
              <div className='text-center'>
                <PlusIcon
                  className='inline size-2.5 p-0.5 cursor-pointer'
                  onClick={() => {
                    setVoices([...voices, defaultVoice])
                    setSelectedVoice(voices.length)
                  }}
                />
              </div>
            )}
          </div>
          <div className='pl-0.5 grid grid-cols-[5rem_15rem] grid-rows-5 items-center gap-0.5'>
            <div>
              <label className='flex flex-row items-center'>
                <CheckButton
                  value={voices[selectedVoice].active}
                  onChange={(newActive) => {
                    const newVoices = [...voices]
                    const newVoice = { ...newVoices[selectedVoice] }

                    newVoice.active = newActive
                    newVoices[selectedVoice] = newVoice
                    setVoices(newVoices)
                  }}
                />
                <span>Active</span>
              </label>
            </div>
            <div
              className='cursor-pointer flex flex-row items-center'
              onClick={() => {
                const newVoices = [...voices]
                const newVoice = { ...newVoices[selectedVoice] }

                newVoice.flipPhase = !newVoice.flipPhase
                newVoices[selectedVoice] = newVoice
                setVoices(newVoices)
              }}
            >
              <NoSymbolIcon
                className={`size-1 inline mx-0.5 ${
                  voices[selectedVoice].flipPhase
                    ? 'stroke-black dark:stroke-white'
                    : 'stroke-gray-400 dark:stroke-gray-600'
                }`}
              />
              <span
                className={`${
                  voices[selectedVoice].flipPhase
                    ? ''
                    : 'text-gray-400 dark:text-gray-600'
                }`}
              >
                Flip Phase
              </span>
            </div>
            <div>
              <label>Level</label>
            </div>
            <div>
              <HorizontalSlider
                value={voices[selectedVoice].level}
                onChange={(newLevel) => {
                  const newVoices = [...voices]
                  const newVoice = { ...newVoices[selectedVoice] }

                  newVoice.level = newLevel
                  newVoices[selectedVoice] = newVoice
                  setVoices(newVoices)
                }}
                min={0}
                max={1}
                step={0.01}
                className='w-15 h-2 thumb-w-1 thumb-r-1'
              />
            </div>
            <div>
              <label>Pan</label>
            </div>
            <div>
              <HorizontalSlider
                value={voices[selectedVoice].pan}
                onChange={(newPan) => {
                  const newVoices = [...voices]
                  const newVoice = { ...newVoices[selectedVoice] }

                  newVoice.pan = newPan
                  newVoices[selectedVoice] = newVoice
                  setVoices(newVoices)
                }}
                min={-1}
                max={1}
                trackCenter={0}
                step={0.05}
                className='w-15 h-2 thumb-w-1 thumb-r-1'
              />
            </div>
            <div>
              <label>Detune</label>
            </div>
            <div>
              <HorizontalSlider
                value={voices[selectedVoice].detune}
                onChange={(newDetune) => {
                  const newVoices = [...voices]
                  const newVoice = { ...newVoices[selectedVoice] }

                  newVoice.detune = newDetune
                  newVoices[selectedVoice] = newVoice
                  setVoices(newVoices)
                }}
                min={-15}
                max={15}
                trackCenter={0}
                step={1}
                className='w-15 h-2 thumb-w-1 thumb-r-1'
              />
            </div>
            <div>
              <label>Delay</label>
            </div>
            <div>
              <HorizontalSlider
                value={voices[selectedVoice].delay}
                onChange={(newDelay) => {
                  const newVoices = [...voices]
                  const newVoice = { ...newVoices[selectedVoice] }

                  newVoice.delay = newDelay
                  newVoices[selectedVoice] = newVoice
                  setVoices(newVoices)
                }}
                min={0}
                max={0.02}
                step={0.0001}
                className='w-15 h-2 thumb-w-1 thumb-r-1'
              />
            </div>
          </div>
        </div>
      </div>
      <EffectChainControl />
      <div className='mb-2'>
        <label>Octave </label>
        <select
          value={displayOctave(octave)}
          onChange={(e) => {
            const selected = availableOctaves.find(
              (oct) => oct === parseInt(e.target.value)
            )

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
