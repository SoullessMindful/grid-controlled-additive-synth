import { range } from '../range'

export class LimiterNode {
  input: GainNode
  private waveShaperNode: WaveShaperNode
  private reGainNode: GainNode

  constructor(ctx: BaseAudioContext) {
    this.input = ctx.createGain()
    this.input.gain.value = 0.25

    this.waveShaperNode = ctx.createWaveShaper()
    this.waveShaperNode.curve = curve
    
    this.reGainNode = ctx.createGain()
    this.reGainNode.gain.value = 4

    this.input.connect(this.waveShaperNode)
    this.waveShaperNode.connect(this.reGainNode)
  }

  connect(node: AudioNode) {
    this.reGainNode.connect(node)
  }

  disconnect() {
    this.reGainNode.disconnect()
  }
}

export function createLimiterNode(ctx: BaseAudioContext) {
  return new LimiterNode(ctx)
}

function softKneeLimiterCurve(
  x: number,
  kneeStart = 0.125,
  kneeMiddle = 0.18,
  kneeEnd = 0.25
) {
  const absx = Math.abs(x)
  const mean = (kneeStart + kneeMiddle) / 2

  if (absx < kneeStart) return x

  if (absx < kneeMiddle) {
    const t = (absx - kneeStart) / (kneeMiddle - kneeStart)
    const interp = (1 - Math.cos(Math.PI * t)) / 2
    const y = (1 - interp) * absx + interp * mean
    return Math.sign(x) * y
  }

  if (absx < kneeEnd) {
    const t = (absx - kneeMiddle) / (kneeEnd - kneeMiddle)
    const interp = (1 - Math.cos(Math.PI * t)) / 2
    const y = (1 - interp) * mean + interp * kneeMiddle
    return Math.sign(x) * y
  }

  return Math.sign(x) * kneeMiddle
}

const SAMPLES_HALFCOUNT = 512
const KNEE_START = 0.125
const KNEE_MIDDLE = 0.18
const KNEE_END = 0.25

const curve = new Float32Array(
  range(-SAMPLES_HALFCOUNT, 2 * SAMPLES_HALFCOUNT + 1).map((i) =>
    softKneeLimiterCurve(
      i / SAMPLES_HALFCOUNT,
      KNEE_START,
      KNEE_MIDDLE,
      KNEE_END
    )
  )
)
