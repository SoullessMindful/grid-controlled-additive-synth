const BUFFER_SIZE = 384000
const BUFFERS_COUNT = 17

const buffers: Float32Array[] = Array(BUFFERS_COUNT)
  .fill(0)
  .map(() => {
    const array = new Float32Array(BUFFER_SIZE)

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.random() * 2 - 1
    }

    return array
  })
  
let i = 0

function getBuffer() {
  const buffer = buffers[i++]

  if (i>= BUFFERS_COUNT) {
    i = 0
  }

  return buffer
}

export class WhiteNoiseNode {
  private sourceNode: AudioBufferSourceNode
  private offset: number

  constructor(ctx: BaseAudioContext) {
    const audioBuffer = ctx.createBuffer(2, BUFFER_SIZE, ctx.sampleRate)
    const buffer = getBuffer()
    audioBuffer.copyToChannel(buffer, 0)
    audioBuffer.copyToChannel(buffer, 1)

    this.sourceNode = ctx.createBufferSource()
    this.sourceNode.buffer = audioBuffer
    this.sourceNode.loop = true
    
    this.offset = Math.random() * BUFFER_SIZE / ctx.sampleRate
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
}

export function createWhiteNoiseNode(ctx: BaseAudioContext) {
  return new WhiteNoiseNode(ctx)
}