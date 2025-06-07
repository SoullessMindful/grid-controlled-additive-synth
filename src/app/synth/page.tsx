'use client'

import { useContext } from 'react'
import {
  SoundEngineContext,
  SoundEngineContextType,
} from '../context/SoundEngineContextProvider'
import { Envelope } from '@/lib/envelope'
import VerticalSlider from '../ui/VerticalSlider'
import HorizontalSlider from '../ui/HorizontalSlider'

export default function SynthPage() {
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

  // Define allowed overtone counts
  const overtoneOptions = Array.from({ length: 64 }, (_, i) => i + 1)

  return (
    <div className='flex flex-col justify-center items-stretch w-full h-full'>
      <div className='flex-1 m-1 bg-gray-100 dark:bg-gray-900 rounded-md flex flex-col items-center justify-center'>
        <div className='mb-4 text-center w-full flex flex-col items-center px-2'>
          <div className='flex flex-row w-full rounded-t-2xl'>
            <button className='bg-gray-200 dark:bg-gray-800 p-1 rounded-tl cursor-pointer'>
              Level
            </button>
            <button className='bg-gray-100 dark:bg-gray-900 p-1 cursor-pointer'>
              Attack
            </button>
            <button className='bg-gray-100 dark:bg-gray-900 p-1 cursor-pointer'>
              Decay
            </button>
            <button className='bg-gray-100 dark:bg-gray-900 p-1 cursor-pointer'>
              Sustain
            </button>
            <button className='bg-gray-100 dark:bg-gray-900 p-1 cursor-pointer'>
              Release
            </button>
            <div className='flex-1 flex justify-end items-center gap-1'>
              <label className='block p-1'>Overtones</label>
              <button
                type='button'
                className={`px-1 py-0.25 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 cursor-pointer ${
                  overtonesCount <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() =>
                  setOvertonesCount(Math.max(1, overtonesCount - 1))
                }
                aria-label='Decrease overtones'
              >
                –
              </button>
              <select
                value={overtonesCount}
                onChange={(e) => setOvertonesCount(Number(e.target.value))}
                className='px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-center cursor-pointer'
              >
                {overtoneOptions.map((n) => (
                  <option
                    key={n}
                    value={n}
                  >
                    {n}
                  </option>
                ))}
              </select>
              <button
                type='button'
                className={`px-1 py-0.25 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 cursor-pointer ${
                  overtonesCount >= 64 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() =>
                  setOvertonesCount(Math.min(64, overtonesCount + 1))
                }
                aria-label='Increase overtones'
              >
                +
              </button>
            </div>
          </div>
          <div className='overflow-x-auto overflow-y-hidden whitespace-nowrap h-20 px-1 mx-1 w-full bg-gray-200 dark:bg-gray-800 rounded-b-2xl'>
            {overtoneEnvelopes.map((env, i) => (
              <div
                key={i}
                className='w-3 inline-block text-center py-0.5'
              >
                <label className='block text-xs mt-0.5'>{i + 1}</label>
                <div>
                  <VerticalSlider
                    value={env.level}
                    onChange={(newLevel) => {
                      const newOvertoneEnvelopes = [...overtoneEnvelopes]
                      const newOvertoneEnvelope = { ...newOvertoneEnvelopes[i] }

                      newOvertoneEnvelope.level = newLevel
                      newOvertoneEnvelopes[i] = newOvertoneEnvelope

                      setOvertoneEnvelopes(newOvertoneEnvelopes)
                    }}
                    min={0}
                    max={1}
                    step={0.001}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='mb-2'>
          <label>Waveform </label>
          <select
            value={waveform.name}
            onChange={(e) => {
              const selected = availableWaveforms.find(
                (wf) => wf.name === e.target.value
              )
              if (selected) setWaveform(selected)
            }}
            className='w-12 h-2.5 px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
          >
            {availableWaveforms.map((wf) => (
              <option
                key={wf.name}
                value={wf.name}
              >
                {wf.name}
              </option>
            ))}
          </select>
        </div>
        <div className='flex flex-row justify-center items-center w-full mb-2'>
          <div className='w-5 text-center'>
            <label className='block mb-0.5'>
              <div>Level</div>
              <div>{level}</div>
            </label>
            <VerticalSlider
              value={level}
              onChange={setLevel}
              min={0}
              max={1}
              step={0.01}
            />
          </div>
          <div className='w-5 text-center'>
            <label className='block mb-0.5'>
              <div>Attack</div>
              <div>{attack * 1000}ms</div>
            </label>
            <VerticalSlider
              value={attack}
              onChange={(v) => setAttack(Math.round(v * 1000) / 1000)}
              exponential
              minExp={0.001}
              maxExp={10}
            />
          </div>
          <div className='w-5 text-center'>
            <label className='block mb-0.5'>
              <div>Decay</div>
              <div>{decay * 1000}ms</div>
            </label>
            <VerticalSlider
              value={decay}
              onChange={(v) => setDecay(Math.round(v * 1000) / 1000)}
              exponential
              minExp={0.001}
              maxExp={10}
            />
          </div>
          <div className='w-5 text-center'>
            <label className='block mb-0.5'>
              <div>Sustain</div>
              <div>{sustain}</div>
            </label>
            <VerticalSlider
              value={sustain}
              onChange={setSustain}
              min={0}
              max={1}
              step={0.01}
            />
          </div>
          <div className='w-5 text-center'>
            <label className='block mb-0.5'>
              <div>Release</div>
              <div>{release * 1000}ms</div>
            </label>
            <VerticalSlider
              value={release}
              onChange={(v) => setRelease(Math.round(v * 1000) / 1000)}
              exponential
              minExp={0.001}
              maxExp={10}
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
    </div>
  )
}
