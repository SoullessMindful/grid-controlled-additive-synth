export type Envelope = {
  level: number
  attack: number
  decay: number
  sustain: number
  release: number
}

export type EnvelopeProperty = 'level' | 'attack' | 'decay' | 'sustain' | 'release'
export const envelopeProperties: EnvelopeProperty[] = [
  'level',
  'attack',
  'decay',
  'sustain',
  'release',
] as const

export function envelopePropertyToString(
  property: EnvelopeProperty
): string {
  switch (property) {
    case 'level':
      return 'Level'
    case 'attack':
      return 'Attack'
    case 'decay':
      return 'Decay'
    case 'sustain':
      return 'Sustain'
    case 'release':
      return 'Release'
  }
}

export const defaultGlobalEnvelope: Envelope = {
  level: 0.5,
  attack: 0.01,
  decay: 0.1,
  sustain: 0.5,
  release: 0.01,
}

export const defaultOvertoneEnvelope: Envelope = {
  level: 0,
  attack: 0.001,
  decay: 0.001,
  sustain: 1,
  release: 10,
}

export const defaultFirstOvertoneEnvelope: Envelope = {
  level: 1,
  attack: 0.001,
  decay: 0.001,
  sustain: 1,
  release: 10,
}

export function defaultOvertoneEnvelopes(
  count: number
): Envelope[] {
  return Array.from({ length: count }, (_, i) =>
    i === 0 ? defaultFirstOvertoneEnvelope : defaultOvertoneEnvelope
  )
}