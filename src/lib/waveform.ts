import { NoiseType } from './audioNodes/NoiseNode'
import { additiveOctavesWaveform } from './waveforms/additiveOctaves'
import { harshTriangleWaveform } from './waveforms/harshTriangle'
import { imperfectSineWaveform } from './waveforms/imperfectSine'
import { mildSawtoothWaveform } from './waveforms/mildSawtooth'
import { mildSquareWaveform } from './waveforms/mildSquare'

export type CustomWaveform = {
  name: string
  data: [Float32Array, Float32Array]
}

export type BasicWaveform = 'sine' | 'square' | 'triangle' | 'sawtooth'

export type ProcessedWaveform =
  | {
      __type__: 'BasicWaveform'
      name: string
      waveform: BasicWaveform
    }
  | {
      __type__: 'CustomWaveform'
      name: string
      waveform: PeriodicWave
    }
  | {
      __type__: 'NoiseWaveform'
      name: string
      noiseType: NoiseType
      Q: number
    }

export const basicWaveforms: ProcessedWaveform[] = [
  {
    __type__: 'BasicWaveform',
    name: 'Sine',
    waveform: 'sine',
  },
  {
    __type__: 'BasicWaveform',
    name: 'Triangle',
    waveform: 'triangle',
  },
  {
    __type__: 'BasicWaveform',
    name: 'Sawtooth',
    waveform: 'sawtooth',
  },
  {
    __type__: 'BasicWaveform',
    name: 'Square',
    waveform: 'square',
  },
  {
    __type__: 'NoiseWaveform',
    name: 'Filtered Pink Noise',
    noiseType: 'pink',
    Q: 1.4,
  },
  {
    __type__: 'NoiseWaveform',
    name: 'Filtered White Noise',
    noiseType: 'white',
    Q: 1.4,
  },
]

export const customWaveforms: CustomWaveform[] = [
  imperfectSineWaveform,
  harshTriangleWaveform,
  mildSawtoothWaveform,
  mildSquareWaveform,
  additiveOctavesWaveform(3),
  additiveOctavesWaveform(4),
  additiveOctavesWaveform(5),
]
