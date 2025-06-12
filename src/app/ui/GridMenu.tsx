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

type GridMenuProps = {
  open: boolean
  onClose: () => void
  children?: React.ReactNode
}

export default function GridMenu({ open, onClose, children }: GridMenuProps) {
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
    displayNoteLetter,
    setDisplayNoteLetter,
  } = useContext(MainAppContext) as MainAppContextType

  return (
    <div
      className={`absolute top-0 left-0 z-30 h-full w-30 bg-gray-100 dark:bg-gray-900 
        shadow-lg transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <button
        className='absolute top-0 right-0 px-1.5 py-1 text-3xl'
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
            className='w-full px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
          >
            {Array.from({ length: 16 - 3 + 1 }, (_, i) => 3 + i).map((n) => (
              <option
                key={n}
                value={n}
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
            className='w-full px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
          >
            {Array.from({ length: 16 - 5 + 1 }, (_, i) => 5 + i).map((n) => (
              <option
                key={n}
                value={n}
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
            className='w-full px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
          >
            {[...Array(10)].map((_, i) => {
              const size = i + 1
              return (
                <option
                  key={size}
                  value={size}
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
            className='w-full px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
          >
            {Array.from({ length: 60 }, (_, i) => i + 12).map((n) => (
              <option
                key={n}
                value={n}
              >
                {noteToString(n)} ({n})
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Scale</label>
          <div className='flex gap-2 mb-1'>
            <select
              value={scaleRoot}
              onChange={(e) => setScaleRoot(Number(e.target.value) as RootNote)}
              className='w-1/3 px-1 py-1 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
            >
              {Array.from({ length: 12 }, (_, i) => i as RootNote).map((n) => (
                <option
                  key={n}
                  value={n}
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
              className='w-2/3 px-1 py-1 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
            >
              {availableScales.map((s) => (
                <option
                  key={s.name}
                  value={s.name}
                >
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className='flex items-center justify-between'>
            <div>
              <label>
                <input
                  type='checkbox'
                  checked={lockToScale}
                  onChange={(e) => setLockToScale(e.target.checked)}
                  id='lockToScale'
                  className='mr-1 accent-gray-800 dark:accent-gray-200'
                />
                Lock to scale
              </label>
            </div>
            <div>
              <label>
                <input
                  type='checkbox'
                  checked={highlightRootNote}
                  onChange={(e) => setHighlightRootNote(e.target.checked)}
                  id='highlightRootNote'
                  className='mr-1 accent-gray-800 dark:accent-gray-200'
                />
                Highlight root note
              </label>
            </div>
          </div>
        </div>
        <div className='mb-4'>
          <label>
            <input
              type='checkbox'
              checked={displayNoteLetter}
              onChange={(e) => setDisplayNoteLetter(e.target.checked)}
              className='mr-1 accent-gray-800 dark:accent-gray-200'
            />
            Display note letter
          </label>
        </div>
        {children}
      </div>
    </div>
  )
}
