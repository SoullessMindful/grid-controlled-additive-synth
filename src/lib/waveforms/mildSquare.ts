import { range } from '../range'
import { CustomWaveform } from '../waveform'

const HARMONICS_COUNT = 64

export const mildSquareWaveform: CustomWaveform = {
  name: 'Mild Square',
  data: [
    new Float32Array(Array(HARMONICS_COUNT + 1).fill(0)),
    new Float32Array([
      0,
      ...range(1, HARMONICS_COUNT / 2).flatMap((n) => {
        const k = 2 * n - 1
        return [(-1) ** k / (k * k), 0]
      }),
    ]),
  ],
}
