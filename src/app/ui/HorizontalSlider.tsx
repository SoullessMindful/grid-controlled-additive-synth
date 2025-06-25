import React from 'react'
import './horizontalSlider.css'
import { Bungee_Inline } from 'next/font/google'

type HorizontalSliderProps = {
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
  className: string
}

export default function HorizontalSlider({
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
  className,
}: HorizontalSliderProps) {
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

  const trackGoesRight = percent > trackCenterPercent

  const [trackLeft, trackWidth] = trackGoesRight
    ? [trackCenterPercent, percent - trackCenterPercent]
    : [percent, trackCenterPercent - percent]

  return (
    <div className={`relative ${className}`}>
      <div className='absolute left-0 top-0 h-full w-full bg-gray-100 rounded-xl overflow-clip pointer-events-none'>
        {trackCenterPercent === 0 && (
          <div
            className='absolute left-0  h-full bg-blue-400'
            style={{
              width: 'calc(var(--thumb-width)/2)',
            }}
          ></div>
        )}
        {trackCenterPercent === 100 && (
          <div
            className='absolute right-0  h-full bg-blue-400'
            style={{
              width: 'calc(var(--thumb-width)/2)',
            }}
          ></div>
        )}
        <div
          className='relative h-full'
          style={{
            left: 'calc(var(--thumb-width)/2)',
            width: 'calc(100% - var(--thumb-width))',
          }}
        >
          <div
            className={`absolute top-0 h-full bg-blue-400 pointer-events-none`}
            style={{
              left: `${trackLeft}%`,
              width: `${trackWidth}%`,
            }}
          ></div>
        </div>
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
        className={`horizontal-slider h-full w-full`}
      />
    </div>
  )
}
