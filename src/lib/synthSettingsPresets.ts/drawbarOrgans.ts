import {
  defaultFirstOvertoneEnvelope,
  defaultGlobalEnvelope,
  Envelope,
} from '../envelope'
import { defaultFilterParameters } from '../filterParameters'
import { SynthSettingsPreset } from '../synthSettingsPreset'

const inactiveOvertoneEnvelope: Envelope = {
  level: 0,
  attack: 0.001,
  decay: 0.001,
  sustain: 0,
  release: 0.001,
}

const halfOfDefaultFirstOvertoneEnvelope: Envelope = {
  ...defaultFirstOvertoneEnvelope,
  level: 0.5,
}

export const drawbarOrgans: SynthSettingsPreset = {
  name: 'Drawbar Organs',
  volume: 0.5,
  highpassFilterFrequency: 40,
  lowpassFilterFrequency: 4000,
  octave: -1,
  voices: [
    {
      level: 0.75,
      detune: -8,
      pan: 0,
      delay: 0,
      active: true,
      flipPhase: false,
    },
    {
      level: 0.75,
      detune: 8,
      pan: 0,
      delay: 0.002,
      active: true,
      flipPhase: false,
    },
  ],
  globalEnvelope: { ...defaultGlobalEnvelope, level: 0.2 },
  waveformName: 'Imperfect Sine',
  overtoneEnvelopes: [
    halfOfDefaultFirstOvertoneEnvelope, // 1 -> 16
    defaultFirstOvertoneEnvelope, // 2 -> 8
    halfOfDefaultFirstOvertoneEnvelope, // 3 -> 5 + 1/3
    defaultFirstOvertoneEnvelope, // 4 -> 4
    inactiveOvertoneEnvelope, // 5
    halfOfDefaultFirstOvertoneEnvelope, // 6 -> 2 + 2/3
    inactiveOvertoneEnvelope, // 7
    defaultFirstOvertoneEnvelope, // 8 -> 2
    inactiveOvertoneEnvelope, // 9
    halfOfDefaultFirstOvertoneEnvelope, // 10 -> 1 + 3/5
    inactiveOvertoneEnvelope, // 11
    halfOfDefaultFirstOvertoneEnvelope, // 12 -> 1 + 1/3
    inactiveOvertoneEnvelope, // 13
    inactiveOvertoneEnvelope, // 14
    inactiveOvertoneEnvelope, // 15
    defaultFirstOvertoneEnvelope, // 16
  ],
  filterParameters: defaultFilterParameters,
  effectChainSettings: [],
}
