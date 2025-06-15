export type RootNote = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

export const rootC: RootNote = 0

export function rootNoteToString(note: RootNote): string {
  return ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][note]
}
export function noteToString(note: number): string {
  const rootNote = (Math.floor(note) % 12) as RootNote
  const octave = Math.floor(note / 12) - 1
  return `${rootNoteToString(rootNote)}${octave}`
}

export type Scale = {
  name: string
  notes: (rootNote: RootNote) => boolean
}

export function isNoteInScale(
  note: number,
  scale: Scale,
  rootNote: RootNote = 0
): boolean {
  return scale.notes((Math.floor(note - rootNote) % 12) as RootNote)
}

export const chromaticScale: Scale = {
  name: 'Chromatic',
  notes: (rootNote: RootNote) => true,
}
export const majorScale: Scale = {
  name: 'Major',
  notes: (rootNote: RootNote) => [0, 2, 4, 5, 7, 9, 11].includes(rootNote),
}
export const minorScale: Scale = {
  name: 'Minor',
  notes: (rootNote: RootNote) => [0, 2, 3, 5, 7, 8, 10].includes(rootNote),
}
export const harmonicMinorScale: Scale = {
  name: 'Harmonic Minor',
  notes: (rootNote: RootNote) => [0, 2, 3, 5, 7, 8, 11].includes(rootNote),
}
export const melodicMinorScale: Scale = {
  name: 'Melodic Minor',
  notes: (rootNote: RootNote) => [0, 2, 3, 5, 7, 9, 11].includes(rootNote),
}
export const pentatonicScale: Scale = {
  name: 'Pentatonic',
  notes: (rootNote: RootNote) => [0, 3, 5, 7, 10].includes(rootNote),
}
export const bluesScale: Scale = {
  name: 'Blues',
  notes: (rootNote: RootNote) => [0, 3, 5, 6, 7, 10].includes(rootNote),
}
export const egyptianScale: Scale = {
  name: 'Egyptian',
  notes: (rootNote: RootNote) => [0, 2, 3, 6, 7, 8, 11].includes(rootNote),
}
export const wholeToneScale: Scale = {
  name: 'Whole Tone',
  notes: (rootNote: RootNote) => [0, 2, 4, 6, 8, 10].includes(rootNote),
}

export const availableScales: Scale[] = [
  chromaticScale,
  majorScale,
  minorScale,
  harmonicMinorScale,
  melodicMinorScale,
  pentatonicScale,
  bluesScale,
  egyptianScale,
  wholeToneScale,
]
