import { createMixNode, MixNode } from "./MixNode"

export type CompressorEffectNodeSettings = {
  __type__: 'compressor'
  threshold: number
  attack: number
  release: number
  ratio: number
  makeupGain: number
  mix: number
}

export class CompressorEffectNode {
  input: GainNode
  private compressorNode: DynamicsCompressorNode
  private makeupGainNode: GainNode
  private mixNode: MixNode

  constructor (ctx: BaseAudioContext) {
    this.input = ctx.createGain()
    this.input.gain.value = 1

    this.compressorNode = ctx.createDynamicsCompressor()
    this.compressorNode.threshold.value = 0
    this.compressorNode.ratio.value = 5
    
    this.makeupGainNode = ctx.createGain()
    this.makeupGainNode.gain.value = 1

    this.mixNode = createMixNode(ctx)
    this.mixNode.mix.value = 1

    this.input.connect(this.compressorNode)
    this.input.connect(this.mixNode.dry)
    this.compressorNode.connect(this.mixNode.wet)
  }

  connect(node: AudioNode) {
    this.mixNode.connect(node)
  }

  disconnect() {
    this.mixNode.disconnect()
  }

  get settings(): CompressorEffectNodeSettings {
    return {
      __type__: 'compressor',
      mix: this.mixNode.mix.value,
      ratio: this.compressorNode.ratio.value,
      attack: this.compressorNode.attack.value,
      release: this.compressorNode.release.value,
      threshold: this.compressorNode.threshold.value,
      makeupGain: this.makeupGainNode.gain.value,
    }
  }

  setSettings(newSettings: CompressorEffectNodeSettings) {
    const settings = this.settings

    if (settings.mix !== newSettings.mix && newSettings.mix >= 0 && newSettings.mix <= 1) {
      this.mixNode.mix.value = newSettings.mix
    }

    if (settings.ratio !== newSettings.ratio && newSettings.ratio >= 1 && newSettings.ratio <= 20) {
      this.compressorNode.ratio.value = newSettings.ratio
    }

    if (settings.attack !== newSettings.attack && newSettings.attack >= 0 && newSettings.attack <= 1) {
      this.compressorNode.attack.value = newSettings.attack
    }

    if (settings.release !== newSettings.release && newSettings.release >= 0 && newSettings.release <= 1) {
      this.compressorNode.release.value = newSettings.release
    }

    if (settings.threshold !== newSettings.threshold && newSettings.threshold >= -60 && newSettings.threshold <= 0) {
      this.compressorNode.threshold.value = newSettings.threshold
    }

    if (settings.makeupGain !== newSettings.makeupGain && newSettings.makeupGain >= 0 && newSettings.makeupGain <= 1) {
      this.makeupGainNode.gain.value = newSettings.makeupGain
    }
  }
}

export function createCompressorEffectNode(ctx: BaseAudioContext) {
  return new CompressorEffectNode(ctx)
}