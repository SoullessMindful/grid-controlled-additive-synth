import { CustomWaveform } from '../waveform'

export const additiveOctavesWaveform = (n: number): CustomWaveform => ({
  name: 'Additive Octaves ' + n,
  data: [
    new Float32Array(Array(2 ** (n - 1) + 1).fill(0)),
    new Float32Array(
      [...Array(2 ** (n - 1) + 1)].map((_, i) =>
        Math.log2(i) % 1 === 0 ? (1 - 1 / (2 ** n - 1)) / i : 0
      )
    ),
  ],
})
