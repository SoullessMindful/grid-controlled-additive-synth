'use client'
import { useState } from 'react'
import GridController from './ui/GridController'
import GridMenu from './ui/GridMenu'
import SynthMenu from './ui/SynthMenu'

export default function Home() {
  const [isGridMenuOpen, setIsGridMenuOpen] = useState(false)
  const [isSynthMenuOpen, setIsSynthMenuOpen] = useState(false)

  return (
    <div className='flex flex-row justify-around items-center w-full h-full relative'>
      <GridController />
      <GridMenu
        open={isGridMenuOpen}
        onClose={() => setIsGridMenuOpen(false)}
      />
      <button
        className='absolute top-0 left-0 z-29 bg-gray-100 dark:bg-gray-900 text-3xl px-1.5 py-1 rounded-md'
        onClick={() => setIsGridMenuOpen(true)}
      >
        ☰
      </button>
      <SynthMenu
        open={isSynthMenuOpen}
        onClose={() => setIsSynthMenuOpen(false)}
      />
      <button
        className='absolute top-0 right-0 z-29 bg-gray-100 dark:bg-gray-900 text-3xl px-1.5 py-1 rounded-md'
        onClick={() => setIsSynthMenuOpen(true)}
      >
        ☰
      </button>
      <button
        className='absolute top-0 left-1/2 -translate-x-1/2 bg-gray-100 dark:bg-gray-900 text-3xl px-1.5 py-1 rounded-md'
        onClick={() => {
          if (document.fullscreenElement !== null) {
            document.exitFullscreen()
          } else {
            document.documentElement.requestFullscreen()
          }
        }}
      >
        Fullscreen
      </button>
    </div>
  )
}
