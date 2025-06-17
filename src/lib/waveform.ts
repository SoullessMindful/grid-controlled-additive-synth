export type CustomWaveform = {
  name: string
  data: [Float32Array, Float32Array]
}

export type BasicWaveform = 'sine' | 'square' | 'triangle' | 'sawtooth'

export type ProcessedWaveform = {
  __type__: 'BasicWaveform'
  name: string
  waveform: BasicWaveform
} | {
  __type__: 'CustomWaveform'
  name: string
  waveform: PeriodicWave
}

const additiveOctaves = (n: number): CustomWaveform => ({
  name: 'Additive Octaves ' + n,
  data: [
    new Float32Array(
      [...Array(2 ** (n - 1) + 1)].map((_, i) =>
        Math.log2(i) % 1 === 0 ? (1 - 1 / (2 ** n - 1)) / i : 0
      )
    ),
    new Float32Array(Array(2 ** (n - 1) + 1).fill(0)),
  ],
})

const imperfectSine: CustomWaveform = {
  name: 'Imperfect Sine',
  data: [
    new Float32Array(Array(33).fill(0)),
    new Float32Array([
      0,
      1,
      ...Array.from({length: 31}, (_, i) => (-1)**(i+1)/((i+2)*(i+2)*64)),
    ]),
  ],
}

export const basicWaveforms: ProcessedWaveform[] = [
  {
    __type__: 'BasicWaveform',
    name: 'Sine',
    waveform: 'sine',
  },
  {
    __type__: 'BasicWaveform',
    name: 'Square',
    waveform: 'square',
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
]

export const customWaveforms: CustomWaveform[] = [
  imperfectSine,
  additiveOctaves(3),
  additiveOctaves(4),
  additiveOctaves(5),
]
