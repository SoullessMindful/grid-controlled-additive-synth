import { defaultFirstOvertoneEnvelope } from '../envelope'
import { defaultFilterParameters } from '../filterParameters'
import { defaultOctave } from '../octave'
import { SynthSettingsPreset } from '../synthSettingsPreset'
import { defaultVoices } from '../voice'

export const simplePercussive: SynthSettingsPreset = {
  name: 'Simple Percussive',
  volume: 0.8,
  highpassFilterFrequency: 20,
  lowpassFilterFrequency: 20000,
  octave: defaultOctave,
  voices: defaultVoices,
  globalEnvelope: {
    level: 1,
    attack: 0.003,
    decay: 0.437,
    sustain: 0,
    release: 0.437,
  },
  waveformName: 'Filtered Pink Noise',
  waveformQ: 1.4,
  overtoneEnvelopes: [defaultFirstOvertoneEnvelope],
  filterParameters: defaultFilterParameters,
}
