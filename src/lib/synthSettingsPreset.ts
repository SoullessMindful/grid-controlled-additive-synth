import {
  defaultFirstOvertoneEnvelope,
  defaultGlobalEnvelope,
  defaultOvertoneEnvelope,
  Envelope,
} from './envelope'
import { FilterParameters } from './filterParameters'

export type SynthSettingsPreset = {
  name: string
  volume: number
  globalEnvelope: Envelope
  waveformName: string
  overtoneEnvelopes: Envelope[]
  filterParameters: FilterParameters
}

const clearPreset: SynthSettingsPreset = {
  name: 'Clear',
  volume: 0.5,
  globalEnvelope: defaultGlobalEnvelope,
  waveformName: 'Sine',
  overtoneEnvelopes: [defaultFirstOvertoneEnvelope],
  filterParameters: {
    type: undefined,
    frequency: {
      value: 800,
      modulation: undefined,
    },
    Q: {
      value: 1.4,
      modulation: undefined,
    },
  },
}

const simpleBass: SynthSettingsPreset = {
  name: 'Simple Bass',
  volume: 0.5,
  globalEnvelope: {
    level: 0.4,
    attack: 0.01,
    decay: 4,
    sustain: 0.25,
    release: 0.01,
  },
  waveformName: 'Sine',
  overtoneEnvelopes: [
    {
      level: 0.5,
      attack: 0.02,
      decay: 0.001,
      sustain: 1,
      release: 10,
    },
    {
      level: 0.25,
      attack: 0.01,
      decay: 0.001,
      sustain: 1,
      release: 10,
    },
    {
      level: 0.5,
      attack: 0.01,
      decay: 0.001,
      sustain: 1,
      release: 10,
    },
    {
      level: 0.75,
      attack: 0.01,
      decay: 0.001,
      sustain: 1,
      release: 10,
    },
    {
      level: 1,
      attack: 0.01,
      decay: 0.001,
      sustain: 1,
      release: 10,
    },
    {
      level: 0.75,
      attack: 0.01,
      decay: 0.001,
      sustain: 1,
      release: 10,
    },
    {
      level: 0.5,
      attack: 0.01,
      decay: 0.001,
      sustain: 1,
      release: 10,
    },
    {
      level: 0.25,
      attack: 0.01,
      decay: 0.001,
      sustain: 1,
      release: 10,
    },
    {
      level: 0.1,
      attack: 0.001,
      decay: 0.3,
      sustain: 0.01,
      release: 10,
    },
    {
      level: 0.1,
      attack: 0.001,
      decay: 0.3,
      sustain: 0.01,
      release: 10,
    },
    {
      level: 0.1,
      attack: 0.001,
      decay: 0.3,
      sustain: 0.01,
      release: 10,
    },
    {
      level: 0.1,
      attack: 0.001,
      decay: 0.3,
      sustain: 0.01,
      release: 10,
    },
    {
      level: 0.1,
      attack: 0.001,
      decay: 0.3,
      sustain: 0.01,
      release: 10,
    },
    {
      level: 0.1,
      attack: 0.001,
      decay: 0.3,
      sustain: 0.01,
      release: 10,
    },
    {
      level: 0.1,
      attack: 0.001,
      decay: 0.3,
      sustain: 0.01,
      release: 10,
    },
    {
      level: 0.1,
      attack: 0.001,
      decay: 0.3,
      sustain: 0.01,
      release: 10,
    },
  ],
  filterParameters: {
    type: 'lowpass',
    frequency: {
      value: 200,
      modulation: {
        level: 10000,
        attack: 0.016,
        decay: 300,
        sustain: 4000,
        release: 0.001,
      },
    },
    Q: {
      value: 1.4,
      modulation: undefined,
    },
  },
}

const simpleOrgans: SynthSettingsPreset = {
  name: 'Simple Organs',
  volume: 0.5,
  globalEnvelope: defaultGlobalEnvelope,
  waveformName: 'Additive Octaves 5',
  overtoneEnvelopes: [
    defaultFirstOvertoneEnvelope,
    defaultOvertoneEnvelope,
    { level: 0.2, attack: 0.001, decay: 0.001, sustain: 1, release: 10 },
  ],
  filterParameters: {
    type: undefined,
    frequency: {
      value: 800,
      modulation: undefined,
    },
    Q: {
      value: 1.4,
      modulation: undefined,
    },
  },
}

export const availablePresets = [clearPreset, simpleBass, simpleOrgans]
