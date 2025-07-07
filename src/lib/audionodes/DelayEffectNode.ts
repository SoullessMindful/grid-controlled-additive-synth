import { createMixNode, MixNode } from './MixNode'

export type DelayEffectNodeSettings = {
  __type__: 'delay'
  time: AudioParam
  feedback: AudioParam
  mix: AudioParam
}

export class DelayEffectNode {
  input: GainNode
  private delayNode: DelayNode
  private feedbackNode: GainNode
  private mixNode: MixNode

  constructor(ctx: BaseAudioContext) {
    this.input = ctx.createGain()
    this.input.gain.value = 1

    this.delayNode = ctx.createDelay()

    this.feedbackNode = ctx.createGain()
    this.feedbackNode.gain.value = 0

    this.mixNode = createMixNode(ctx)

    this.input.connect(this.delayNode)
    this.input.connect(this.mixNode.dry)
    this.delayNode.connect(this.feedbackNode)
    this.delayNode.connect(this.mixNode.wet)
    this.feedbackNode.connect(this.delayNode)
  }

  connect(node: AudioNode) {
    this.mixNode.connect(node)
  }

  disconnect() {
    this.mixNode.disconnect()
  }

  get settings(): DelayEffectNodeSettings {
    return {
      __type__: 'delay',
      mix: this.mixNode.mix,
      time: this.delayNode.delayTime,
      feedback: this.feedbackNode.gain,
    }
  }
}

export function createDelayEffectNode(ctx: BaseAudioContext): DelayEffectNode {
  return new DelayEffectNode(ctx)
}