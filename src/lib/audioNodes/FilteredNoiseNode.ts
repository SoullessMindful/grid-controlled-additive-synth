import { createNoiseNode, NoiseNode, NoiseType } from './NoiseNode'

export class FilteredNoiseNode {
  private noiseNode: NoiseNode
  private filterNode: BiquadFilterNode
  private makeupGainNode: GainNode

  constructor(ctx: BaseAudioContext, noiseType: NoiseType) {
    this.noiseNode = createNoiseNode(ctx, noiseType)

    this.filterNode = ctx.createBiquadFilter()
    this.filterNode.type = 'bandpass'

    this.makeupGainNode = ctx.createGain()

    this.noiseNode.connect(this.filterNode)
    this.filterNode.connect(this.makeupGainNode)
  }

  start(when?: number) {
    this.noiseNode.start(when)
  }

  stop(when?: number) {
    this.noiseNode.stop(when)
  }

  connect(node: AudioNode) {
    this.makeupGainNode.connect(node)
  }

  disconnect() {
    this.makeupGainNode.disconnect()
  }

  get frequency(): AudioParam {
    return this.filterNode.frequency
  }

  get detune(): AudioParam {
    return this.filterNode.detune
  }

  get Q(): AudioParam {
    return this.filterNode.Q
  }

  get gain(): AudioParam {
    return this.makeupGainNode.gain
  }

  set onended(callback: (ev: Event) => any) {
    this.noiseNode.onended = callback
  }
}

export function createFilteredNoiseNode(
  ctx: BaseAudioContext,
  noiseType: NoiseType
) {
  return new FilteredNoiseNode(ctx, noiseType)
}
