import {
  defaultFirstOvertoneEnvelope,
  defaultGlobalEnvelope,
  defaultOvertoneEnvelope,
} from '../envelope'
import { SynthSettingsPreset } from '../synthSettingsPreset'
import { defaultVoices } from '../voice'

export const simpleOrgans: SynthSettingsPreset = {
  name: 'Simple Organs',
  volume: 0.5,
  highpassFilterFrequency: 20,
  lowpassFilterFrequency: 20000,
  voices: defaultVoices,
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
