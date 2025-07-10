export type DefaultEffectNodeSettings = {
  __type__: 'default'
}

export class DefaultEffectNode {
  input: GainNode

  constructor(ctx: BaseAudioContext) {
    this.input = ctx.createGain()
    this.input.gain.value = 1
  }

  connect(node: AudioNode) {
    this.input.connect(node)
  }

  disconnect() {
    this.input.disconnect()
  }

  get settings(): DefaultEffectNodeSettings {
    return {
      __type__: 'default',
    }
  }

  setSettings(newSettings: DefaultEffectNodeSettings) {}
}

export function createDefaultEffectNode(ctx: BaseAudioContext): DefaultEffectNode {
  return new DefaultEffectNode(ctx)
}