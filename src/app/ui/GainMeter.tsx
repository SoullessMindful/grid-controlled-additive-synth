import { useContext } from 'react'
import {
  SoundEngineContext,
  SoundEngineContextType,
} from '../context/SoundEngineContextProvider'
import { range } from '@/lib/range'

const INTERVAL = 3
const BLOCK_COUNT = 10

export default function GainMeter() {
  const { meter } = useContext(SoundEngineContext) as SoundEngineContextType

  const filledCount = Math.max(
    Math.min(Math.floor(meter / INTERVAL), 0) + BLOCK_COUNT,
    0
  )

  return (
    <div className='w-full flex flex-row justify-center'>
      {range(0, filledCount).map((i) => (
        <div
          className='w-1 h-2 rounded-sm'
          style={{
            backgroundColor: `hsl(${
              120 - (i * 90) / (BLOCK_COUNT - 1)
            }, 50%, 50%)`,
          }}
          key={`meterblock ${i}`}
        ></div>
      ))}
      {filledCount < BLOCK_COUNT && (
        <div className='w-1 h-2 bg-gray-500 rounded-sm overflow-clip'>
          <div
            className='h-full'
            style={{
              width: `${
                Math.max(0, meter / 3 + BLOCK_COUNT - filledCount) * 100
              }%`,
              backgroundColor: `hsl(${
                120 - (filledCount * 90) / (BLOCK_COUNT - 1)
              }, 50%, 50%)`,
            }}
          ></div>
        </div>
      )}
      {filledCount < BLOCK_COUNT - 1 &&
        range(filledCount + 1, BLOCK_COUNT - filledCount - 1).map((i) => (
          <div
            className='w-1 h-2 bg-gray-500 rounded-sm'
            key={`meterblock ${i}`}
          ></div>
        ))}
      <div
        className={`w-2 h-2 ml-0.5 rounded-4xl ${
          meter >= 0 ? 'bg-red-500' : 'bg-gray-500'
        } border-2 border-gray-500`}
      ></div>
    </div>
  )
}
