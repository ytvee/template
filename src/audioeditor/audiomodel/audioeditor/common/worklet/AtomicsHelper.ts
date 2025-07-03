export function atomicLoadFloat32(float32Array: Float32Array, index: number): number {
  const int32Value = Atomics.load(new Int32Array(float32Array.buffer), index);
  return new Float32Array(new Int32Array([int32Value]).buffer)[0];
}
export function atomicStoreFloat32(float32Array: Float32Array, index: number, float32Value: number): void {
  const int32Value = new Int32Array(new Float32Array([float32Value]).buffer)[0];
  Atomics.store(new Int32Array(float32Array.buffer), index, int32Value);
}
export function atomicLoadFloat64(float64Array: Float64Array, index: number): number {
  const bigInt64Value = Atomics.load(new BigInt64Array(float64Array.buffer), index);
  return new Float64Array(new BigInt64Array([bigInt64Value]).buffer)[0];
}
export function atomicStoreFloat64(float64Array: Float64Array, index: number, float64Value: number) {
  const bigint64Value = new BigInt64Array(new Float64Array([float64Value]).buffer)[0];
  Atomics.store(new BigInt64Array(float64Array.buffer), index, bigint64Value);
}
