export class MixNode {
  dry: GainNode
  wet: GainNode

  private mixSource: ConstantSourceNode
  private mixGainNode: GainNode
  private flipNode: GainNode

  constructor(ctx: BaseAudioContext) {
    this.dry = ctx.createGain()
    this.dry.gain.value = 1
    this.wet = ctx.createGain()
    this.wet.gain.value = 0

    this.mixSource = ctx.createConstantSource()
    this.mixSource.offset.value = 1
    this.mixGainNode = ctx.createGain()
    this.flipNode = ctx.createGain()
    this.flipNode.gain.value = -1

    this.mixSource.connect(this.mixGainNode)
    this.mixGainNode.connect(this.wet.gain)
    this.mixGainNode.connect(this.flipNode)
    this.flipNode.connect(this.dry.gain)

    this.mixSource.start()
  }

  connect(node: AudioNode) {
    this.dry.connect(node)
    this.wet.connect(node)
  }

  disconnect() {
    this.dry.disconnect()
    this.wet.disconnect()
  }

  get mix(): AudioParam {
    return this.mixGainNode.gain
  }
}

export function createMixNode(ctx: BaseAudioContext): MixNode {
  return new MixNode(ctx)
}
