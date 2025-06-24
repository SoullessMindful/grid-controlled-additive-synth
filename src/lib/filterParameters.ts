import { Envelope } from './envelope'

export type FilterParameter = {
  value: number
  modulation: Envelope | undefined
}
export type FilterType = 'lowpass' | 'highpass' | 'bandpass' | 'notch' | 'allpass' | undefined
export type FilterParameters = {
  type: FilterType
  Q: FilterParameter
  frequency: FilterParameter
  mix: number
}

export const defaultFilterParameters: FilterParameters = {
  type: undefined,
  Q: {
    value: 1.4,
    modulation: undefined,
  },
  frequency: {
    value: 800,
    modulation: undefined,
  },
  mix: 1,
} as const
