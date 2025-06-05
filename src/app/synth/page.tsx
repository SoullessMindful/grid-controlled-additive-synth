'use client'

import { useContext, useState } from 'react'
import {
  SoundEngineContext,
  SoundEngineContextType,
} from '../context/SoundEngineContextProvider'

export default function SynthPage() {
  const {
    volume,
    setVolume,
    attack,
    setAttack,
    decay,
    setDecay,
    sustain,
    setSustain,
    release,
    setRelease,
  } = useContext(SoundEngineContext) as SoundEngineContextType

  return (
    <div className='flex flex-col justify-center items-stretch w-full h-full'>
      <div className='flex-1 m-1 bg-gray-100 dark:bg-gray-900 rounded-md flex flex-col items-center justify-center'>
        <div className='flex flex-row justify-center items-center w-full p-2'>
          <div className='w-5 text-center'>
            <div>Attack</div>
            <div>{attack * 1000}ms</div>
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
            <div>Decay</div>
            <div>{decay * 1000}ms</div>
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
            <div>Sustain</div>
            <div>{sustain}</div>
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
            <div>Release</div>
            <div>{release * 1000}ms</div>
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
              className='w-15'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
