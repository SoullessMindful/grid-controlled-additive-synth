import React, { useContext } from 'react'
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
import { XMarkIcon } from '@heroicons/react/24/solid'
import { CheckButton } from './CheckButton'

type GridMenuProps = {
  open: boolean
  onClose: () => void
  children?: React.ReactNode
}

export default function SettingsMenu({
  open,
  onClose,
  children,
}: GridMenuProps) {
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
      className={`absolute top-0 left-0 z-30 flex flex-row justify-center h-full w-full sm:w-40 bg-gray-100 dark:bg-gray-900 
        shadow-lg transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <button
        className='absolute top-0 right-0 p-1'
        onClick={onClose}
      >
        <XMarkIcon className='size-2' />
      </button>
      <div className='w-20 p-1'>
        <div className='w-full text-center text-2xl font-bold mb-2'>Grid</div>
        <div className='mb-2'>
          <div className='inline-block w-1/2 pr-0.5'>
            <label className='block mb-1'>Rows</label>
            <select
              value={rowsCount}
              onChange={(e) => setRowsCount(Number(e.target.value))}
              className='w-full px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
            >
              {Array.from({ length: 8 - 3 + 1 }, (_, i) => 3 + i).map((n) => (
                <option
                  key={n}
                  value={n}
                >
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className='inline-block w-1/2 pl-0.5'>
            <label className='block mb-1'>Columns</label>
            <select
              value={columnsCount}
              onChange={(e) => setColumnsCount(Number(e.target.value))}
              className='w-full px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
            >
              {Array.from({ length: 13 - 5 + 1 }, (_, i) => 5 + i).map((n) => (
                <option
                  key={n}
                  value={n}
                >
                  {n}
                </option>
              ))}
            </select>
          </div>
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
          <div className='mb-1'>
            <div className='inline-block sm:w-1/3 w-full sm:pr-0.5 pr-0 mb-1 sm:mb-0'>
              <select
                value={scaleRoot}
                onChange={(e) =>
                  setScaleRoot(Number(e.target.value) as RootNote)
                }
                className='w-full px-1 py-1 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
              >
                {Array.from({ length: 12 }, (_, i) => i as RootNote).map(
                  (n) => (
                    <option
                      key={n}
                      value={n}
                    >
                      {rootNoteToString(n)}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className='inline-block sm:w-2/3 w-full sm:pl-0.5 pl-0'>
              <select
                value={scale?.name}
                onChange={(e) => {
                  const selected = availableScales.find(
                    (s) => s.name === e.target.value
                  )
                  if (selected) setScale(selected)
                }}
                className='w-full px-1 py-1 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
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
          </div>
          <div className='mb-1'>
            <label>
              <CheckButton
                value={lockToScale ?? false}
                onChange={setLockToScale}
              />
              <span className='ml-0.5'>Lock to scale</span>
            </label>
          </div>
          <div className='mb-1'>
            <label>
              <CheckButton
                value={highlightRootNote ?? false}
                onChange={setHighlightRootNote}
              />
              <span className='ml-0.5'>Highlight root note</span>
            </label>
          </div>
          <div className='mb-1'>
            <label>
              <CheckButton
                value={displayNoteLetter ?? false}
                onChange={setDisplayNoteLetter}
              />
              <span className='ml-0.5'>Display note letter</span>
            </label>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
