import React, { useContext } from 'react'
import {
  SoundEngineContext,
  SoundEngineContextType,
} from '../context/SoundEngineContextProvider'
import {
  MainAppContext,
  MainAppContextType,
} from '../context/MainAppContextProvider'
import { noteToString } from '../../lib/scale'

type SideMenuProps = {
  open: boolean
  onClose: () => void
  children?: React.ReactNode
}

export default function SideMenu({ open, onClose, children }: SideMenuProps) {
  const {
    rowsCount,
    setRowsCount,
    columnsCount,
    setColumnsCount,
    padSize,
    setPadSize,
    noteOffset,
    setNoteOffset,
  } = useContext(MainAppContext) as MainAppContextType

  return (
    <div
      className={`fixed top-0 right-0 z-30 h-full w-30 bg-gray-900 text-white shadow-lg transform transition-transform duration-300
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <button
        className='absolute top-0 left-0 p-1 text-white text-3xl'
        onClick={onClose}
      >
        ✕
      </button>
      <div className='p-4'>
        <div className='mb-4'>
          <label className='block mb-1'>Rows</label>
          <select
            value={rowsCount}
            onChange={(e) => setRowsCount(Number(e.target.value))}
            className='w-full text-white px-2 py-1 rounded'
          >
            {Array.from({ length: 16 - 3 + 1 }, (_, i) => 3 + i).map((n) => (
              <option
                key={n}
                value={n}
                className='text-black'
              >
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Columns</label>
          <select
            value={columnsCount}
            onChange={(e) => setColumnsCount(Number(e.target.value))}
            className='w-full text-white px-2 py-1 rounded'
          >
            {Array.from({ length: 16 - 5 + 1 }, (_, i) => 5 + i).map((n) => (
              <option
                key={n}
                value={n}
                className='text-black'
              >
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Pad Size</label>
          <select
            value={padSize}
            onChange={(e) => setPadSize(Number(e.target.value))}
            className='w-full text-white px-2 py-1 rounded'
          >
            {[...Array(10)].map((_, i) => {
              const size = i + 1
              return (
                <option
                  key={size}
                  value={size}
                  className='text-black'
                >
                  {size}
                </option>
              )
            })}
          </select>
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Base note</label>
          <select
            value={noteOffset}
            onChange={(e) => setNoteOffset(Number(e.target.value))}
            className='w-full text-white px-2 py-1 rounded'
          >
            {Array.from({ length: 60 }, (_, i) => i + 12).map((n) => (
              <option
                key={n}
                value={n}
                className='text-black'
              >
                {noteToString(n)} ({n})
              </option>
            ))}
          </select>
        </div>
        {children}
      </div>
    </div>
  )
}
