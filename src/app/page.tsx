'use client'
import { useState } from 'react'
import GridController from './ui/GridController'
import SideMenu from './ui/SideMenu'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className='flex flex-row justify-around items-center w-full h-full relative'>
      <GridController />
      <SideMenu open={isMenuOpen} onClose={() => setIsMenuOpen(false)}/>
      <button
        className='fixed top-0 right-0 z-29 bg-gray-900 text-white text-3xl p-1 rounded-md'
        onClick={() => setIsMenuOpen(true)}
      >
        ☰
      </button>
    </div>
  )
}
