import React, { useContext } from 'react'
import {
  SoundEngineContext,
  SoundEngineContextType,
} from '../context/SoundEngineContextProvider'
import {
  MainAppContext,
  MainAppContextType,
} from '../context/MainAppContextProvider'
import {
  noteToString,
  availableScales,
  rootNoteToString,
  RootNote,
} from '../../lib/scale'

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
    scale,
    setScale,
    scaleRoot,
    setScaleRoot,
    lockToScale,
    setLockToScale,
    highlightRootNote,
    setHighlightRootNote,
  } = useContext(MainAppContext) as MainAppContextType

  return (
    <div
      className={`absolute top-0 right-0 z-30 h-full w-30 bg-gray-900 text-white shadow-lg transform transition-transform duration-300
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
        <div className='mb-4'>
          <label className='block mb-1'>Scale</label>
          <select
            value={scaleRoot}
            onChange={(e) => setScaleRoot(Number(e.target.value) as RootNote)}
            className='w-1/2 text-white px-2 py-1 rounded'
          >
            {Array.from({ length: 12 }, (_, i) => i as RootNote).map((n) => (
              <option
                key={n}
                value={n}
                className='text-black'
              >
                {rootNoteToString(n)}
              </option>
            ))}
          </select>
          <select
            value={scale.name}
            onChange={(e) => {
              const selected = availableScales.find(
                (s) => s.name === e.target.value
              )
              if (selected) setScale(selected)
            }}
            className='w-1/2 text-white px-2 py-1 rounded'
          >
            {availableScales.map((s) => (
              <option
                key={s.name}
                value={s.name}
                className='text-black'
              >
                {s.name}
              </option>
            ))}
          </select>
          <div className='flex items-center justify-between mt-0.5'>
            <div>
              <input
                type='checkbox'
                checked={lockToScale}
                onChange={(e) => setLockToScale(e.target.checked)}
                id='lockToScale'
                className='mr-1'
              />
              <label htmlFor='lockToScale'>Lock to scale</label>
            </div>
            <div>
              <input
                type='checkbox'
                checked={highlightRootNote}
                onChange={(e) => setHighlightRootNote(e.target.checked)}
                id='highlightRootNote'
                className='mr-1'
              />
              <label htmlFor='highlightRootNote'>Highlight root note</label>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
