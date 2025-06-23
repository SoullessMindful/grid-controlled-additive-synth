import {
  defaultFirstOvertoneEnvelope,
  defaultGlobalEnvelope,
} from '../envelope'
import { SynthSettingsPreset } from '../synthSettingsPreset'
import { defaultVoices } from '../voice'

export const clearPreset: SynthSettingsPreset = {
  name: 'Clear',
  volume: 0.5,
  highpassFilterFrequency: 20,
  lowpassFilterFrequency: 20000,
  voices: defaultVoices,
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
