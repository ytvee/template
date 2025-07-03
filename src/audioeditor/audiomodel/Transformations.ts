import { TimeSignature } from "@/audioeditor/audiomodel/types";
/**
 *
 * @param tempo
 * @param timeSignature
 * @returns duration on each bar in seconds
 */
export function getBarDurationSeconds(tempo: number, timeSignature: TimeSignature): number {
  const wholeNoteDurationSeconds = 240 / tempo; //INFO: quarterNoteDurationSeconds = 1 / tempo * 60; wholeNoteDurationSeconds = quarterNoteDurationSeconds * 4;
  const barDurationSeconds = (wholeNoteDurationSeconds / timeSignature.lower) * timeSignature.upper;
  return barDurationSeconds;
}
/**
 * Works with duration. 0 seconds are equal to 0 bars
 * @param seconds time to convert
 * @param tempo tempo in quarter notes per minute
 * @param timeSignature
 * @returns
 */
export function convertSecondsToBars(seconds: number, tempo: number, timeSignature: TimeSignature): number {
  const barDurationSeconds = getBarDurationSeconds(tempo, timeSignature);
  return seconds / barDurationSeconds;
}
export function convertBarsToSeconds(bars: number, tempo: number, timeSignature: TimeSignature): number {
  const barDurationSeconds = getBarDurationSeconds(tempo, timeSignature);
  return bars * barDurationSeconds;
}

/**
 * Works with tranformation. So 0 seconds are equal to 1 bars. Subject to rounding errors
 * @param seconds
 * @param tempo
 * @param timeSignature
 * @param subdivisionDepth 0 equals to bars with no subdivision. 1 equals to subdivisions at the level of timeSignature. Example: 1.1 1.2 1.3 1.4 2.1 and so on. 2 and greater is subdivisions of main beats. 1.1.1 1.1.2 1.1.1.1 1.1.1.2 and so on
 * @returns array with bars and bar subdivisions [bar, mainBarBeat, firstSubdivisionOfMainBarBeat, ..., lastSubdivisionOfMainBarBeat, reminder]. last element is reminder in measure of last subdivision. So [1, 1, 0.5] means that it is bar 1; beat 1 of this bar; and 0.5 of beat
 */
export function transformSecondsToBars(seconds: number, tempo: number, timeSignature: TimeSignature, subdivisionDepth = 0): Array<number> {
  const barDurationSeconds = getBarDurationSeconds(tempo, timeSignature);
  let subdivisionDuration = barDurationSeconds;
  const wholeBarNumber = Math.floor(seconds / subdivisionDuration) + 1;
  const barsArray = [wholeBarNumber];

  let reminderSeconds = seconds % subdivisionDuration;
  if (subdivisionDepth) {
    subdivisionDuration /= timeSignature.upper;
    barsArray.push(Math.floor(reminderSeconds / subdivisionDuration) + 1);
    reminderSeconds = reminderSeconds % subdivisionDuration;

    for (let i = 2; i <= subdivisionDepth; i++) {
      subdivisionDuration = subdivisionDuration / 2;
      barsArray.push(Math.floor(reminderSeconds / subdivisionDuration) + 1);
      reminderSeconds = reminderSeconds % subdivisionDuration;
    }
  }
  const reminderBarSubdivision = reminderSeconds / subdivisionDuration;

  barsArray.push(reminderBarSubdivision);
  return barsArray;
}

/**
 *
 * @param bars Array in format: [bar, mainBarBeat, firstSubdivisionOfMainBarBeat, ..., lastSubdivisionOfMainBarBeat, reminder]. reminder - fractional part of lastSubdivisionOfMainBarBeat must be provided. Reminder should be 0<=reminder<1
 * @param tempo
 * @param timeSignature
 * @returns
 */
export function transformBarsToSeconds(bars: Array<number>, tempo: number, timeSignature: TimeSignature): number {
  if (bars.length < 2) {
    bars.push(0); //complete reminder if not provided;
  }
  const barDurationSeconds = getBarDurationSeconds(tempo, timeSignature);
  let subdivisionDuration = barDurationSeconds;
  let result = (bars[0] - 1) * subdivisionDuration;

  if (bars.length >= 3) {
    subdivisionDuration = subdivisionDuration / timeSignature.upper;
    result += (bars[1] - 1) * subdivisionDuration;
    for (let i = 2; i < bars.length - 1; i++) {
      subdivisionDuration / 2;
      result += (bars[i] - 1) * subdivisionDuration;
    }
  }
  result += bars[bars.length - 1] * subdivisionDuration; //INFO: reminder value counts from 0

  return result;
}

/**
 * equal to transformSecondsToBars. But reminder always rounded 0.
 * @param seconds
 * @param tempo
 * @param timeSignature
 * @param subdivisionDepth
 */
export function transformSecondsToBarsWithRound(seconds: number, tempo: number, timeSignature: TimeSignature, subdivisionDepth = 0) {
  //TODO: probably can be optimized
  const barsArray = transformSecondsToBars(seconds, tempo, timeSignature, subdivisionDepth);
  if (Math.round(barsArray[barsArray.length - 1])) {
    for (let i = 0; i < barsArray.length - 1; i++) {
      barsArray[i] += 1;
    }
  }
  barsArray[barsArray.length - 1] = 0;
  return barsArray;
}
