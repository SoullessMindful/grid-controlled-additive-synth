import { CustomWaveform } from '../waveform'
import { harshTriangleWaveform } from './harshTriangle'
import { mildSawtoothWaveform } from './mildSawtooth'

const HARMONICS_COUNT = 64

export const imperfectSineWaveform: CustomWaveform = {
  name: 'Imperfect Sine',
  data: [
    new Float32Array(Array(HARMONICS_COUNT + 1).fill(0)),
    new Float32Array([
      ...[0, -1, ...Array(HARMONICS_COUNT - 1).fill(0)].map(
        (v, n) => v + mildSawtoothWaveform.data[1][n] / 64 + harshTriangleWaveform.data[1][n] / 512
      ),
    ]),
  ],
}
