'use client'

import { Fragment, useContext } from 'react'
import {
  SoundEngineContext,
  SoundEngineContextType,
} from '@/app/context/SoundEngineContextProvider'
import { FilterType } from '@/lib/filterParameters'
import HorizontalSlider from '../HorizontalSlider'
import VerticalSlider from '../VerticalSlider'

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
      {filterParameters.type && (
        <Fragment>
          <div className='mb-2 flex flex-row w-36'>
            <div className='w-5 text-center'>
              <label className='block mb-0.5'>
                <div>Frequency</div>
                <div>{filterParameters.frequency.value}Hz</div>
              </label>
              <div>
                <VerticalSlider
                  value={filterParameters.frequency.value}
                  onChange={(v) => {
                    const newFilterParameters = { ...filterParameters }
                    const newFrequency = { ...newFilterParameters.frequency }

                    newFrequency.value = Math.round(v)
                    newFilterParameters.frequency = newFrequency
                    setFilterParameters(newFilterParameters)
                  }}
                  minExp={20}
                  maxExp={20000}
                  exponential
                />
              </div>
            </div>
            <div className='w-6 flex-1 flex flex-col justify-evenly'>
              <div>
                <label>
                  <input
                    type='radio'
                    checked={
                      filterParameters.frequency.modulation === undefined
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newFilterParameters = { ...filterParameters }
                        const newFrequency = {
                          ...newFilterParameters.frequency,
                        }

                        newFrequency.modulation = undefined
                        newFilterParameters.frequency = newFrequency
                        setFilterParameters(newFilterParameters)
                      }
                    }}
                    className='mr-1'
                  />
                  Static
                </label>
              </div>
              <div>
                <label>
                  <input
                    type='radio'
                    checked={
                      filterParameters.frequency.modulation !== undefined
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newFilterParameters = { ...filterParameters }
                        const newFrequency = {
                          ...newFilterParameters.frequency,
                        }

                        newFrequency.modulation = {
                          level: newFrequency.value,
                          attack: 0.001,
                          decay: 0.001,
                          sustain: newFrequency.value,
                          release: 0.001,
                        }
                        newFilterParameters.frequency = newFrequency
                        setFilterParameters(newFilterParameters)
                      }
                    }}
                    className='mr-1'
                  />
                  Envelope
                </label>
              </div>
            </div>
            {filterParameters.frequency.modulation !== undefined && (
              <Fragment>
                <div className='w-5 text-center'>
                  <label className='block mb-0.5'>
                    <div>Peak</div>
                    <div>{filterParameters.frequency.modulation.level}</div>
                  </label>
                  <VerticalSlider
                    value={filterParameters.frequency.modulation.level}
                    onChange={(v) => {
                      const newFilterParameters = { ...filterParameters }
                      const newFrequency = { ...newFilterParameters.frequency }
                      if (newFrequency.modulation === undefined) return
                      const newModulation = { ...newFrequency.modulation }

                      newModulation.level = Math.round(v)
                      newFrequency.modulation = newModulation
                      newFilterParameters.frequency = newFrequency
                      setFilterParameters(newFilterParameters)
                    }}
                    minExp={20}
                    maxExp={20000}
                    exponential
                  />
                </div>
                <div className='w-5 text-center'>
                  <label className='block mb-0.5'>
                    <div>Attack</div>
                    <div>
                      {filterParameters.frequency.modulation.attack * 1000}ms
                    </div>
                  </label>
                  <VerticalSlider
                    value={filterParameters.frequency.modulation.attack}
                    onChange={(v) => {
                      const newFilterParameters = { ...filterParameters }
                      const newFrequency = { ...newFilterParameters.frequency }
                      if (newFrequency.modulation === undefined) return
                      const newModulation = { ...newFrequency.modulation }

                      newModulation.attack = Math.round(v * 1000) / 1000
                      newFrequency.modulation = newModulation
                      newFilterParameters.frequency = newFrequency
                      setFilterParameters(newFilterParameters)
                    }}
                    exponential
                    minExp={0.001}
                    maxExp={10}
                  />
                </div>
                <div className='w-5 text-center'>
                  <label className='block mb-0.5'>
                    <div>Decay</div>
                    <div>
                      {filterParameters.frequency.modulation.decay * 1000}ms
                    </div>
                  </label>
                  <VerticalSlider
                    value={filterParameters.frequency.modulation.decay}
                    onChange={(v) => {
                      const newFilterParameters = { ...filterParameters }
                      const newFrequency = { ...newFilterParameters.frequency }
                      if (newFrequency.modulation === undefined) return
                      const newModulation = { ...newFrequency.modulation }

                      newModulation.decay = Math.round(v * 1000) / 1000
                      newFrequency.modulation = newModulation
                      newFilterParameters.frequency = newFrequency
                      setFilterParameters(newFilterParameters)
                    }}
                    exponential
                    minExp={0.001}
                    maxExp={10}
                  />
                </div>
                <div className='w-5 text-center'>
                  <label className='block mb-0.5'>
                    <div>Stable</div>
                    <div>{filterParameters.frequency.modulation.sustain}</div>
                  </label>
                  <VerticalSlider
                    value={filterParameters.frequency.modulation.sustain}
                    onChange={(v) => {
                      const newFilterParameters = { ...filterParameters }
                      const newFrequency = { ...newFilterParameters.frequency }
                      if (newFrequency.modulation === undefined) return
                      const newModulation = { ...newFrequency.modulation }

                      newModulation.sustain = Math.round(v)
                      newFrequency.modulation = newModulation
                      newFilterParameters.frequency = newFrequency
                      setFilterParameters(newFilterParameters)
                    }}
                    minExp={20}
                    maxExp={20000}
                    exponential
                  />
                </div>
                <div className='w-5 text-center'>
                  <label className='block mb-0.5'>
                    <div>Release</div>
                    <div>
                      {filterParameters.frequency.modulation.release * 1000}ms
                    </div>
                  </label>
                  <VerticalSlider
                    value={filterParameters.frequency.modulation.release}
                    onChange={(v) => {
                      const newFilterParameters = { ...filterParameters }
                      const newFrequency = { ...newFilterParameters.frequency }
                      if (newFrequency.modulation === undefined) return
                      const newModulation = { ...newFrequency.modulation }

                      newModulation.release = Math.round(v * 1000) / 1000
                      newFrequency.modulation = newModulation
                      newFilterParameters.frequency = newFrequency
                      setFilterParameters(newFilterParameters)
                    }}
                    exponential
                    minExp={0.001}
                    maxExp={10}
                  />
                </div>
              </Fragment>
            )}
          </div>
          <div className='mb-2 flex flex-row w-36'>
            <div className='w-5 text-center'>
              <label className='block mb-0.5'>
                <div>Q</div>
                <div>{filterParameters.Q.value}</div>
              </label>
              <div>
                <VerticalSlider
                  value={filterParameters.Q.value}
                  onChange={(value) =>
                    setFilterParameters({
                      ...filterParameters,
                      Q: {
                        ...filterParameters.Q,
                        value,
                      },
                    })
                  }
                  min={0.1}
                  max={7}
                  step={0.1}
                />
              </div>
            </div>
            <div className='w-6 flex-1 flex flex-col justify-evenly'>
              <div>
                <label>
                  <input
                    type='radio'
                    checked={filterParameters.Q.modulation === undefined}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newFilterParameters = { ...filterParameters }
                        const newQ = { ...newFilterParameters.Q }

                        newQ.modulation = undefined
                        newFilterParameters.Q = newQ
                        setFilterParameters(newFilterParameters)
                      }
                    }}
                    className='mr-1'
                  />
                  Static
                </label>
              </div>
              <div>
                <label>
                  <input
                    type='radio'
                    checked={filterParameters.Q.modulation !== undefined}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newFilterParameters = { ...filterParameters }
                        const newQ = { ...newFilterParameters.Q }

                        newQ.modulation = {
                          level: newQ.value,
                          attack: 0.001,
                          decay: 0.001,
                          sustain: newQ.value,
                          release: 0.001,
                        }
                        newFilterParameters.Q = newQ
                        setFilterParameters(newFilterParameters)
                      }
                    }}
                    className='mr-1'
                  />
                  Envelope
                </label>
              </div>
            </div>
            {filterParameters.Q.modulation !== undefined && (
              <Fragment>
                <div className='w-5 text-center'>
                  <label className='block mb-0.5'>
                    <div>Peak</div>
                    <div>{filterParameters.Q.modulation.level}</div>
                  </label>
                  <VerticalSlider
                    value={filterParameters.Q.modulation.level}
                    onChange={(v) => {
                      const newFilterParameters = { ...filterParameters }
                      const newQ = { ...newFilterParameters.Q }
                      if (newQ.modulation === undefined) return
                      const newModulation = { ...newQ.modulation }

                      newModulation.level = v
                      newQ.modulation = newModulation
                      newFilterParameters.Q = newQ
                      setFilterParameters(newFilterParameters)
                    }}
                    min={0.1}
                    max={7}
                    step={0.1}
                  />
                </div>
                <div className='w-5 text-center'>
                  <label className='block mb-0.5'>
                    <div>Attack</div>
                    <div>{filterParameters.Q.modulation.attack * 1000}ms</div>
                  </label>
                  <VerticalSlider
                    value={filterParameters.Q.modulation.attack}
                    onChange={(v) => {
                      const newFilterParameters = { ...filterParameters }
                      const newQ = { ...newFilterParameters.Q }
                      if (newQ.modulation === undefined) return
                      const newModulation = { ...newQ.modulation }

                      newModulation.attack = Math.round(v * 1000) / 1000
                      newQ.modulation = newModulation
                      newFilterParameters.Q = newQ
                      setFilterParameters(newFilterParameters)
                    }}
                    exponential
                    minExp={0.001}
                    maxExp={10}
                  />
                </div>
                <div className='w-5 text-center'>
                  <label className='block mb-0.5'>
                    <div>Decay</div>
                    <div>{filterParameters.Q.modulation.decay * 1000}ms</div>
                  </label>
                  <VerticalSlider
                    value={filterParameters.Q.modulation.decay}
                    onChange={(v) => {
                      const newFilterParameters = { ...filterParameters }
                      const newQ = { ...newFilterParameters.Q }
                      if (newQ.modulation === undefined) return
                      const newModulation = { ...newQ.modulation }

                      newModulation.decay = Math.round(v * 1000) / 1000
                      newQ.modulation = newModulation
                      newFilterParameters.Q = newQ
                      setFilterParameters(newFilterParameters)
                    }}
                    exponential
                    minExp={0.001}
                    maxExp={10}
                  />
                </div>
                <div className='w-5 text-center'>
                  <label className='block mb-0.5'>
                    <div>Stable</div>
                    <div>{filterParameters.Q.modulation.sustain}</div>
                  </label>
                  <VerticalSlider
                    value={filterParameters.Q.modulation.sustain}
                    onChange={(v) => {
                      const newFilterParameters = { ...filterParameters }
                      const newQ = { ...newFilterParameters.Q }
                      if (newQ.modulation === undefined) return
                      const newModulation = { ...newQ.modulation }

                      newModulation.sustain = v
                      newQ.modulation = newModulation
                      newFilterParameters.Q = newQ
                      setFilterParameters(newFilterParameters)
                    }}
                    min={0.1}
                    max={7}
                    step={0.1}
                  />
                </div>
                <div className='w-5 text-center'>
                  <label className='block mb-0.5'>
                    <div>Release</div>
                    <div>{filterParameters.Q.modulation.release * 1000}ms</div>
                  </label>
                  <VerticalSlider
                    value={filterParameters.Q.modulation.release}
                    onChange={(v) => {
                      const newFilterParameters = { ...filterParameters }
                      const newQ = { ...newFilterParameters.Q }
                      if (newQ.modulation === undefined) return
                      const newModulation = { ...newQ.modulation }

                      newModulation.release = Math.round(v * 1000) / 1000
                      newQ.modulation = newModulation
                      newFilterParameters.Q = newQ
                      setFilterParameters(newFilterParameters)
                    }}
                    exponential
                    minExp={0.001}
                    maxExp={10}
                  />
                </div>
              </Fragment>
            )}
          </div>
        </Fragment>
      )}
    </div>
  )
}
