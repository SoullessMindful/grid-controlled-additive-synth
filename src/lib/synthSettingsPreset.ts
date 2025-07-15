import { EffectNodeSettings } from './audioNodes/EffectChainNode'
import { Envelope } from './envelope'
import { FilterParameters } from './filterParameters'
import { Octave } from './octave'
import { clearPreset } from './synthSettingsPresets/clearPreset'
import { drawbarOrgans } from './synthSettingsPresets/drawbarOrgans'
import { harshRythm } from './synthSettingsPresets/harshRythm'
import { kick } from './synthSettingsPresets/kick'
import { simpleBass } from './synthSettingsPresets/simpleBass'
import { simpleOrgans } from './synthSettingsPresets/simpleOrgans'
import { simplePercussive } from './synthSettingsPresets/simplePercussive'
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
  effectChainSettings: EffectNodeSettings[]
}

export const availablePresets = [
  clearPreset,
  simpleBass,
  simpleOrgans,
  drawbarOrgans,
  harshRythm,
  kick,
  simplePercussive,
]
