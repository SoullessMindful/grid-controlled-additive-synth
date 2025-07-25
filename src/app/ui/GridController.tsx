'use client'

import { Touch, useContext, useEffect, useRef, useState } from 'react'
import {
  MainAppContext,
  MainAppContextType,
} from '../context/MainAppContextProvider'
import { range2dFlat } from '@/lib/range'
import {
  SoundEngineContext,
  SoundEngineContextType,
} from '../context/SoundEngineContextProvider'
import { isNoteInScale, RootNote, rootNoteToString } from '../../lib/scale'

export default function GridController() {
  const {
    noteOffset,
    rowsCount,
    columnsCount,
    padSize,
    scale,
    scaleRoot,
    lockToScale,
    highlightRootNote,
    displayNoteLetter,
  } = useContext(MainAppContext) as MainAppContextType

  const { padNoteOn, padNoteOff, mouseNoteOn, mouseNoteOff } = useContext(
    SoundEngineContext
  ) as SoundEngineContextType

  const [touches, setTouches] = useState<Touch[]>([])
  const [clickedPad, setClickedPad] = useState<
    { row: number; column: number } | undefined
  >(undefined)
  const [mousePressed, setMousePressed] = useState<boolean>(false)
  const [isPadPressed, setIsPadPressed] = useState<
    boolean[][]
  >([...Array(rowsCount)].map(() => Array(columnsCount).fill(false)))

  const selfRef = useRef<HTMLDivElement>(null)

  const initialized =
    rowsCount !== undefined &&
    columnsCount !== undefined &&
    noteOffset !== undefined &&
    padSize !== undefined &&
    scale !== undefined &&
    scaleRoot !== undefined &&
    highlightRootNote !== undefined &&
    lockToScale !== undefined &&
    displayNoteLetter !== undefined

  useEffect(() => {
    setIsPadPressed(
      [...Array(rowsCount)].map(() => Array(columnsCount).fill(false))
    )
  }, [rowsCount, columnsCount])

  useEffect(() => {
    if (!initialized) return

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
          const note = noteOffset + row * 5 + column
          const isPressed = updatedIsPadPressed[row][column]
          const canPlay = isNoteInScale(note, scale, scaleRoot) || !lockToScale
          if (isPressed && canPlay) {
            padNoteOn(row, column)
          } else {
            padNoteOff(row, column)
          }
        }
      }
    }

    if (isUpdated) {
      setIsPadPressed(updatedIsPadPressed)
    }
  }, [touches])

  useEffect(() => {
    if (!initialized) return

    if (clickedPad) {
      const { row, column } = clickedPad
      const note = noteOffset + row * 5 + column
      const canPlay = isNoteInScale(note, scale, scaleRoot) || !lockToScale

      if (canPlay) {
        mouseNoteOn(row, column)
      }
    } else {
      mouseNoteOff()
    }
  }, [clickedPad])

  const handleNoteOff = () => {
    setMousePressed(false)
    setClickedPad(undefined)
    mouseNoteOff()
  }

  useEffect(() => {
    if (!mousePressed) return
    window.addEventListener('mouseup', handleNoteOff)
    return () => window.removeEventListener('mouseup', handleNoteOff)
  }, [mousePressed])

  return (
    initialized && (
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
        onMouseDown={(e) => {
          e.preventDefault()

          setMousePressed(true)

          if (!initialized) return

          const self = selfRef.current
          if (!self) return

          const row = Math.floor(
            ((self.getBoundingClientRect().bottom - e.pageY) /
              self.clientHeight) *
              rowsCount
          )
          const column = Math.floor(
            ((e.pageX - self.getBoundingClientRect().left) / self.clientWidth) *
              columnsCount
          )

          setClickedPad({ row, column })
        }}
        onMouseUp={(e) => {
          e.preventDefault()
          handleNoteOff()
        }}
        onMouseOut={(e) => {
          e.preventDefault()
          handleNoteOff()
        }}
        onMouseLeave={(e) => {
          e.preventDefault()
          handleNoteOff()
        }}
      >
        {range2dFlat([0, rowsCount], [0, columnsCount]).map(([row, column]) => {
          const note = noteOffset + row * 5 + column
          const isPressed =
            (clickedPad?.row === row && clickedPad.column === column) ||
            (isPadPressed[row]?.[column] ?? false)

          const isInScale = isNoteInScale(note, scale, scaleRoot)
          const isGreyed = !isInScale && (!isPressed || lockToScale)
          const isRootNote = (note - scaleRoot) % 12 === 0

          return (
            <div
              key={`${row}-${column}`}
              className={`pointer-events-none p-0 m-0${
                highlightRootNote && isRootNote
                  ? ' inset-ring-3 inset-ring-amber-400/50'
                  : ''
              }`}
              style={{
                gridRow: rowsCount - row,
                gridColumn: column + 1,
                backgroundColor: `hsl(
                ${(note * 30) % 360},
                ${isGreyed ? 0 : isPressed ? 100 : 20}%,
                ${isPressed && !isGreyed ? 70 : 50}%)`,
              }}
            >
              {displayNoteLetter && !isGreyed && (
                <div
                  className='text-center text-2xl font-bold text-gray-800 dark:text-gray-200 pointer-events-none select-none'
                  style={{
                    lineHeight: `${padSize}rem`,
                  }}
                >
                  {rootNoteToString((note % 12) as RootNote)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  )
}
