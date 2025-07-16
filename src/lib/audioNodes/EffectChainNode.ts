import {
  CompressorEffectNode,
  CompressorEffectNodeSettings,
  createCompressorEffectNode,
} from './effectNodes/CompressorEffectNode'
import {
  createDefaultEffectNode,
  DefaultEffectNode,
  DefaultEffectNodeSettings,
} from './effectNodes/DefaultEffectNode'
import {
  createDelayEffectNode,
  DelayEffectNode,
  DelayEffectNodeSettings,
} from './effectNodes/DelayEffectNode'
import {
  createEQEffectNode,
  EQEffectNode,
  EQEffectNodeSettings,
} from './effectNodes/EQEffectNode'

export type EffectNode = {
  node:
    | DefaultEffectNode
    | DelayEffectNode
    | EQEffectNode
    | CompressorEffectNode
  active: boolean
}
export type EffectNodeType = 'default' | 'delay' | 'eq' | 'compressor'
export type EffectNodeSettings = (
  | DefaultEffectNodeSettings
  | DelayEffectNodeSettings
  | EQEffectNodeSettings
  | CompressorEffectNodeSettings
) & {
  active: boolean
}

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

    this.internallyConnect()
  }

  connect(node: AudioNode) {
    this.outputNode.connect(node)
  }

  disconnect() {
    this.outputNode.disconnect()
  }

  addEffect(
    effectType: EffectNodeType = 'default',
    i: number = this.effectNodes.length
  ) {
    let effect: EffectNode
    switch (effectType) {
      case 'default':
        effect = {
          node: createDefaultEffectNode(this.input.context),
          active: true,
        }
        break

      case 'eq':
        effect = {
          node: createEQEffectNode(this.input.context),
          active: true,
        }
        break

      case 'delay':
        effect = {
          node: createDelayEffectNode(this.input.context),
          active: true,
        }
        break

      case 'compressor':
        effect = {
          node: createCompressorEffectNode(this.input.context),
          active: true,
        }
        break
    }

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

  changeEffect(effectType: EffectNodeType, i: number) {
    this.removeEffect(i)
    this.addEffect(effectType, i)
  }

  setEffectActive(active: boolean, i: number) {
    this.internallyDisconnect()
    this.effectNodes[i].active = active
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
    return this.effectNodes.map((effect) => ({
      ...effect.node.settings,
      active: effect.active,
    }))
  }

  setSettings(newSettings: EffectNodeSettings, i: number) {
    const effectNode = this.effectNodes[i]
    const settings = effectNode.node.settings

    if (settings.__type__ === newSettings.__type__) {
      switch (newSettings.__type__) {
        case 'delay':
          ;(effectNode.node as DelayEffectNode).setSettings(newSettings)
          break

        case 'eq':
          ;(effectNode.node as EQEffectNode).setSettings(newSettings)
          break

        case 'compressor':
          ;(effectNode.node as CompressorEffectNode).setSettings(newSettings)
          break
      }
    }
  }

  recreateEffectChain(newSettings: EffectNodeSettings[]) {
    this.internallyDisconnect()

    this.effectNodes = newSettings.map((es) => {
      let en: EffectNode
      let node
      const active = es.active

      switch (es.__type__) {
        case 'default':
          node = createDefaultEffectNode(this.input.context)
          en = {
            node,
            active,
          }
          node.setSettings(es)
          break

        case 'delay':
          node = createDelayEffectNode(this.input.context)
          en = {
            node,
            active,
          }
          node.setSettings(es)
          break

        case 'eq':
          node = createEQEffectNode(this.input.context)
          en = {
            node,
            active,
          }
          node.setSettings(es)
          break

        case 'compressor':
          node = createCompressorEffectNode(this.input.context)
          en = {
            node,
            active,
          }
          node.setSettings(es)
          break
      }

      return en
    })

    this.internallyConnect()
  }

  private internallyDisconnect() {
    this.input.disconnect()
    this.effectNodes.forEach((effect) => {
      effect.node.disconnect()
    })
  }

  private internallyConnect() {
    const activeEffectNodes = this.effectNodes.filter((en) => en.active)

    if (activeEffectNodes.length === 0) {
      this.input.connect(this.outputNode)

      return
    }

    this.input.connect(activeEffectNodes[0].node.input)

    for (let i = 0; i + 1 < activeEffectNodes.length; i++) {
      activeEffectNodes[i].node.connect(activeEffectNodes[i + 1].node.input)
    }

    activeEffectNodes[activeEffectNodes.length - 1].node.connect(
      this.outputNode
    )
  }
}

export function createEffectChainNode(ctx: BaseAudioContext): EffectChainNode {
  return new EffectChainNode(ctx)
}
