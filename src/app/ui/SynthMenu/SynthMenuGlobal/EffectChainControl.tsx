import {
  SoundEngineContext,
  SoundEngineContextType,
} from '@/app/context/SoundEngineContextProvider'
import { createDelayEffectNode } from '@/lib/audionodes/DelayEffectNode'
import { EffectNodeSettings } from '@/lib/audionodes/EffectChainNode'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import { Fragment, JSX, useContext, useState } from 'react'
import HorizontalSlider from '../../HorizontalSlider'
import { createEQEffectNode } from '@/lib/audionodes/EQEffectNode'

export default function EffectChainControl() {
  const {
    effectSettings,
    updateEffectSettings,
    addEffect,
    removeEffect,
    changeEffect,
    switchEffects,
  } = useContext(SoundEngineContext) as SoundEngineContextType

  const [selectedEffect, setSelectedEffect] = useState<number>(0)

  return (
    <div className='mb-2 px-1'>
      <div className='mb-0.5 w-full'>Effects</div>
      <div className='h-22 p-1 flex flex-row justify-start items-start bg-gray-200 dark:bg-gray-800 rounded-2xl'>
        <div className='w-12 h-full pr-0.5 border-r-2 overflow-y-auto border-r-gray-700 dark:border-gray-300'>
          {effectSettings.map((es, i) => (
            <div
              key={`${es.__type__} ${i}`}
              className={`w-full p-0.5 flex justify-between items-center ${
                selectedEffect === i ? 'bg-gray-300 dark:bg-gray-700' : ''
              } cursor-pointer`}
              onClick={() => setSelectedEffect(i)}
            >
              {displayEffectName(es)}
              <TrashIcon
                className='size-1 cursor-pointer'
                onClick={(e) => {
                  e.stopPropagation()

                  removeEffect(i)
                }}
              />
            </div>
          ))}
          <div className='text-center'>
            <PlusIcon
              className='inline size-2.5 p-0.5 cursor-pointer'
              onClick={() => {
                addEffect('delay')
              }}
            />
          </div>
        </div>
        <div className='pl-0.5 grid grid-cols-[8rem_15rem] grid-rows-8 items-center gap-0.5'>
          {effectSettings[selectedEffect] && (
            <Fragment>
              <div className='col-span-2'>
                <select
                  value={effectSettings[selectedEffect].__type__}
                  onChange={(e) => {
                    const newValue = e.target.value

                    if (newValue === effectSettings[selectedEffect].__type__)
                      return

                    switch (newValue) {
                      case 'eq':
                        changeEffect('eq', selectedEffect)
                        break
                      case 'delay':
                        changeEffect('delay', selectedEffect)
                        break
                    }
                  }}
                  className='w-8 h-2 px-1  rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
                >
                  <option value='delay'>Delay</option>
                  <option value='eq'>Equalizer</option>
                </select>
              </div>
              {effectNodeControl(
                effectSettings[selectedEffect],
                updateEffectSettings
              )}
            </Fragment>
          )}
        </div>
      </div>
    </div>
  )
}

function effectNodeControl(
  es: EffectNodeSettings,
  updateEffectSettings: () => void
): JSX.Element {
  switch (es.__type__) {
    case 'delay':
      return (
        <Fragment>
          <div>Time</div>
          <div>
            <HorizontalSlider
              value={es.time.value}
              onChange={(newTime) => {
                es.time.value = newTime

                updateEffectSettings()
              }}
              min={0}
              max={2}
              step={0.001}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div>Feedback</div>
          <div>
            <HorizontalSlider
              value={es.feedback.value}
              onChange={(newFeedback) => {
                es.feedback.value = newFeedback

                updateEffectSettings()
              }}
              min={0}
              max={1}
              step={0.01}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div>Mix</div>
          <div>
            <HorizontalSlider
              value={es.mix.value}
              onChange={(newMix) => {
                es.mix.value = newMix

                updateEffectSettings()
              }}
              min={0}
              max={1}
              step={0.01}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
        </Fragment>
      )
    case 'eq':
      return (
        <Fragment>
          <div>Lowshelf</div>
          <div>
            <HorizontalSlider
              value={es.lowShelfGain.value}
              onChange={(newGain) => {
                es.lowShelfGain.value = newGain

                updateEffectSettings()
              }}
              min={-15}
              max={15}
              step={1}
              trackCenter={0}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div className='pl-1'>frequency</div>
          <div>
            <HorizontalSlider
              value={es.lowShelfFreq.value}
              onChange={(newFrequency) => {
                es.lowShelfFreq.value = newFrequency

                updateEffectSettings()
              }}
              exponential
              minExp={20}
              maxExp={20000}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div>Band</div>
          <div>
            <HorizontalSlider
              value={es.midBandGain.value}
              onChange={(newGain) => {
                es.midBandGain.value = newGain

                updateEffectSettings()
              }}
              min={-15}
              max={15}
              step={1}
              trackCenter={0}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div className='pl-1'>frequency</div>
          <div>
            <HorizontalSlider
              value={es.midBandFreq.value}
              onChange={(newFrequency) => {
                es.midBandFreq.value = newFrequency

                updateEffectSettings()
              }}
              exponential
              minExp={20}
              maxExp={20000}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div>Highshelf</div>
          <div>
            <HorizontalSlider
              value={es.highShelfGain.value}
              onChange={(newGain) => {
                es.highShelfGain.value = newGain

                updateEffectSettings()
              }}
              min={-15}
              max={15}
              step={1}
              trackCenter={0}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div className='pl-1'>frequency</div>
          <div>
            <HorizontalSlider
              value={es.highShelfFreq.value}
              onChange={(newFrequency) => {
                es.highShelfFreq.value = newFrequency

                updateEffectSettings()
              }}
              exponential
              minExp={20}
              maxExp={20000}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div>Gain</div>
          <div>
            <HorizontalSlider
              value={20 * Math.log10(es.makeupGain.value)}
              onChange={(newGainDB) => {
                const newGain = Math.pow(10, newGainDB * 0.05)
                es.makeupGain.value = newGain

                updateEffectSettings()
              }}
              min={-15}
              max={15}
              step={1}
              trackCenter={0}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
        </Fragment>
      )
  }
}

function displayEffectName(es: EffectNodeSettings): string {
  switch (es.__type__) {
    case 'delay':
      return 'Delay'
    case 'eq':
      return 'Equalizer'
  }
}
