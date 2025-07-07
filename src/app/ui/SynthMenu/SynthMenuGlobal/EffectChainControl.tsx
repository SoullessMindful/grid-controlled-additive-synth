import {
  SoundEngineContext,
  SoundEngineContextType,
} from '@/app/context/SoundEngineContextProvider'
import { createDelayEffectNode } from '@/lib/audionodes/DelayEffectNode'
import { EffectNodeSettings } from '@/lib/audionodes/EffectChainNode'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import { Fragment, JSX, ReactElement, useContext, useState } from 'react'
import HorizontalSlider from '../../HorizontalSlider'

export default function EffectChainControl() {
  const {
    effectSettings,
    updateEffectSettings,
    addEffect,
    removeEffect,
    switchEffects,
  } = useContext(SoundEngineContext) as SoundEngineContextType

  const [selectedEffect, setSelectedEffect] = useState<number>(0)

  return (
    <div className='mb-2 px-1'>
      <div className='mb-0.5 w-full'>Effects</div>
      <div className='h-20 p-1 flex flex-row justify-start items-start bg-gray-200 dark:bg-gray-800 rounded-2xl'>
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
                addEffect(createDelayEffectNode)
              }}
            />
          </div>
        </div>
        <div className='pl-0.5 grid grid-cols-[5rem_15rem] grid-rows-5 items-center gap-0.5'>
          {effectSettings[selectedEffect] &&
            effectNodeControl(
              effectSettings[selectedEffect],
              updateEffectSettings
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
          <div className='col-span-2'>{displayEffectName(es)}</div>
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
  }
}

function displayEffectName(es: EffectNodeSettings): string {
  switch (es.__type__) {
    case 'delay':
      return 'Delay'
  }
}
