import { EffectNodeSettings } from './audioNodes/EffectChainNode'
import { Envelope } from './envelope'
import { FilterParameters } from './filterParameters'
import { Octave } from './octave'
import { clearPreset } from './synthSettingsPresets/clearPreset'
import { drawbarOrgansPreset } from './synthSettingsPresets/drawbarOrgans'
import { harshRythmPreset } from './synthSettingsPresets/harshRythm'
import { kickPreset } from './synthSettingsPresets/kick'
import { simpleBassPreset } from './synthSettingsPresets/simpleBass'
import { simpleOrgansPreset } from './synthSettingsPresets/simpleOrgans'
import { simplePercussivePreset } from './synthSettingsPresets/simplePercussive'
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
  simpleBassPreset,
  simpleOrgansPreset,
  drawbarOrgansPreset,
  harshRythmPreset,
  kickPreset,
  simplePercussivePreset,
]
