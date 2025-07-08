export type EQEffectNodeSettings = {
  __type__: 'eq'
  lowShelfGain: AudioParam
  lowShelfFreq: AudioParam
  midBandGain: AudioParam
  midBandFreq: AudioParam
  highShelfGain: AudioParam
  highShelfFreq: AudioParam
  makeupGain: AudioParam
}

export class EQEffectNode {
  input: GainNode
  private lowShelfNode: BiquadFilterNode
  private midBandNode: BiquadFilterNode
  private highShelfNode: BiquadFilterNode
  private makeupGainNode: GainNode

  constructor(ctx: BaseAudioContext) {
    this.input = ctx.createGain()
    this.input.gain.value = 1

    this.lowShelfNode = ctx.createBiquadFilter()
    this.lowShelfNode.type = 'lowshelf'
    this.lowShelfNode.Q.value = 1.4
    this.lowShelfNode.gain.value = 0
    this.lowShelfNode.frequency.value = 200

    this.midBandNode = ctx.createBiquadFilter()
    this.midBandNode.type = 'peaking'
    this.midBandNode.Q.value = 1.4
    this.midBandNode.gain.value = 0
    this.midBandNode.frequency.value = 800

    this.highShelfNode = ctx.createBiquadFilter()
    this.highShelfNode.type = 'highshelf'
    this.highShelfNode.Q.value = 1.4
    this.highShelfNode.gain.value = 0
    this.highShelfNode.frequency.value = 3200

    this.makeupGainNode = ctx.createGain()
    this.makeupGainNode.gain.value = 1
    
    this.input.connect(this.lowShelfNode)
    this.lowShelfNode.connect(this.midBandNode)
    this.midBandNode.connect(this.highShelfNode)
    this.highShelfNode.connect(this.makeupGainNode)
  }

  connect(node: AudioNode) {
    this.makeupGainNode.connect(node)
  }

  disconnect() {
    this.makeupGainNode.disconnect()
  }

  get settings(): EQEffectNodeSettings {
    return {
      __type__: 'eq',
      lowShelfFreq: this.lowShelfNode.frequency,
      lowShelfGain: this.lowShelfNode.gain,
      midBandFreq: this.midBandNode.frequency,
      midBandGain: this.midBandNode.gain,
      highShelfFreq: this.highShelfNode.frequency,
      highShelfGain: this.highShelfNode.gain,
      makeupGain: this.makeupGainNode.gain,
    }
  }
}

export function createEQEffectNode(ctx: BaseAudioContext): EQEffectNode {
  return new EQEffectNode(ctx)
}