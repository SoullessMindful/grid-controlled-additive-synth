import { Envelope } from './envelope'
import { FilterParameters } from './filterParameters'
import { Octave } from './octave'
import { clearPreset } from './synthSettingsPresets.ts/clearPreset'
import { drawbarOrgans } from './synthSettingsPresets.ts/drawbarOrgans'
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
  overtoneEnvelopes: Envelope[]
  filterParameters: FilterParameters
}

export const availablePresets = [
  clearPreset,
  simpleBass,
  simpleOrgans,
  drawbarOrgans,
]
