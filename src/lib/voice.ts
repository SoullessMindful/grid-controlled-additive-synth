export type Voice = {
  level: number
  detune: number
  active: boolean
}

export const defaultFirstVoice: Voice = {
  level: 1,
  detune: 0,
  active: true,
}

export const defaultVoice: Voice = {
  level: 0,
  detune: 0,
  active: true,
}

export const defaultVoices = [defaultFirstVoice]