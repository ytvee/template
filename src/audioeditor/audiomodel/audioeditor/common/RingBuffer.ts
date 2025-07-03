export class RingBuffer {
  private buffer: Float32Array;
  private currentIndex: number;

  constructor(length: number) {
    this.buffer = new Float32Array(length);
    this.currentIndex = this.buffer.length - 1;
  }
  push(element: number) {
    this.currentIndex = (this.currentIndex + 1) % this.buffer.length;
    this.buffer[this.currentIndex] = element;
  }
  getFromStart(i: number) {
    const index = (this.currentIndex + 1 + i) % this.buffer.length;
    return this.buffer[index];
  }
}
