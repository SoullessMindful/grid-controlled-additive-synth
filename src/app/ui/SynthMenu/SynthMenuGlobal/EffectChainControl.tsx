import {
  SoundEngineContext,
  SoundEngineContextType,
} from '@/app/context/SoundEngineContextProvider'
import { EffectNodeSettings } from '@/lib/audioNodes/EffectChainNode'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/solid'
import { Fragment, JSX, useContext, useState } from 'react'
import HorizontalSlider from '../../HorizontalSlider'
import { CheckButton } from '../../CheckButton'

export default function EffectChainControl() {
  const {
    effectSettings,
    setEffectSettings,
    addEffect,
    removeEffect,
    changeEffect,
    switchEffects,
    setEffectActive,
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
              } ${
                es.active ? '' : 'text-gray-600 dark:text-gray-400'
              } cursor-pointer`}
              onClick={() => setSelectedEffect(i)}
            >
              {displayEffectShortName(es)}
              <span>
                <ChevronDownIcon
                  className='inline size-1.5 cursor-pointer'
                  onClick={(e) => {
                    e.stopPropagation()

                    if (i + 1 >= effectSettings.length) return

                    switchEffects(i, i + 1)
                    setSelectedEffect(i + 1)
                  }}
                />
                <ChevronUpIcon
                  className='inline size-1.5 cursor-pointer'
                  onClick={(e) => {
                    e.stopPropagation()

                    if (i - 1 < 0) return

                    switchEffects(i, i - 1)
                    setSelectedEffect(i - 1)
                  }}
                />
                <TrashIcon
                  className='inline size-1 cursor-pointer'
                  onClick={(e) => {
                    e.stopPropagation()

                    removeEffect(i)
                  }}
                />
              </span>
            </div>
          ))}
          <div className='text-center'>
            <PlusIcon
              className='inline size-2.5 p-0.5 cursor-pointer'
              onClick={() => {
                addEffect('default')
                setSelectedEffect(effectSettings.length)
              }}
            />
          </div>
        </div>
        <div className='pl-0.5 grid grid-cols-[8rem_15rem] grid-rows-8 items-center gap-0.5'>
          {effectSettings[selectedEffect] && (
            <Fragment>
              <label className='flex flex-row items-center'>
                <CheckButton
                  value={effectSettings[selectedEffect].active}
                  onChange={(newActive) => {
                    setEffectActive(newActive, selectedEffect)
                  }}
                />
                <span>Active</span>
              </label>
              <div>
                <select
                  value={effectSettings[selectedEffect].__type__}
                  onChange={(e) => {
                    const newValue = e.target.value

                    if (newValue === effectSettings[selectedEffect].__type__)
                      return

                    switch (newValue) {
                      case 'eq':
                      case 'delay':
                      case 'compressor':
                      case 'overdrive':
                        changeEffect(newValue, selectedEffect)
                        break
                    }
                  }}
                  className='w-full h-2 px-1  rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
                >
                  <option
                    value='default'
                    hidden
                  >
                    Default
                  </option>
                  <option value='delay'>Delay</option>
                  <option value='eq'>Parametric Equalizer</option>
                  <option value='compressor'>Compressor</option>
                  <option value='overdrive'>Overdrive</option>
                </select>
              </div>
              {effectNodeControl(
                effectSettings[selectedEffect],
                (newSettings) => setEffectSettings(newSettings, selectedEffect)
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
  setEffectSettings: (newSettings: EffectNodeSettings) => void
): JSX.Element {
  switch (es.__type__) {
    case 'default':
      return <Fragment></Fragment>
    case 'delay':
      return (
        <Fragment>
          <div>Time</div>
          <div>
            <HorizontalSlider
              value={es.time}
              onChange={(newTime) => {
                setEffectSettings({
                  ...es,
                  time: newTime,
                })
              }}
              min={0}
              max={1}
              step={0.001}
              tooltip={(v) => `${(v * 1000).toFixed(0)}ms`}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div>Feedback</div>
          <div>
            <HorizontalSlider
              value={es.feedback}
              onChange={(newFeedback) => {
                setEffectSettings({
                  ...es,
                  feedback: newFeedback,
                })
              }}
              min={0}
              max={1}
              step={0.01}
              tooltip={(v) => `${(v * 100).toFixed(0)}%`}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div>Mix</div>
          <div>
            <HorizontalSlider
              value={es.mix}
              onChange={(newMix) => {
                setEffectSettings({
                  ...es,
                  mix: newMix,
                })
              }}
              min={0}
              max={1}
              step={0.01}
              tooltip={(v) => `${(v * 100).toFixed(0)}%`}
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
              value={es.lowShelfGain}
              onChange={(newGain) => {
                setEffectSettings({
                  ...es,
                  lowShelfGain: newGain,
                })
              }}
              min={-15}
              max={15}
              step={1}
              trackCenter={0}
              tooltip={(v) => `${v}dB`}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div className='pl-1'>frequency</div>
          <div>
            <HorizontalSlider
              value={es.lowShelfFreq}
              onChange={(newFrequency) => {
                setEffectSettings({
                  ...es,
                  lowShelfFreq: Math.round(newFrequency),
                })
              }}
              exponential
              minExp={50}
              maxExp={12800}
              tooltip={(v) => `${v}Hz`}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div>Band</div>
          <div>
            <HorizontalSlider
              value={es.midBandGain}
              onChange={(newGain) => {
                setEffectSettings({
                  ...es,
                  midBandGain: newGain,
                })
              }}
              min={-15}
              max={15}
              step={1}
              trackCenter={0}
              tooltip={(v) => `${v}dB`}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div className='pl-1'>frequency</div>
          <div>
            <HorizontalSlider
              value={es.midBandFreq}
              onChange={(newFrequency) => {
                setEffectSettings({
                  ...es,
                  midBandFreq: Math.round(newFrequency),
                })
              }}
              exponential
              minExp={50}
              maxExp={12800}
              tooltip={(v) => `${v}Hz`}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div>Highshelf</div>
          <div>
            <HorizontalSlider
              value={es.highShelfGain}
              onChange={(newGain) => {
                setEffectSettings({
                  ...es,
                  highShelfGain: newGain,
                })
              }}
              min={-15}
              max={15}
              step={1}
              trackCenter={0}
              tooltip={(v) => `${v}dB`}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div className='pl-1'>frequency</div>
          <div>
            <HorizontalSlider
              value={es.highShelfFreq}
              onChange={(newFrequency) => {
                setEffectSettings({
                  ...es,
                  highShelfFreq: Math.round(newFrequency),
                })
              }}
              exponential
              minExp={50}
              maxExp={12800}
              tooltip={(v) => `${v}Hz`}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div>Gain</div>
          <div>
            <HorizontalSlider
              value={es.makeupGain}
              onChange={(newGain) => {
                setEffectSettings({
                  ...es,
                  makeupGain: newGain,
                })
              }}
              min={-15}
              max={15}
              step={1}
              trackCenter={0}
              tooltip={(v) => `${v}dB`}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
        </Fragment>
      )
    case 'compressor':
      return (
        <Fragment>
          <div>Threshold</div>
          <div>
            <HorizontalSlider
              value={es.threshold}
              onChange={(newThreshold) => {
                setEffectSettings({
                  ...es,
                  threshold: Math.round(newThreshold * 10) * 0.1,
                })
              }}
              min={-30}
              max={0}
              step={0.1}
              tooltip={(v) => `${v.toFixed(1)}dB`}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div>Ratio</div>
          <div>
            <HorizontalSlider
              value={es.ratio}
              onChange={(newRatio) => {
                setEffectSettings({
                  ...es,
                  ratio: newRatio,
                })
              }}
              min={1}
              max={20}
              step={1}
              tooltip
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div>Attack</div>
          <div>
            <HorizontalSlider
              value={es.attack}
              onChange={(newAttack) => {
                setEffectSettings({
                  ...es,
                  attack: Math.round(newAttack * 1000) / 1000,
                })
              }}
              exponential
              minExp={0.001}
              maxExp={1}
              tooltip={(v) => `${(v * 1000).toFixed(0)}ms`}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div>Release</div>
          <div>
            <HorizontalSlider
              value={es.release}
              onChange={(newRelease) => {
                setEffectSettings({
                  ...es,
                  release: Math.round(newRelease * 1000) / 1000,
                })
              }}
              exponential
              minExp={0.001}
              maxExp={1}
              tooltip={(v) => `${(v * 1000).toFixed(0)}ms`}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div>Gain</div>
          <div>
            <HorizontalSlider
              value={es.makeupGain}
              onChange={(newGain) => {
                setEffectSettings({
                  ...es,
                  makeupGain: newGain,
                })
              }}
              min={-30}
              max={0}
              step={1}
              trackCenter={0}
              tooltip={(v) => `${v}dB`}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div>Mix</div>
          <div>
            <HorizontalSlider
              value={es.mix}
              onChange={(newMix) => {
                setEffectSettings({
                  ...es,
                  mix: newMix,
                })
              }}
              min={0}
              max={1}
              step={0.01}
              tooltip={(v) => `${(v * 100).toFixed(0)}%`}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
        </Fragment>
      )
    case 'overdrive':
      return (
        <Fragment>
          <div>Gain</div>
          <div>
            <HorizontalSlider
              value={es.gain}
              onChange={(newGain) => {
                setEffectSettings({
                  ...es,
                  gain: newGain,
                })
              }}
              min={-15}
              max={15}
              step={1}
              trackCenter={0}
              tooltip={(v) => `${v}dB`}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
          <div>Volume</div>
          <div>
            <HorizontalSlider
              value={es.volume}
              onChange={(newGain) => {
                setEffectSettings({
                  ...es,
                  volume: newGain,
                })
              }}
              min={-30}
              max={0}
              step={1}
              trackCenter={0}
              tooltip={(v) => `${v}dB`}
              className='w-15 h-2 thumb-w-1 thumb-r-1'
            />
          </div>
        </Fragment>
      )
  }
}

function displayEffectShortName(es: EffectNodeSettings): string {
  switch (es.__type__) {
    case 'default':
      return 'Default'
    case 'delay':
      return 'Delay'
    case 'eq':
      return 'PEQ'
    case 'compressor':
      return 'Compressor'
    case 'overdrive':
      return 'Overdrive'
  }
}
