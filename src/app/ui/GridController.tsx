'use client'

import { useContext } from 'react'
import {
  MainAppContext,
  MainAppContextType,
} from '../context/MainAppContextProvider'
import { range2dFlat } from '@/lib/range'

export default function GridController() {
  const { noteOffset, rowsCount, columnsCount } = useContext(
    MainAppContext
  ) as MainAppContextType

  return (
    <div
      className='grid'
      style={{
        gridTemplateRows: `repeat(${rowsCount}, 1fr)`,
        gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
        width: `${columnsCount * 4}rem`,
        height: `${rowsCount * 4}rem`,
      }}
    >
      {range2dFlat([0, rowsCount], [0, columnsCount]).map(([row, column]) => {
        const note = noteOffset + row * 5 + column
        return (
          <div
            key={`${row}-${column}`}
            className='pointer-events-none p-0 m-0'
            style={{
              gridRow: rowsCount - row,
              gridColumn: column + 1,
              backgroundColor: `hsl(${(note * 30) % 360}, 100%, 50%)`,
            }}
          >
            {note}
          </div>
        )
      })}
    </div>
  )
}
