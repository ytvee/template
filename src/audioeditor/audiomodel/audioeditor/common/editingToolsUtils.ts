import { AnyAudioContext } from "packages/customized-tone/build/esm/core/context/AudioContext";

/**
 *
 * @param audioBuffer buffer to slice
 * @param begin seconds
 * @param end seconds
 * @returns audio buffer slice
 */
export function sliceAudioBuffer(audioContext: AnyAudioContext, audioBuffer: AudioBuffer, begin: number, end?: number): AudioBuffer {
  const duration = audioBuffer.duration;
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;

  let endOffset;
  if (end === undefined) {
    endOffset = audioBuffer.length;
  } else {
    endOffset = Math.floor(sampleRate * end);
  }

  const startOffset = Math.floor(sampleRate * begin);
  const sliceLength = endOffset - startOffset;

  const audioBufferSlice = audioContext.createBuffer(numberOfChannels, sliceLength, sampleRate);

  const float32Array = new Float32Array(sliceLength);
  for (let i = 0; i < numberOfChannels; i++) {
    audioBuffer.copyFromChannel(float32Array, i, startOffset);
    audioBufferSlice.copyToChannel(float32Array, i);
  }

  return audioBufferSlice;
}
