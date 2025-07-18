import {
  defaultFirstOvertoneEnvelope,
  defaultGlobalEnvelope,
} from '../envelope'
import { defaultFilterParameters } from '../filterParameters'
import { defaultOctave } from '../octave'
import { SynthSettingsPreset } from '../synthSettingsPreset'
import { defaultVoices } from '../voice'

export const clearPreset: SynthSettingsPreset = {
  name: 'Clear',
  volume: 0.5,
  highpassFilterFrequency: 20,
  lowpassFilterFrequency: 20000,
  octave: defaultOctave,
  voices: defaultVoices,
  globalEnvelope: defaultGlobalEnvelope,
  waveformName: 'Sine',
  overtoneEnvelopes: [defaultFirstOvertoneEnvelope],
  filterParameters: defaultFilterParameters,
  effectChainSettings: [],
}
