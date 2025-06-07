import React from 'react'

type HorizontalSliderProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  exponential?: boolean
  minExp?: number // only for exponential, in seconds (e.g. 0.001)
  maxExp?: number // only for exponential, in seconds (e.g. 1)
  className?: string
}

export default function HorizontalSlider({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  exponential = false,
  minExp = 0.001,
  maxExp = 1,
  className = '',
}: HorizontalSliderProps) {
  const toSlider = (v: number) =>
    exponential ? Math.log(v / minExp) / Math.log(maxExp / minExp) : v
  const fromSlider = (s: number) =>
    exponential ? minExp * Math.pow(maxExp / minExp, s) : s

  const sliderValue = exponential ? toSlider(value) : value

  const sliderMin = exponential ? 0 : min
  const sliderMax = exponential ? 1 : max
  const sliderStep = exponential ? 0.01 : step

  return (
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
      className={`w-15 ${className}`}
    />
  )
}
