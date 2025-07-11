import { Envelope } from './envelope'
import { FilterParameters } from './filterParameters'
import { Octave } from './octave'
import { clearPreset } from './synthSettingsPresets.ts/clearPreset'
import { drawbarOrgans } from './synthSettingsPresets.ts/drawbarOrgans'
import { harshRythm } from './synthSettingsPresets.ts/harshRythm'
import { kick } from './synthSettingsPresets.ts/kick'
import { simpleBass } from './synthSettingsPresets.ts/simpleBass'
import { simpleOrgans } from './synthSettingsPresets.ts/simpleOrgans'
import { Voice } from './voice'

export type SynthSettingsPreset = {
  name: string
  volume: number
  highpassFilterFrequency: number
  lowpassFilterFrequency: number
  octave: Octave
  voices: Voice[]
  globalEnvelope: Envelope
  waveformName: string
  waveformQ?: number
  overtoneEnvelopes: Envelope[]
  filterParameters: FilterParameters
}

export const availablePresets = [
  clearPreset,
  simpleBass,
  simpleOrgans,
  drawbarOrgans,
  harshRythm,
  kick,
]
