export type NoiseType = 'white' | 'pink'

const BUFFER_SIZE = 384000
const BUFFERS_COUNT = 17

const buffers = {
  white: Array(BUFFERS_COUNT)
    .fill(0)
    .map(() => {
      const array = new Float32Array(BUFFER_SIZE)

      for (let i = 0; i < BUFFER_SIZE; i++) {
        array[i] = Math.random() * 2 - 1
      }

      return array
    }),
  pink: Array(BUFFERS_COUNT)
    .fill(0)
    .map(() => {
      let b0 = 0,
        b1 = 0,
        b2 = 0,
        b3 = 0,
        b4 = 0,
        b5 = 0,
        b6 = 0

      const array = new Float32Array(BUFFER_SIZE)

      for (let i = 0; i < BUFFER_SIZE; i++) {
        const white = Math.random() * 2 - 1
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.969 * b2 + white * 0.153852
        b3 = 0.8665 * b3 + white * 0.3104856
        b4 = 0.55 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.016898
        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
        b6 = white * 0.115926
        array[i] = pink * 0.11
      }

      return array
    }),
}

let i = 0

function getBuffer(noiseType: NoiseType) {
  const buffer = buffers[noiseType][i++]

  if (i >= BUFFERS_COUNT) {
    i = 0
  }

  return buffer
}

export class NoiseNode {
  private sourceNode: AudioBufferSourceNode
  private offset: number

  constructor(ctx: BaseAudioContext, noiseType: NoiseType) {
    const audioBuffer = ctx.createBuffer(2, BUFFER_SIZE, ctx.sampleRate)
    const buffer = getBuffer(noiseType)
    audioBuffer.copyToChannel(buffer, 0)
    audioBuffer.copyToChannel(buffer, 1)

    this.sourceNode = ctx.createBufferSource()
    this.sourceNode.buffer = audioBuffer
    this.sourceNode.loop = true

    this.offset = (Math.random() * BUFFER_SIZE) / ctx.sampleRate
  }

  start(when?: number) {
    this.sourceNode.start(when, this.offset)
  }

  stop(when?: number) {
    this.sourceNode.stop(when)
  }

  connect(node: AudioNode) {
    this.sourceNode.connect(node)
  }

  disconnect() {
    this.sourceNode.disconnect()
  }

  set onended(callback: (ev: Event) => any) {
    this.sourceNode.onended = callback
  }
}

export function createNoiseNode(ctx: BaseAudioContext, noiseType: NoiseType) {
  return new NoiseNode(ctx, noiseType)
}
