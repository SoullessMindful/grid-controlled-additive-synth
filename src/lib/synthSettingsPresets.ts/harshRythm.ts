import {
  defaultFirstOvertoneEnvelope,
  defaultOvertoneEnvelope,
} from '../envelope'
import { defaultFilterParameters } from '../filterParameters'
import { defaultOctave } from '../octave'
import { SynthSettingsPreset } from '../synthSettingsPreset'

export const harshRythm: SynthSettingsPreset = {
  name: 'Harsh Rhythm',
  volume: 0.5,
  highpassFilterFrequency: 80,
  lowpassFilterFrequency: 20000,
  octave: defaultOctave,
  voices: [
    {
      active: true,
      level: 1,
      pan: -1,
      detune: -5,
      delay: 0,
      flipPhase: false,
    },
    {
      active: true,
      level: 1,
      pan: 1,
      detune: 5,
      delay: 0.02,
      flipPhase: true,
    },
  ],
  globalEnvelope: {
    level: 0.5,
    attack: 0.001,
    decay: 0.1,
    sustain: 0.8,
    release: 0.01,
  },
  waveformName: 'Sawtooth',
  overtoneEnvelopes: [
    defaultFirstOvertoneEnvelope,
    {
      ...defaultOvertoneEnvelope,
      level: 0.075,
    },
    {
      ...defaultOvertoneEnvelope,
      level: 0.15,
      flipPhase: true,
    },
    {
      ...defaultOvertoneEnvelope,
      level: 0.225,
    },
    {
      ...defaultOvertoneEnvelope,
      level: 0.3,
      flipPhase: true,
    },
    {
      ...defaultOvertoneEnvelope,
      level: 0.225,
    },
    {
      ...defaultOvertoneEnvelope,
      level: 0.15,
      flipPhase: true,
    },
    {
      ...defaultOvertoneEnvelope,
      level: 0.05,
    },
  ],
  filterParameters: {
    ...defaultFilterParameters,
    frequency: {
      value: 20,
      modulation: {
        level: 20000,
        attack: 0.02,
        decay: 0.321,
        sustain: 10000,
        release: 0.001,
      }
    }
  }
}
