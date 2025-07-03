import * as Tone from "customized-tone";
import { TransportClass } from "customized-tone/build/esm/core/clock/Transport";
import { Time } from "customized-tone/build/esm/core/type/Units";

export async function initializeTone() {
  await Tone.start();
}

export function createPlayer(sampleUrl: string) {
  return new Promise<Tone.Player>((resolve) => {
    const player = new Tone.Player(sampleUrl, () => {
      resolve(player);
    });
  });
}

export function workaroundWholeDurationBug(timeToFix: Time) {
  return timeToFix === "1n" ? Tone.Time("2n").toSeconds() * 2 : timeToFix;
}

/**
 * The call to Math.floor is very important. Because this is how the time in ticks is rounded when creating an event internal in Tone.js. If you don't do this, the events will not always be called at startup. https://github.com/Tonejs/Tone.js/issues/1294
 * @param seconds
 * @returns
 */
function quantizeSecondsToTicks(seconds: number): number {
  return Math.floor(Tone.Time(seconds).toTicks());
}
/**
 * Work around Tone.js bug. Event positions are tied to time values rounded down in Tone.js. At the same time, the transport position is not rounded when assigned. https://github.com/Tonejs/Tone.js/issues/1294
 * Usage: Always use this method to set the Transport position instead of do it directly! Also schedule events with Tone.Ticks(Tone.getTransport().ticks) not with seconds!
 * @param seconds non quantized seconds
 */
export function setTransportPositionQuantized(seconds: number, transport: TransportClass = Tone.getTransport()) {
  const ticks = quantizeSecondsToTicks(seconds);
  transport.ticks = ticks;
}
