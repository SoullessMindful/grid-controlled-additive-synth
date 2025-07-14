export function afterDo<Dom, Rng>(func: (arg: Dom) => Rng, afterFunc: () => void): (arg: Dom) => Rng {
  return (arg: Dom) => {
    const result = func(arg)
    afterFunc()
    return result
  }
}