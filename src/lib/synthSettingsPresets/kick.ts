import { defaultFirstOvertoneEnvelope } from '../envelope'
import { defaultOctave } from '../octave'
import { SynthSettingsPreset } from '../synthSettingsPreset'
import { defaultVoices } from '../voice'

export const kickPreset: SynthSettingsPreset = {
  name: 'Kick',
  volume: 1,
  highpassFilterFrequency: 20,
  lowpassFilterFrequency: 20000,
  octave: defaultOctave,
  voices: defaultVoices,
  globalEnvelope: {
    level: 1,
    attack: 0.001,
    decay: 0.2,
    sustain: 0.02,
    release: 0.1,
  },
  waveformName: 'Filtered Pink Noise',
  waveformQ: 0.1,
  overtoneEnvelopes: [defaultFirstOvertoneEnvelope],
  filterParameters: {
    type: 'bandpass',
    frequency: {
      value: 20,
      modulation: {
        level: 4600,
        attack: 0.005,
        decay: 0.02,
        sustain: 50,
        release: 0.001,
      },
    },
    Q: {
      value: 1.4,
      modulation: undefined,
    },
    mix: {
      value: 1,
      modulation: undefined,
    },
  },
  effectChainSettings: [
    {
      __type__: 'eq',
      active: true,
      lowShelfFreq: 200,
      lowShelfGain: 15,
      midBandFreq: 800,
      midBandGain: 0,
      highShelfFreq: 3200,
      highShelfGain: 9,
      makeupGain: 3,
    },
  ],
}
