import { DelayEffectNode, DelayEffectNodeSettings } from './DelayEffectNode'

export type EffectNode = DelayEffectNode
export type EffectNodeSettings = DelayEffectNodeSettings

export class EffectChainNode {
  input: GainNode
  private outputNode: GainNode
  private effectNodes: EffectNode[]

  constructor(ctx: BaseAudioContext) {
    this.input = ctx.createGain()
    this.input.gain.value = 1
    this.outputNode = ctx.createGain()
    this.outputNode.gain.value = 1

    this.effectNodes = []
  }

  connect(node: AudioNode) {
    this.outputNode.connect(node)
  }

  disconnect() {
    this.outputNode.disconnect()
  }

  addEffect(effect: EffectNode, i: number = this.effectNodes.length) {
    const beforeEffectNodes = this.effectNodes.filter((_, j) => j < i)
    const afterEffectNodes = this.effectNodes.filter((_, j) => j >= i)

    this.internallyDisconnect()
    this.effectNodes = [...beforeEffectNodes, effect, ...afterEffectNodes]
    this.internallyConnect()
  }

  removeEffect(i: number) {
    const beforeEffectNodes = this.effectNodes.filter((_, j) => j < i)
    const afterEffectNodes = this.effectNodes.filter((_, j) => j > i)

    this.internallyDisconnect()
    this.effectNodes = [...beforeEffectNodes, ...afterEffectNodes]
    this.internallyConnect()
  }

  switchEffects(i1: number, i2: number) {
    this.internallyDisconnect()

    this.effectNodes = this.effectNodes.map((effect, j) =>
      j === i1 ? this.effectNodes[i2] : j === i2 ? this.effectNodes[i1] : effect
    )

    this.internallyConnect()
  }
  
  get settings(): EffectNodeSettings[] {
    return this.effectNodes.map((effect) => effect.settings)
  }

  private internallyDisconnect() {
    this.input.disconnect()
    this.effectNodes.forEach((effect) => {
      effect.disconnect()
    })
  }

  private internallyConnect() {
    if (this.effectNodes.length === 0) {
      this.input.connect(this.outputNode)

      return
    }

    this.input.connect(this.effectNodes[0].input)

    for (let i = 0; i + 1 < this.effectNodes.length; i++) {
      this.effectNodes[i].connect(this.effectNodes[i + 1].input)
    }

    this.effectNodes[this.effectNodes.length - 1].connect(this.outputNode)
  }
}

export function createEffectChainNode(ctx: BaseAudioContext): EffectChainNode {
  return new EffectChainNode(ctx)
}