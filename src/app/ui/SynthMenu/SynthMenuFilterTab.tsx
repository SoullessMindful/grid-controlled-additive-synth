'use client'

import { useContext } from 'react'
import {
  SoundEngineContext,
  SoundEngineContextType,
} from '@/app/context/SoundEngineContextProvider'
import { FilterType } from '@/lib/filterParameters'
import HorizontalSlider from '../HorizontalSlider'

export default function SynthMenuFilterTab() {
  const { filterParameters, setFilterParameters } = useContext(
    SoundEngineContext
  ) as SoundEngineContextType

  return (
    <div className='px-1 py-1 flex flex-col items-center justify-center'>
      <div className='mb-2'>
        <label>Filter type </label>
        <select
          value={filterParameters.type}
          onChange={(e) => {
            const value = e.target.value
            const type =
              value === 'undefined' ? undefined : (value as FilterType)

            setFilterParameters({
              ...filterParameters,
              type,
            })
          }}
          className='w-12 h-2.5 px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
        >
          <option value='undefined'>None</option>
          <option value='lowpass'>Lowpass</option>
          <option value='highpass'>Highpass</option>
          <option value='bandpass'>Bandpass</option>
          <option value='notch'>Notch</option>
          <option value='allpass'>Allpass</option>
        </select>
      </div>
      <div className='mb-2'>
        <label className='block mb-0.5'>Q: {filterParameters.Q.value}</label>
        <div>
          <HorizontalSlider
            value={filterParameters.Q.value}
            onChange={(value) => setFilterParameters({
              ...filterParameters,
              Q: {
                ...filterParameters.Q,
                value
              }
            })}
            min={0.1}
            max={7}
            step={0.1}
          />
        </div>
      </div>
      <div className='mb-2'>
        <label className='block mb-0.5'>Frequency: {filterParameters.frequency.value}</label>
        <div>
          <HorizontalSlider
            value={filterParameters.frequency.value}
            onChange={(value) => setFilterParameters({
              ...filterParameters,
              frequency: {
                ...filterParameters.frequency,
                value: Math.round(value)
              }
            })}
            exponential
            minExp={20}
            maxExp={20000}
          />
        </div>
      </div>
    </div>
  )
}
