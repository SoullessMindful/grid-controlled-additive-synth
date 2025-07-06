export type Voice = {
  level: number
  detune: number
  pan: number
  delay: number
  active: boolean
  flipPhase: boolean
}

export const defaultFirstVoice: Voice = {
  level: 1,
  detune: 0,
  pan: 0,
  delay: 0,
  active: true,
  flipPhase: false,
}

export const defaultVoice: Voice = {
  level: 0,
  detune: 0,
  pan: 0,
  delay: 0,
  active: true,
  flipPhase: false,
}

export const defaultVoices = [defaultFirstVoice]

export const MAX_VOICES_COUNT = 7

export function voicePhase(voice: Voice): 1 | -1 {
  return voice.flipPhase ? -1 : 1
}