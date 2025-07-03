import * as Tone from "customized-tone";

export async function createWorkletNode(toneAudioContext: Tone.BaseContext, name: string, url: string) {
  try {
    return toneAudioContext.createAudioWorkletNode(name);
  } catch (err) {
    try {
      await toneAudioContext.addAudioWorkletModule(url);
    } catch (error) {
      console.error(error);
    }
    return toneAudioContext.createAudioWorkletNode(name);
  }
}
