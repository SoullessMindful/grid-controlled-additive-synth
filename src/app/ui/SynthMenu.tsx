'use client'

import { useState } from 'react'
import SynthMenuWaveTab from './SynthMenu/SynthMenuWaveTab'
import SynthMenuGlobalTab from './SynthMenu/SynthMenuGlobalTab'
import SynthMenuFilterTab from './SynthMenu/SynthMenuFilterTab'
import { XMarkIcon } from '@heroicons/react/24/solid'

type SynthMenuProps = {
  open: boolean
  onClose: () => void
}

type Tab = 'wave' | 'filter' | 'global'

export default function SynthMenu({ open, onClose }: SynthMenuProps) {
  const [tab, setTab] = useState<Tab>('wave')

  return (
    <div
      className={`absolute top-0 right-0 z-31 h-full w-full
        bg-gray-100 dark:bg-gray-900 shadow-lg transform transition-transform duration-300
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className='w-full flex justify-between'>
        <button
          className='px-1 py-1 text-3xl cursor-pointer'
          onClick={onClose}
        >
          <XMarkIcon className='size-2' />
        </button>
        <div className='px-1'>
          <button
            className={`w-7 py-1 text-3xl text-center cursor-pointer ${
              tab === 'wave' ? '' : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => setTab('wave')}
          >
            Wave
          </button>
          <button
            className={`w-7 py-1 text-3xl text-center cursor-pointer ${
              tab === 'filter' ? '' : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => setTab('filter')}
          >
            Filter
          </button>
          <button
            className={`w-7 py-1 text-3xl text-center cursor-pointer ${
              tab === 'global' ? '' : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => setTab('global')}
          >
            Global
          </button>
        </div>
      </div>
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
  )
}
