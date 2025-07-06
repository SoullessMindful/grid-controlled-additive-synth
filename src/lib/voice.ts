export type Voice = {
  level: number
  detune: number
  pan: number
  delay: number
  active: boolean
}

export const defaultFirstVoice: Voice = {
  level: 1,
  detune: 0,
  pan: 0,
  delay: 0,
  active: true,
}

export const defaultVoice: Voice = {
  level: 0,
  detune: 0,
  pan: 0,
  delay: 0,
  active: true,
}

export const defaultVoices = [defaultFirstVoice]

export const MAX_VOICES_COUNT = 7
