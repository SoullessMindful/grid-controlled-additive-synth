import { range } from '../range'
import { CustomWaveform } from '../waveform'

const HARMONICS_COUNT = 64

export const mildSawtoothWaveform: CustomWaveform = {
  name: 'Mild Sawtooth',
  data: [
    new Float32Array(Array(HARMONICS_COUNT + 1).fill(0)),
    new Float32Array([
      0,
      ...range(1, HARMONICS_COUNT).map((n) => (-1) ** n / (n * n)),
    ]),
  ],
}
