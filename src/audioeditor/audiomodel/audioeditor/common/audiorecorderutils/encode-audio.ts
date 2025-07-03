import { ToneAudioBuffer } from "packages/customized-tone/build/esm";

/* common for AudioRecorder and OfflineAudioRecorder */
const BITS_IN_BYTE = 8;
/**
 * encode default wave header and put into dataView. default length of header 44 bytes
 * @param {*} dataView will be filled with header
 * @param {*} options bitsPerSample, sampleRate, channelCount, dataLength
 */
function encodeHeader(dataView: DataView, options: any, headerLength: number) {
  dataView.setUint8(0, "R".charCodeAt(0)); // 1-4 (count from 1) .Marks the file as a riff file. Characters are each 1 byte long.
  dataView.setUint8(1, "I".charCodeAt(0));
  dataView.setUint8(2, "F".charCodeAt(0));
  dataView.setUint8(3, "F".charCodeAt(0));
  dataView.setUint32(4, headerLength - 8 + options.dataLength, true); // 5-8 .Size of the overall file - 8 bytes, in bytes (32-bit integer). Typically, you'd fill this in after creation. file-size (equals file-size - 8)
  dataView.setUint8(8, "W".charCodeAt(0)); // 9-12 .File Type Header. For our purposes, it always equals "WAVE".
  dataView.setUint8(9, "A".charCodeAt(0));
  dataView.setUint8(10, "V".charCodeAt(0));
  dataView.setUint8(11, "E".charCodeAt(0));
  dataView.setUint8(12, "f".charCodeAt(0)); // 13-16 .'fmt ' Format chunk marker. Includes trailing null
  dataView.setUint8(13, "m".charCodeAt(0));
  dataView.setUint8(14, "t".charCodeAt(0));
  dataView.setUint8(15, " ".charCodeAt(0));
  dataView.setUint32(16, 16, true); // 17-20 .Length of format data.  Always 16.
  dataView.setUint16(20, 1, true); // 21-22 .Type of format (1 is PCM) - 2 byte integer
  dataView.setUint16(22, options.channelCount, true); // 23-24 .Number of Channels - 2 byte integer
  dataView.setUint32(24, options.sampleRate, true); //	25-28 .Sample Rate - 32 byte integer. Common values are 44100 (CD), 48000 (DAT). Sample Rate = Number of Samples per second, or Hertz.
  dataView.setUint32(28, (options.sampleRate * options.bitsPerSample * options.channelCount) / BITS_IN_BYTE, true); // 29-32 .(Sample Rate * BitsPerSample * Channels) / 8.
  dataView.setUint16(32, (options.bitsPerSample * options.channelCount) / BITS_IN_BYTE, true); //(BitsPerSample * Channels) / 8 .1 - 8 bit mono; 2 - 8 bit stereo/16 bit mono; 4 - 16 bit stereo
  dataView.setUint16(34, options.bitsPerSample, true); //Bits per sample
  dataView.setUint8(36, "d".charCodeAt(0));
  dataView.setUint8(37, "a".charCodeAt(0));
  dataView.setUint8(38, "t".charCodeAt(0));
  dataView.setUint8(39, "a".charCodeAt(0));
  dataView.setUint32(40, options.dataLength, true); //Size of the data section. data-size (equals file-size - 44)
}
/* /common for AudioRecorder and OfflineAudioRecorder */

/* AudioRecorder */
/**
 * encode data from pure array (array of arrays with channel data in Float32Array) to wave format file
 * @param {*} chunks
 * @param {*} options bitsPerSample, sampleRate, channelCount
 * @returns
 */
export function encodePureArraysToWaveFile(chunks: Array<Array<Float32Array>>, options: any) {
  const headerLength = 44; //length of default header
  const firstChannelIndex = 0; //the index of first channel. Used for calculations

  const sampleCount = chunks.reduce((accumulator: number, chunk: Array<Float32Array>) => {
    return accumulator + chunk[firstChannelIndex].length;
  }, 0);
  const dataLength = (options.bitsPerSample * options.channelCount * sampleCount) / BITS_IN_BYTE; // length of sound data in bytes

  const arrayBuffer = new ArrayBuffer(headerLength + dataLength);
  const dataView = new DataView(arrayBuffer);

  // const headerOptions = { //test
  //   bitsPerSample: 16,
  //   sampleRate: 48000,
  //   channelCount: 2,
  //   dataLength: dataLength,
  // }
  const headerOptions = {
    bitsPerSample: options.bitsPerSample,
    sampleRate: options.sampleRate,
    channelCount: options.channelCount,
    dataLength: dataLength,
  };
  encodeHeader(dataView, headerOptions, headerLength);

  let dataViewIndex = headerLength;
  const dataViewIndexStep = options.bitsPerSample / BITS_IN_BYTE;

  for (const chunk of chunks) {
    for (let i = 0; i < chunk[firstChannelIndex].length; i++) {
      for (let channel = 0; channel < chunk.length; channel++) {
        dataView.setInt16(dataViewIndex, chunk[channel][i] * 0x7fff, true); //each channel shifts to previous channel in file.
        dataViewIndex += dataViewIndexStep;
      }
    }
  }
  return new Blob([dataView], { type: "audio/wav" });
}
/* /AudioRecorder */

/* OfflineAudioRecorder */
export function encodeAudioBufferToWaveFile(audioBuffer: AudioBuffer | ToneAudioBuffer, options: any) {
  const headerLength = 44; //length of default header
  const firstChannelIndex = 0; //the index of first channel. Used for calculations

  const sampleCount = audioBuffer.length;
  const channelCount = audioBuffer.numberOfChannels;

  const dataLength = (options.bitsPerSample * channelCount * sampleCount) / BITS_IN_BYTE; // length of sound data in bytes

  const arrayBuffer = new ArrayBuffer(headerLength + dataLength);
  const dataView = new DataView(arrayBuffer);
  options = {
    bitsPerSample: options.bitsPerSample,
    sampleRate: audioBuffer.sampleRate,
    channelCount: channelCount,
    dataLength: dataLength,
  };
  encodeHeader(dataView, options, headerLength);

  const channels = [];
  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    channels.push(audioBuffer.getChannelData(i));
  }

  let viewDataIndex = headerLength;
  let sample;

  for (let i = 0; i < channels[firstChannelIndex].length; i++) {
    for (let j = 0; j < channelCount; j++) {
      // interleave channels
      sample = Math.max(-1, Math.min(1, channels[j][i])); // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int //TODO: make more universally
      dataView.setInt16(viewDataIndex, sample, true); // write 16-bit sample
      viewDataIndex += 2;
    } // next source sample
  }
  return new Blob([dataView], { type: "audio/wav" });
}
/* /OfflineAudioRecorder */
