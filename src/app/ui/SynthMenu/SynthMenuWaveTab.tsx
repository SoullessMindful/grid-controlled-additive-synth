'use client'

import { Fragment, useContext, useState } from 'react'
import {
  SoundEngineContext,
  SoundEngineContextType,
} from '@/app/context/SoundEngineContextProvider'
import {
  envelopeProperties,
  EnvelopeProperty,
  envelopePropertyToString,
} from '@/lib/envelope'
import VerticalSlider from '../VerticalSlider'
import { MinusIcon, NoSymbolIcon, PlusIcon } from '@heroicons/react/24/solid'
import HorizontalSlider from '../HorizontalSlider'

export default function SynthMenuWaveTab() {
  const {
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

  const [activeEnvelopeProperty, setActiveEnvelopeProperty] =
    useState<EnvelopeProperty>('level')

  const overtoneOptions = Array.from({ length: 64 }, (_, i) => i + 1)

  return (
    <div className='px-1 py-1 flex flex-col items-center justify-center'>
      <div className='mb-4 text-center w-full flex flex-col items-center'>
        <div className='flex flex-row w-full rounded-t-2xl'>
          {envelopeProperties.map((property) => (
            <button
              key={property}
              className={`${
                activeEnvelopeProperty === property
                  ? 'bg-gray-200 dark:bg-gray-800 rounded-t '
                  : ''
              }p-1 cursor-pointer`}
              onClick={() => setActiveEnvelopeProperty(property)}
            >
              {envelopePropertyToString(property)}
            </button>
          ))}
          <div className='flex-1 flex justify-end items-center'>
            <label className='block p-1'>Overtones</label>
            <button
              type='button'
              className='px-0.75 py-0.25 h-full cursor-pointer'
              onClick={() => setOvertonesCount(Math.max(1, overtonesCount - 1))}
              aria-label='Decrease overtones'
            >
              <MinusIcon
                className={`size-1 ${
                  overtonesCount <= 1
                    ? 'stroke-gray-500'
                    : 'stroke-black dark:stroke-white'
                }`}
              />
            </button>
            <select
              value={overtonesCount}
              onChange={(e) => setOvertonesCount(Number(e.target.value))}
              className='px-0.25 py-0.5 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-center cursor-pointer'
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
              className='px-0.75 py-0.25 h-full cursor-pointer'
              onClick={() =>
                setOvertonesCount(Math.min(64, overtonesCount + 1))
              }
              aria-label='Increase overtones'
            >
              <PlusIcon
                className={`size-1 ${
                  overtonesCount >= 64
                    ? 'stroke-gray-500'
                    : 'stroke-black dark:stroke-white'
                }`}
              />
            </button>
          </div>
        </div>
        <div className='overflow-x-auto overflow-y-hidden whitespace-nowrap h-22 px-1 mx-1 w-full bg-gray-200 dark:bg-gray-800 rounded-b-2xl'>
          {overtoneEnvelopes.map((env, i) => (
            <div
              key={i}
              className='w-3 inline-block text-center py-0.5'
            >
              <label className='block text-xs mt-0.5'>{i + 1}</label>
              <div>
                {(() => {
                  switch (activeEnvelopeProperty) {
                    case 'level':
                      return (
                        <Fragment>
                          <VerticalSlider
                            value={env.level}
                            onChange={(newLevel) => {
                              const newOvertoneEnvelopes = [
                                ...overtoneEnvelopes,
                              ]
                              const newOvertoneEnvelope = {
                                ...newOvertoneEnvelopes[i],
                              }

                              newOvertoneEnvelope.level = newLevel
                              newOvertoneEnvelopes[i] = newOvertoneEnvelope

                              setOvertoneEnvelopes(newOvertoneEnvelopes)
                            }}
                            min={0}
                            max={1}
                            step={0.001}
                            tooltip={(v) => v.toFixed(3)}
                            className='h-15 w-2 thumb-h-1 thumb-r-1'
                          />
                          <div
                            className='cursor-pointer'
                            onClick={() => {
                              const newOvertoneEnvelopes = [
                                ...overtoneEnvelopes,
                              ]
                              const newOvertoneEnvelope = {
                                ...newOvertoneEnvelopes[i],
                              }

                              newOvertoneEnvelope.flipPhase =
                                newOvertoneEnvelope.flipPhase === true
                                  ? false
                                  : true
                              newOvertoneEnvelopes[i] = newOvertoneEnvelope

                              setOvertoneEnvelopes(newOvertoneEnvelopes)
                            }}
                          >
                            <NoSymbolIcon
                              className={`size-1 inline ${
                                env.flipPhase === true
                                  ? 'stroke-black dark:stroke-white'
                                  : 'stroke-gray-400 dark:stroke-gray-600'
                              }`}
                            />
                          </div>
                        </Fragment>
                      )
                    case 'attack':
                      return (
                        <VerticalSlider
                          value={env.attack}
                          onChange={(newAttack) => {
                            const newOvertoneEnvelopes = [...overtoneEnvelopes]
                            const newOvertoneEnvelope = {
                              ...newOvertoneEnvelopes[i],
                            }

                            newOvertoneEnvelope.attack =
                              Math.round(newAttack * 1000) / 1000
                            newOvertoneEnvelopes[i] = newOvertoneEnvelope

                            setOvertoneEnvelopes(newOvertoneEnvelopes)
                          }}
                          exponential
                          minExp={0.001}
                          maxExp={10}
                          tooltip={(v) => `${v * 1000}ms`}
                          className='h-15 w-2 thumb-h-1 thumb-r-1'
                        />
                      )
                    case 'decay':
                      return (
                        <VerticalSlider
                          value={env.decay}
                          onChange={(newDecay) => {
                            const newOvertoneEnvelopes = [...overtoneEnvelopes]
                            const newOvertoneEnvelope = {
                              ...newOvertoneEnvelopes[i],
                            }

                            newOvertoneEnvelope.decay =
                              Math.round(newDecay * 1000) / 1000
                            newOvertoneEnvelopes[i] = newOvertoneEnvelope

                            setOvertoneEnvelopes(newOvertoneEnvelopes)
                          }}
                          exponential
                          minExp={0.001}
                          maxExp={10}
                          tooltip={(v) => `${v * 1000}ms`}
                          className='h-15 w-2 thumb-h-1 thumb-r-1'
                        />
                      )
                    case 'sustain':
                      return (
                        <VerticalSlider
                          value={env.sustain}
                          onChange={(newSustain) => {
                            const newOvertoneEnvelopes = [...overtoneEnvelopes]
                            const newOvertoneEnvelope = {
                              ...newOvertoneEnvelopes[i],
                            }

                            newOvertoneEnvelope.sustain = newSustain
                            newOvertoneEnvelopes[i] = newOvertoneEnvelope

                            setOvertoneEnvelopes(newOvertoneEnvelopes)
                          }}
                          min={0}
                          max={1}
                          step={0.01}
                          tooltip={(v) => v.toFixed(3)}
                          className='h-15 w-2 thumb-h-1 thumb-r-1'
                        />
                      )
                    case 'release':
                      return (
                        <VerticalSlider
                          value={env.release}
                          onChange={(newRelease) => {
                            const newOvertoneEnvelopes = [...overtoneEnvelopes]
                            const newOvertoneEnvelope = {
                              ...newOvertoneEnvelopes[i],
                            }

                            newOvertoneEnvelope.release =
                              Math.round(newRelease * 1000) / 1000
                            newOvertoneEnvelopes[i] = newOvertoneEnvelope

                            setOvertoneEnvelopes(newOvertoneEnvelopes)
                          }}
                          exponential
                          minExp={0.001}
                          maxExp={10}
                          tooltip={(v) => `${v * 1000}ms`}
                          className='h-15 w-2 thumb-h-1 thumb-r-1'
                        />
                      )
                  }
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='mb-2'>
        <label className='w-7 inline-block'>Waveform </label>
        <select
          value={waveform.name}
          onChange={(e) => {
            const selected = availableWaveforms.find(
              (wf) => wf.name === e.target.value
            )
            if (selected) setWaveform(selected)
          }}
          className='w-15 h-2.5 px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
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
        {waveform.__type__ === 'NoiseWaveform' && (
          <div className='flex flex-row mt-0.5 items-center'>
            <label className='w-7'>Filter Q </label>
            <HorizontalSlider
              value={waveform.Q}
              onChange={(newQ) =>
                setWaveform({
                  ...waveform,
                  Q: newQ,
                })
              }
              min={0.1}
              max={20}
              step={0.1}
              tooltip={(v) => v.toFixed(1)}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
        )}
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
            tooltip={(v) => v.toFixed(2)}
            className='h-15 w-2 thumb-h-1 thumb-r-1'
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
            className='h-15 w-2 thumb-h-1 thumb-r-1'
            tooltip={(v) => `${v * 1000}ms`}
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
            className='h-15 w-2 thumb-h-1 thumb-r-1'
            tooltip={(v) => `${v * 1000}ms`}
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
            tooltip={(v) => v.toFixed(2)}
            className='h-15 w-2 thumb-h-1 thumb-r-1'
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
            className='h-15 w-2 thumb-h-1 thumb-r-1'
            tooltip={(v) => `${v * 1000}ms`}
          />
        </div>
      </div>
    </div>
  )
}
