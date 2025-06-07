'use client'

import { useContext } from 'react'
import {
  SoundEngineContext,
  SoundEngineContextType,
} from '../context/SoundEngineContextProvider'
import { Envelope } from '@/lib/envelope'

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

  return (
    <div className='flex flex-col justify-center items-stretch w-full h-full'>
      <div className='flex-1 m-1 bg-gray-100 dark:bg-gray-900 rounded-md flex flex-col items-center justify-center'>
        <div className='mb-4 text-center w-full flex flex-col items-center px-2'>
          <div className='flex flex-row mb-1'>
            <div className='mr-2'>
              <label>Overtones </label>
              <input
                type='number'
                min={1}
                max={64}
                value={overtonesCount}
                onChange={(e) => {
                  const newOvertonesCount = Number(e.target.value)
                  if (
                    !Number.isInteger(newOvertonesCount) ||
                    newOvertonesCount < 1 ||
                    newOvertonesCount > 64
                  )
                    return

                  setOvertonesCount(newOvertonesCount)
                }}
                className='w-6 h-2.5 px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-center'
              />
            </div>
            <div>
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
          </div>
          <div className='overflow-x-auto overflow-y-hidden whitespace-nowrap h-20 px-1 mx-1 w-full bg-gray-300 dark:bg-gray-700 rounded'>
            {overtoneEnvelopes.map((env, i) => (
              <div
                key={i}
                className='w-3 inline-block text-center py-1.5'
              >
                <label className='block text-xs mt-0.5'>{i + 1}</label>
                <div>
                  <input
                    type='range'
                    min={0}
                    max={1}
                    step={0.001}
                    value={env.level}
                    onChange={(e) => {
                      const newLevel = parseFloat(e.target.value)
                      const newOvertoneEnvelopes = [...overtoneEnvelopes]
                      const newOvertoneEnvelope = { ...newOvertoneEnvelopes[i] }

                      newOvertoneEnvelope.level = newLevel
                      newOvertoneEnvelopes[i] = newOvertoneEnvelope

                      setOvertoneEnvelopes(newOvertoneEnvelopes)
                    }}
                    className='[writing-mode:vertical-lr] [direction:rtl] h-15'
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='flex flex-row justify-center items-center w-full mb-2'>
          <div className='w-5 text-center'>
            <label className='block mb-0.5'>
              <div>Level</div>
              <div>{level}</div>
            </label>
            <div>
              <input
                type='range'
                value={level}
                min={0}
                max={1}
                step={0.01}
                onChange={(e) => setLevel(parseFloat(e.target.value))}
                className='[writing-mode:vertical-lr] [direction:rtl] [appeareance:slider-vertical] h-15'
              />
            </div>
          </div>
          <div className='w-5 text-center'>
            <label className='block mb-0.5'>
              <div>Attack</div>
              <div>{attack * 1000}ms</div>
            </label>
            <div>
              <input
                type='range'
                value={Math.log(attack * 1000) / Math.log(10000)}
                min={0}
                max={1}
                step={0.01}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value)
                  const newAttack = 0.001 * Math.pow(10, newValue * 4)
                  setAttack(Math.round(newAttack * 1000) / 1000)
                }}
                className='[writing-mode:vertical-lr] [direction:rtl] [appeareance:slider-vertical] h-15'
              />
            </div>
          </div>
          <div className='w-5 text-center'>
            <label className='block mb-0.5'>
              <div>Decay</div>
              <div>{decay * 1000}ms</div>
            </label>
            <div>
              <input
                type='range'
                value={Math.log(decay * 1000) / Math.log(10000)}
                min={0}
                max={1}
                step={0.01}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value)
                  const newDecay = 0.001 * Math.pow(10, newValue * 4)
                  setDecay(Math.round(newDecay * 1000) / 1000)
                }}
                className='[writing-mode:vertical-lr] [direction:rtl] [appeareance:slider-vertical] h-15'
              />
            </div>
          </div>
          <div className='w-5 text-center'>
            <label className='block mb-0.5'>
              <div>Sustain</div>
              <div>{sustain}</div>
            </label>
            <div>
              <input
                type='range'
                value={sustain}
                min={0}
                max={1}
                step={0.01}
                onChange={(e) => setSustain(parseFloat(e.target.value))}
                className='[writing-mode:vertical-lr] [direction:rtl] [appeareance:slider-vertical] h-15'
              />
            </div>
          </div>
          <div className='w-5 text-center'>
            <label className='block mb-0.5'>
              <div>Release</div>
              <div>{release * 1000}ms</div>
            </label>
            <div>
              <input
                type='range'
                value={Math.log(release * 1000) / Math.log(10000)}
                min={0}
                max={1}
                step={0.01}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value)
                  const newRelease = 0.001 * Math.pow(10, newValue * 4)
                  setRelease(Math.round(newRelease * 1000) / 1000)
                }}
                className='[writing-mode:vertical-lr] [direction:rtl] [appeareance:slider-vertical] h-15'
              />
            </div>
          </div>
        </div>
        <div className='mb-2'>
          <label className='block mb-0.5'>Volume</label>
          <div>
            <input
              type='range'
              value={volume}
              min={0}
              max={1}
              step={0.01}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className='w-15'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
