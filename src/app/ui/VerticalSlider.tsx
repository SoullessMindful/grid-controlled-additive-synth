import React, { useState } from 'react'
import './verticalSlider.css'

type VerticalSliderProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  trackCenter?: number
  step?: number
  exponential?: boolean
  minExp?: number
  maxExp?: number
  trackCenterExp?: number
  tooltip?: boolean | ((value: number) => string)
  className?: string
}

export default function VerticalSlider({
  value,
  onChange,
  min = 0,
  max = 1,
  trackCenter = min,
  step = 0.01,
  exponential = false,
  minExp = 0.001,
  maxExp = 1,
  trackCenterExp = minExp,
  tooltip,
  className = '',
}: VerticalSliderProps) {
  const [isActive, setIsActive] = useState(false)

  const toSlider = (v: number) =>
    exponential ? Math.log(v / minExp) / Math.log(maxExp / minExp) : v
  const fromSlider = (s: number) =>
    exponential ? minExp * Math.pow(maxExp / minExp, s) : s

  const sliderValue = exponential ? toSlider(value) : value
  const trackCenterValue = exponential ? toSlider(trackCenterExp) : trackCenter

  const sliderMin = exponential ? 0 : min
  const sliderMax = exponential ? 1 : max
  const sliderStep = exponential ? 0.01 : step

  const percent = (100 * (sliderValue - sliderMin)) / (sliderMax - sliderMin)
  const trackCenterPercent =
    (100 * (trackCenterValue - sliderMin)) / (sliderMax - sliderMin)

  const trackGoesUp = percent > trackCenterPercent

  const [trackDown, trackHeight] = trackGoesUp
    ? [trackCenterPercent, percent - trackCenterPercent]
    : [percent, trackCenterPercent - percent]

  return (
    <div className={`relative inline-block ${className}`}>
      <div className='absolute left-0 top-0 h-full w-full inset-ring-2 inset-ring-gray-300 bg-gray-100 rounded-xl overflow-clip pointer-events-none'>
        {trackCenterPercent === 0 && (
          <div
            className='absolute bottom-0  w-full bg-blue-400'
            style={{
              height: 'calc(var(--thumb-height)/2)',
            }}
          ></div>
        )}
        {trackCenterPercent === 100 && (
          <div
            className='absolute top-0  w-full bg-blue-400'
            style={{
              height: 'calc(var(--thumb-height)/2)',
            }}
          ></div>
        )}
        <div
          className='relative w-full'
          style={{
            top: 'calc(var(--thumb-height)/2)',
            height: 'calc(100% - var(--thumb-height))',
          }}
        >
          <div
            className={`absolute left-0 w-full bg-blue-400 pointer-events-none`}
            style={{
              bottom: `${trackDown}%`,
              height: `${trackHeight}%`,
            }}
          ></div>
        </div>
      </div>
      <div
        className='absolute w-full'
        style={{
          top: 'calc(var(--thumb-height)/2)',
          height: 'calc(100% - var(--thumb-height))',
        }}
      >
        {tooltip && isActive && (
          <div
            className='absolute left-1/2 rounded px-0.5 py-0.25 bg-gray-50 dark:bg-gray-950 -translate-x-1/2 pointer-events-none whitespace-nowrap'
            style={{
              bottom: `calc(${percent}% + var(--thumb-height))`,
            }}
          >
            {tooltip === true ? value : tooltip(value)}
          </div>
        )}
      </div>
      <input
        type='range'
        min={sliderMin}
        max={sliderMax}
        step={sliderStep}
        value={sliderValue}
        onChange={(e) => {
          const v = parseFloat(e.target.value)
          onChange(fromSlider(v))
        }}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        onTouchStart={() => setIsActive(true)}
        onTouchEnd={() => setIsActive(false)}
        onBlur={() => setIsActive(false)}
        className={`vertical-slider w-full ${className}`}
      />
    </div>
  )
}
