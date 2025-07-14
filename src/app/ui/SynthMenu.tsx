'use client'

import { useContext, useState } from 'react'
import SynthMenuWaveTab from './SynthMenu/SynthMenuWaveTab'
import SynthMenuGlobalTab from './SynthMenu/SynthMenuGlobalTab'
import SynthMenuFilterTab from './SynthMenu/SynthMenuFilterTab'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { availablePresets } from '@/lib/synthSettingsPreset'
import {
  SoundEngineContext,
  SoundEngineContextType,
} from '../context/SoundEngineContextProvider'

type SynthMenuProps = {
  open: boolean
  onClose: () => void
}

type Tab = 'wave' | 'filter' | 'global'

export default function SynthMenu({ open, onClose }: SynthMenuProps) {
  const { presetName, setSynthSettings } = useContext(
    SoundEngineContext
  ) as SoundEngineContextType
  const [tab, setTab] = useState<Tab>('wave')

  return (
    <div
      className={`absolute top-0 right-0 z-31 h-svh min-h-0 w-full
        flex flex-col
        bg-gray-100 dark:bg-gray-900 shadow-lg transform transition-transform duration-300
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className='w-full flex justify-between items-center'>
        <button
          className='p-1 cursor-pointer'
          onClick={onClose}
        >
          <XMarkIcon className='size-2' />
        </button>
        <div className='px-1 text-2xl text-center'>
          <button
            className={`w-6 p-1 cursor-pointer ${
              tab === 'wave' ? '' : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => setTab('wave')}
          >
            Wave
          </button>
          <button
            className={`w-6 p-1 cursor-pointer ${
              tab === 'filter' ? '' : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => setTab('filter')}
          >
            Filter
          </button>
          <button
            className={`w-6 p-1 cursor-pointer ${
              tab === 'global' ? '' : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => setTab('global')}
          >
            Global
          </button>
        </div>
        <div className='px-1'>
          <select
            value='choose'
            onChange={(e) => {
              const selected = availablePresets.find(
                (preset) => preset.name === e.target.value
              )
              if (selected) setSynthSettings(selected)
            }}
            className='w-12 h-2.5 px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
          >
            {availablePresets.map((preset) => (
              <option
                key={preset.name}
                value={preset.name}
              >
                {preset.name}
              </option>
            ))}
            <option
              hidden
              value='choose'
            >
              Choose preset
            </option>
          </select>
        </div>
      </div>
      <div className='w-full h-2 py-0.5 text-center'>
        <span className='text-left inline-block w-30'>
          Preset: {presetName ?? '<Custom>'}
        </span>
      </div>
      <div className='flex-1 min-h-0 overflow-y-auto mb-1'>
        {(() => {
          switch (tab) {
            case 'wave':
              return <SynthMenuWaveTab />
            case 'filter':
              return <SynthMenuFilterTab />
            case 'global':
              return <SynthMenuGlobalTab />
          }
        })()}
      </div>
    </div>
  )
}
