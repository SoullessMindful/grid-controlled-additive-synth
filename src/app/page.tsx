'use client'
import { useState } from 'react'
import GridController from './ui/GridController'
import SettingsMenu from './ui/SettingsMenu'
import SynthMenu from './ui/SynthMenu'
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  BeakerIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/solid'
import GainMeter from './ui/GainMeter'

export default function Home() {
  const [isGridMenuOpen, setIsGridMenuOpen] = useState(false)
  const [isSynthMenuOpen, setIsSynthMenuOpen] = useState(false)

  return (
    <div className='relative flex flex-col w-full h-full items-stretch'>
      <div className='flex flex-row items-center h-4 bg-gray-50 dark:bg-gray-950'>
        <button
          className='bg-gray-100 dark:bg-gray-900 p-1 rounded-md cursor-pointer'
          onClick={() => setIsGridMenuOpen(true)}
        >
          <Cog6ToothIcon className='size-2' />
        </button>
        <div className='flex-1/2'></div>
        <button
          className='bg-gray-100 dark:bg-gray-900 p-1 rounded-md cursor-pointer'
          onClick={() => {
            if (document.fullscreenElement !== null) {
              document.exitFullscreen()
            } else {
              document.documentElement.requestFullscreen()
            }
          }}
        >
          <span className='fullscreen-invisible'>
            <ArrowsPointingOutIcon className='size-2' />
          </span>
          <span className='not-fullscreen-invisible'>
            <ArrowsPointingInIcon className='size-2' />
          </span>
        </button>
        <div className='flex-1/2'>
          <GainMeter />
        </div>
        <button
          className='bg-gray-100 dark:bg-gray-900 p-1 rounded-md cursor-pointer'
          onClick={() => setIsSynthMenuOpen(true)}
        >
          <BeakerIcon className='size-2' />
        </button>
      </div>
      <div className='flex-1 flex flex-column justify-around items-center'>
        <GridController />
      </div>
      <SynthMenu
        open={isSynthMenuOpen}
        onClose={() => setIsSynthMenuOpen(false)}
      />
      <SettingsMenu
        open={isGridMenuOpen}
        onClose={() => setIsGridMenuOpen(false)}
      />
    </div>
  )
}
