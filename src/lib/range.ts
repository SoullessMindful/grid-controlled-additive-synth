export function range(min: number, length: number, step: number = 1): number[] {
  if (length < 0) {
    throw new Error('Length must be a non-negative integer.')
  }

  if (step <= 0) {
    throw new Error('Step must be a positive number.')
  }

  const result: number[] = []
  for (let i = 0; i < length; i++) {
    result.push(min + i * step)
  }

  return result
}

export function range2d(
  [minX, lengthX, stepX = 1]: [number, number] | [number, number, number],
  [minY, lengthY, stepY = 1]: [number, number] | [number, number, number]
): [number, number][][] {
  return range(minX, lengthX, stepX).map((x) =>
    range(minY, lengthY, stepY).map((y) => [x, y])
  )
}

export function range2dFlat(
  [minX, lengthX, stepX = 1]: [number, number] | [number, number, number],
  [minY, lengthY, stepY = 1]: [number, number] | [number, number, number]
): [number, number][] {
  return range(minX, lengthX, stepX).flatMap((x) =>
    range(minY, lengthY, stepY).map((y) => [x, y] as [number, number])
  )
}
