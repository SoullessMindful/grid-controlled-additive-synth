'use client'
import { useState } from 'react'
import GridController from './ui/GridController'
import GridMenu from './ui/SideMenu'
import SynthMenu from './ui/SynthMenu'

export default function Home() {
  const [isGridMenuOpen, setIsGridMenuOpen] = useState(false)
  const [synthMenuOpen, setSynthMenuOpen] = useState(false)

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
        open={synthMenuOpen}
        onClose={() => setSynthMenuOpen(false)}
      />
      <button
        className='absolute top-0 right-0 z-29 bg-gray-100 dark:bg-gray-900 text-3xl px-1.5 py-1 rounded-md'
        onClick={() => setSynthMenuOpen(true)}
      >
        ☰
      </button>
    </div>
  )
}
