export type EQEffectNodeSettings = {
  __type__: 'eq'
  lowShelfGain: number
  lowShelfFreq: number
  midBandGain: number
  midBandFreq: number
  highShelfGain: number
  highShelfFreq: number
  makeupGain: number
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
      lowShelfFreq: this.lowShelfNode.frequency.value,
      lowShelfGain: this.lowShelfNode.gain.value,
      midBandFreq: this.midBandNode.frequency.value,
      midBandGain: this.midBandNode.gain.value,
      highShelfFreq: this.highShelfNode.frequency.value,
      highShelfGain: this.highShelfNode.gain.value,
      makeupGain: this.makeupGainNode.gain.value,
    }
  }
  
  setSettings(newSettings: EQEffectNodeSettings) {
    const settings = this.settings

    if (settings.lowShelfFreq !== newSettings.lowShelfFreq && newSettings.lowShelfFreq >= 50 && newSettings.lowShelfFreq <= 12800) {
      this.lowShelfNode.frequency.value = newSettings.lowShelfFreq
    }

    if (settings.lowShelfGain !== newSettings.lowShelfGain && newSettings.lowShelfGain >= -15 && newSettings.lowShelfGain <= 15) {
      this.lowShelfNode.gain.value = newSettings.lowShelfGain
    }

    if (settings.midBandFreq !== newSettings.midBandFreq && newSettings.midBandFreq >= 50 && newSettings.midBandFreq <= 12800) {
      this.midBandNode.frequency.value = newSettings.midBandFreq
    }

    if (settings.midBandGain !== newSettings.midBandGain && newSettings.midBandGain >= -15 && newSettings.midBandGain <= 15) {
      this.midBandNode.gain.value = newSettings.midBandGain
    }

    if (settings.highShelfFreq !== newSettings.highShelfFreq && newSettings.highShelfFreq >= 50 && newSettings.highShelfFreq <= 12800) {
      this.highShelfNode.frequency.value = newSettings.highShelfFreq
    }

    if (settings.highShelfGain !== newSettings.highShelfGain && newSettings.highShelfGain >= -15 && newSettings.highShelfGain <= 15) {
      this.highShelfNode.gain.value = newSettings.highShelfGain
    }

    if (settings.makeupGain !== newSettings.makeupGain && newSettings.makeupGain > 0) {
      this.makeupGainNode.gain.value = newSettings.makeupGain
    }
  }
}

export function createEQEffectNode(ctx: BaseAudioContext): EQEffectNode {
  return new EQEffectNode(ctx)
}