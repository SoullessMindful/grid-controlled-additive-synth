import { createMixNode, MixNode } from '../MixNode'

export type DelayEffectNodeSettings = {
  __type__: 'delay'
  time: number
  feedback: number
  mix: number
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
      mix: this.mixNode.mix.value,
      time: this.delayNode.delayTime.value,
      feedback: this.feedbackNode.gain.value,
    }
  }

  setSettings(newSettings: DelayEffectNodeSettings) {
    const settings = this.settings

    if (
      settings.mix !== newSettings.mix &&
      newSettings.mix >= 0 &&
      newSettings.mix <= 1
    ) {
      this.mixNode.mix.value = newSettings.mix
    }

    if (
      settings.time !== newSettings.time &&
      newSettings.time >= 0 &&
      newSettings.time <= 1
    ) {
      this.delayNode.delayTime.value = newSettings.time
    }

    if (
      settings.feedback !== newSettings.feedback &&
      newSettings.feedback >= 0 &&
      newSettings.feedback <= 1
    ) {
      this.feedbackNode.gain.value = newSettings.feedback
    }
  }
}

export function createDelayEffectNode(ctx: BaseAudioContext): DelayEffectNode {
  return new DelayEffectNode(ctx)
}
