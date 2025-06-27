export type Octave = -2 | -1 | 0 | 1 | 2

export const defaultOctave: Octave = 0

export const availableOctaves: Octave[] = [2, 1, 0, -1, -2]

export function displayOctave(octave: Octave): string {
  return `${octave > 0 ? '+' : ''}${octave}`
}
