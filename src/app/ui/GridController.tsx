'use client'

import { Touch, useContext, useEffect, useRef, useState } from 'react'
import {
  MainAppContext,
  MainAppContextType,
} from '../context/MainAppContextProvider'
import { range2dFlat } from '@/lib/range'
import useStatePrev from '@/hooks/useStatePrev'

export default function GridController() {
  const { noteOffset, rowsCount, columnsCount } = useContext(
    MainAppContext
  ) as MainAppContextType

  const [touches, setTouches] = useState<Touch[]>([])
  const [isPadPressed, _isPadPressedPrev, setIsPadPressed] = useStatePrev<
    boolean[][]
  >(
    Array(rowsCount)
      .fill(false)
      .map(() => Array(columnsCount).fill(false))
  )
  const [padSize, _setPadSize] = useState(6) // Size of each pad in rem

  const selfRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsPadPressed(
      Array(rowsCount)
        .fill(false)
        .map(() => Array(columnsCount).fill(false))
    )
  }, [rowsCount, columnsCount])

  useEffect(() => {
    const self = selfRef.current
    if (!self) return

    const pressedPads = touches.map((touch) => {
      const row = Math.floor(
        ((self.getBoundingClientRect().bottom - touch.pageY) /
          self.clientHeight) *
          rowsCount
      )
      const column = Math.floor(
        ((touch.pageX - self.getBoundingClientRect().left) / self.clientWidth) *
          columnsCount
      )

      return { row, column }
    })

    const updatedIsPadPressed = isPadPressed.map((row) => row.map(() => false))
    let isUpdated = false

    for (let row = 0; row < rowsCount; row++) {
      for (let column = 0; column < columnsCount; column++) {
        updatedIsPadPressed[row][column] = pressedPads.some(
          (pad) => pad.row === row && pad.column === column
        )

        if (isPadPressed[row][column] !== updatedIsPadPressed[row][column]) {
          isUpdated = true
        }
      }
    }

    if (isUpdated) {
      setIsPadPressed(updatedIsPadPressed)
    }
  }, [touches])

  return (
    <div
      ref={selfRef}
      className='grid'
      style={{
        gridTemplateRows: `repeat(${rowsCount}, 1fr)`,
        gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
        width: `${columnsCount * padSize}rem`,
        height: `${rowsCount * padSize}rem`,
      }}
      onTouchStart={(e) => {
        e.preventDefault()
        setTouches(Array.from(e.targetTouches))
      }}
      onTouchEnd={(e) => {
        e.preventDefault()
        setTouches(Array.from(e.targetTouches))
      }}
      onTouchCancel={(e) => {
        e.preventDefault()
        setTouches(Array.from(e.targetTouches))
      }}
      onTouchMove={(e) => {
        e.preventDefault()
        const changedTouches = Array.from(e.changedTouches)
        if (changedTouches.length === 0) return

        let isUpdated = false
        const updatedTouches = [...touches]

        changedTouches.forEach((ct) => {
          const i = touches.findIndex((t) => t.identifier === ct.identifier)

          if (i === -1) {
            updatedTouches.push(ct)
            isUpdated = true
          } else if (
            touches[i].pageX !== ct.pageX ||
            touches[i].pageY !== ct.pageY
          ) {
            updatedTouches[i] = ct
            isUpdated = true
          }
        })

        if (isUpdated) {
          setTouches(updatedTouches)
        }
      }}
    >
      {range2dFlat([0, rowsCount], [0, columnsCount]).map(([row, column]) => {
        const note = noteOffset + row * 5 + column
        const isPressed = isPadPressed[row][column]

        return (
          <div
            key={`${row}-${column}`}
            className='pointer-events-none p-0 m-0'
            style={{
              gridRow: rowsCount - row,
              gridColumn: column + 1,
              backgroundColor: `hsl(${(note * 30) % 360}, ${
                isPressed ? 100 : 20
              }%, ${isPressed ? 70 : 50}%)`,
            }}
          ></div>
        )
      })}
    </div>
  )
}
