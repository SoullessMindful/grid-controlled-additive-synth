import { range } from '@/lib/range'

export type OverdriveEffectNodeSettings = {
  __type__: 'overdrive'
  gain: number
  volume: number
}

export class OverdriveEffectNode {
  input: GainNode
  private waveShaperNode: WaveShaperNode
  private volumeNode: GainNode

  constructor(ctx: BaseAudioContext) {
    this.input = ctx.createGain()
    this.input.gain.value = 1

    this.waveShaperNode = ctx.createWaveShaper()
    this.waveShaperNode.curve = curve

    this.volumeNode = ctx.createGain()
    this.volumeNode.gain.value = 1

    this.input.connect(this.waveShaperNode)
    this.waveShaperNode.connect(this.volumeNode)
  }

  connect(node: AudioNode) {
    this.volumeNode.connect(node)
  }

  disconnect() {
    this.volumeNode.disconnect()
  }

  get settings(): OverdriveEffectNodeSettings {
    const gain = Math.round(20 * Math.log10(this.input.gain.value))
    const volume = Math.round(20 * Math.log10(this.volumeNode.gain.value))
    return {
      __type__: 'overdrive',
      gain,
      volume,
    }
  }

  setSettings(newSettings: OverdriveEffectNodeSettings) {
    const settings = this.settings
    
    if (
      settings.gain !== newSettings.gain &&
      newSettings.gain >= -15 &&
      newSettings.gain <= 15
    ) {
      this.input.gain.value = Math.pow(
        10,
        newSettings.gain * 0.05
      )
    }

    if (
      settings.volume !== newSettings.volume &&
      newSettings.volume >= -30 &&
      newSettings.volume <= 0
    ) {
      this.volumeNode.gain.value = Math.pow(
        10,
        newSettings.volume * 0.05
      )
    }
  }
}

export function createOverdriveEffectNode(ctx: BaseAudioContext) {
  return new OverdriveEffectNode(ctx)
}

const SAMPLES_HALFCOUNT = 512
const OVERDRIVE_PARAM = 4

const halfCurve = range(1, SAMPLES_HALFCOUNT).map(
  (i) =>
    Math.tanh((OVERDRIVE_PARAM * i) / SAMPLES_HALFCOUNT) /
    (Math.tanh(OVERDRIVE_PARAM) * Math.sqrt(2))
)
const curve = new Float32Array([
  ...halfCurve.map((v) => -v).toReversed(),
  0,
  ...halfCurve,
])
