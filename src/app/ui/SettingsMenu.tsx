import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import GridSettingsMenu from './SettingsMenu/GridSettingsMenu'

type SettingsMenuProps = {
  open: boolean
  onClose: () => void
}

export default function SettingsMenu({ open, onClose }: SettingsMenuProps) {
  return (
    <div
      className={`absolute top-0 left-0 z-30 flex flex-row justify-center h-full w-full sm:w-44 pr-4 bg-gray-100 dark:bg-gray-900 
        shadow-lg transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <button
        className='absolute top-0 right-0 p-1'
        onClick={onClose}
      >
        <XMarkIcon className='size-2' />
      </button>
      <GridSettingsMenu />
      <GridSettingsMenu />
    </div>
  )
}
